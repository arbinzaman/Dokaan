import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { useUser } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import SaleBarcodeScanner from "@/components/dashBoard/home/sales/saleScanner/SaleBarcodeScanner";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Printer, CheckCircle, Trash2, Search, Plus } from "lucide-react";

const roundCurrency = (value) => Math.round((Number(value) || 0) * 100) / 100;

const AddSaleProduct = () => {
  const [scannedProducts, setScannedProducts] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manualCodeInput, setManualCodeInput] = useState("");

  // Customer info fields
  const [walkInCustomer, setWalkInCustomer] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  // Customer search
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownContainerRef = useRef(null);

  const { user, savedShop } = useUser();
  const { pick } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch shop products for 1-click quick-add chips alongside barcode scanner
  const { data: quickCatalog = [] } = useQuery({
    queryKey: ["products", savedShop?.id],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/products`, {
        params: { shopId: savedShop?.id },
        headers: token ? { Authorization: `${token}` } : undefined,
      });
      return Array.isArray(res.data?.data) ? res.data.data : [];
    },
    enabled: !!savedShop?.id,
  });

  const availableQuickProducts = quickCatalog
    .filter((p) => Number(p.stock ?? p.initialStock ?? 0) > 0)
    .slice(0, 8);

  const totalPrice = roundCurrency(
    scannedProducts.reduce((sum, product) => {
      const unitPrice = Math.max(0, Number(product.salesPrice) || 0);
      const qty = Math.max(1, Number(product.quantity) || 1);
      const disc = Math.min(100, Math.max(0, Number(product.discount) || 0));
      const gross = unitPrice * qty;
      return sum + (gross - (disc / 100) * gross);
    }, 0)
  );

  // Close customer dropdown on outside click or Escape
  useEffect(() => {
    const handleOutside = (e) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(e.target)
      ) {
        setSearchResults([]);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setSearchResults([]);
    };
    document.addEventListener("mousedown", handleOutside);
    window.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  // Debounced customer search with AbortController cleanup
  useEffect(() => {
    if (!searchTerm.trim() || !savedShop?.id) {
      setSearchResults([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const token = Cookies.get("XTOKEN");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/customers/search`,
          {
            params: {
              shopId: savedShop.id,
              search: searchTerm.trim(),
            },
            headers: token ? { Authorization: `${token}` } : undefined,
            signal: controller.signal,
          }
        );
        setSearchResults(
          Array.isArray(response.data?.data) ? response.data.data : []
        );
      } catch (error) {
        if (!axios.isCancel(error)) {
          toast.error("Error searching customers");
        }
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchTerm, savedShop?.id]);

  const handleSelectCustomer = (customer) => {
    setWalkInCustomer(false);
    setCustomerName(customer.name || "");
    setCustomerPhone(customer.phone || "");
    setCustomerEmail(customer.email || "");
    setCustomerAddress(customer.address || "");
    setSearchResults([]);
    setSearchTerm("");
  };

  const searchProductByCode = useCallback(
    async (rawCode) => {
      const code = String(rawCode || "").trim();
      if (!code) return;

      setScanning(true);
      try {
        const token = Cookies.get("XTOKEN");
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/products/scan`,
          { barcode: code, shopId: savedShop?.id },
          { headers: token ? { Authorization: `${token}` } : undefined }
        );

        const found = response.data?.matchedProduct;
        if (!found) {
          toast.error(`Product "${code}" not found.`);
          return;
        }

        const normalizedCode = found.productCode || found.code || code;
        const availableStock =
          found.stock ?? found.initialStock ?? Number.MAX_SAFE_INTEGER;

        if (availableStock <= 0) {
          toast.error(`${found.productName || found.name} is out of stock.`);
          return;
        }

        setScannedProducts((prev) => {
          const existingIndex = prev.findIndex(
            (p) => p.productCode === normalizedCode
          );
          if (existingIndex !== -1) {
            const currentQty = prev[existingIndex].quantity;
            if (currentQty >= availableStock) {
              toast.error(`Only ${availableStock} units available in stock.`);
              return prev;
            }
            toast.success(
              `Incremented ${found.productName || found.name} quantity.`
            );
            return prev.map((item, idx) =>
              idx === existingIndex
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          }

          toast.success(`Added ${found.productName || found.name}.`);
          return [
            ...prev,
            {
              ...found,
              productCode: normalizedCode,
              productName: found.productName || found.name || "Unnamed",
              salesPrice: Number(found.salesPrice ?? 0),
              availableStock,
              quantity: 1,
              discount: 0,
            },
          ];
        });
        setManualCodeInput("");
      } catch (err) {
        console.error("Error fetching product:", err);
        toast.error(
          err?.response?.data?.message || "Product not found for this barcode."
        );
      } finally {
        setScanning(false);
      }
    },
    [savedShop?.id]
  );

  const handleScan = useCallback(
    (barcodeObject) => {
      const scannedCode = barcodeObject?.code;
      if (scannedCode) {
        searchProductByCode(scannedCode);
      }
    },
    [searchProductByCode]
  );

  const updateProductField = (index, field, rawValue) => {
    const num = Number(rawValue);
    setScannedProducts((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        if (field === "quantity") {
          const maxStock = item.availableStock || Number.MAX_SAFE_INTEGER;
          const safeQty = Math.min(
            maxStock,
            Math.max(1, Number.isNaN(num) ? 1 : Math.floor(num))
          );
          return { ...item, quantity: safeQty };
        }
        if (field === "discount") {
          const safeDisc = Math.min(
            100,
            Math.max(0, Number.isNaN(num) ? 0 : num)
          );
          return { ...item, discount: safeDisc };
        }
        if (field === "salesPrice") {
          const safePrice = Math.max(0, Number.isNaN(num) ? 0 : num);
          return { ...item, salesPrice: safePrice };
        }
        return { ...item, [field]: rawValue };
      })
    );
  };

  const removeProduct = (index) => {
    setScannedProducts((prev) => prev.filter((_, idx) => idx !== index));
  };

  const resetCart = () => {
    setScannedProducts([]);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setCustomerAddress("");
    setWalkInCustomer(false);
    setManualCodeInput("");
  };

  const submitSale = async (shouldPrint) => {
    if (isSubmitting) return;

    if (!savedShop?.id || !user?.id) {
      toast.error("Please select a shop before recording a sale.");
      return;
    }

    if (scannedProducts.length === 0) {
      toast.error("Please scan or add at least one product.");
      return;
    }

    const effectiveName = walkInCustomer
      ? "Walk-in Customer"
      : customerName.trim();
    const effectivePhone = walkInCustomer ? "N/A" : customerPhone.trim();

    if (!walkInCustomer && (!effectiveName || !effectivePhone)) {
      toast.error(
        "Please enter customer name & phone, or select Walk-in Customer."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const token = Cookies.get("XTOKEN");
      const soldAt = new Date().toISOString();

      const payload = {
        sellerId: user.id,
        shopId: savedShop.id,
        branch: savedShop.dokaan_location || "",
        soldAt,
        customer: {
          name: effectiveName,
          phone: effectivePhone,
          email: walkInCustomer ? "" : customerEmail.trim(),
          address: walkInCustomer ? "" : customerAddress.trim(),
        },
        products: scannedProducts.map((p) => {
          const lineTotal = roundCurrency(
            p.salesPrice * p.quantity -
              (p.discount / 100) * p.salesPrice * p.quantity
          );
          return {
            code: p.productCode,
            productName: p.productName,
            salesPrice: p.salesPrice,
            quantity: p.quantity,
            totalPrice: lineTotal,
            discount: p.discount,
          };
        }),
      };

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/sales?shopId=${savedShop.id}`,
        payload,
        {
          headers: token ? { Authorization: `${token}` } : undefined,
        }
      );

      const serverInvoice =
        res.data?.invoice || res.data?.data?.invoice || res.data?.data || {};
      const invoiceId =
        serverInvoice.invoiceNumber ||
        serverInvoice.invoiceId ||
        `INV-${Date.now()}`;
      const invoiceType = localStorage.getItem("invoiceType") || "POS";

      const invoiceData = {
        products: scannedProducts,
        totalPrice,
        customer: payload.customer,
        shop: savedShop,
        user,
        invoiceId,
        invoiceNumber: invoiceId,
        invoiceType,
        createdAt: soldAt,
      };

      localStorage.setItem("invoiceData", JSON.stringify(invoiceData));

      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["salesData"] });
      queryClient.invalidateQueries({ queryKey: ["totalSales"] });
      queryClient.invalidateQueries({ queryKey: ["totalSalesCount"] });
      queryClient.invalidateQueries({ queryKey: ["totalRevenue"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["income-statement"] });
      queryClient.invalidateQueries({ queryKey: ["financial-report"] });

      toast.success("Sale recorded successfully!");
      resetCart();

      if (shouldPrint) {
        navigate("/dashboard/preview-invoice?autoPrint=true", {
          state: { invoiceData },
        });
      }
    } catch (error) {
      console.error("Sale submit error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to record sale."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-1 sm:p-6 mb-10">
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          {pick("Point of Sale (POS)", "বিক্রি ও বিলিং (POS)")}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {pick(
            "Step 1: Scan or tap products. Step 2: Select customer or Walk-in. Step 3: Complete & print.",
            "ধাপ ১: পণ্য স্ক্যান বা ট্যাপ করুন। ধাপ ২: কাস্টমার দিন। ধাপ ৩: বিক্রি সম্পন্ন ও প্রিন্ট করুন।"
          )}
        </p>
      </div>

      <section className="space-y-5">
        {/* SCANNER */}
        <div className="rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {pick("1. Scan or Pick Products", "১. পণ্য স্ক্যান বা বাছাই করুন")}
          </h3>
          <SaleBarcodeScanner onScan={handleScan} />

          <div className="mt-4">
            <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
              Manual Barcode Entry
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-4 py-2.5 border rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Type barcode and press Enter..."
                value={manualCodeInput}
                onChange={(e) => setManualCodeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && manualCodeInput.trim()) {
                    e.preventDefault();
                    searchProductByCode(manualCodeInput.trim());
                  }
                }}
                autoComplete="off"
              />
              <button
                type="button"
                disabled={scanning || !manualCodeInput.trim()}
                onClick={() => searchProductByCode(manualCodeInput.trim())}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                <Search size={16} />
                {scanning ? "Searching..." : "Add"}
              </button>
            </div>
          </div>

          {availableQuickProducts.length > 0 && (
            <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Quick Add from Shelf (Click to Scan)
                </span>
                <span className="text-[11px] text-gray-400">
                  Tap any item or type its barcode above
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {availableQuickProducts.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    disabled={scanning}
                    onClick={() => searchProductByCode(item.code)}
                    className="text-left p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/50 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                        {item.name}
                      </p>
                      <Plus
                        size={14}
                        className="text-indigo-500 flex-shrink-0 mt-0.5"
                      />
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                      <span className="font-mono">{item.code}</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 tabular-nums">
                        ৳{Number(item.salesPrice ?? 0).toFixed(0)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CUSTOMER INFO WITH SEARCH */}
        <div
          ref={dropdownContainerRef}
          className="rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Customer Info
            </h3>
            <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={walkInCustomer}
                onChange={(e) => setWalkInCustomer(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Walk-in Customer
            </label>
          </div>

          {!walkInCustomer && (
            <>
              <div className="relative">
                <Input
                  label="Search Existing Customer (Name / Phone / Email)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Start typing to search..."
                  autoComplete="off"
                />

                {isSearching && (
                  <div className="text-xs text-gray-500 mt-1">Searching...</div>
                )}

                {searchResults.length > 0 && (
                  <ul className="absolute left-0 right-0 z-30 max-h-60 overflow-y-auto mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-sm">
                    {searchResults.map((customer) => (
                      <li
                        key={customer.id}
                        className="px-4 py-2.5 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-gray-900 dark:text-gray-100 transition-colors"
                        onClick={() => handleSelectCustomer(customer)}
                      >
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {customer.phone}
                          {customer.email ? ` • ${customer.email}` : ""}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Input
                  label="Customer Name *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Customer full name"
                />
                <Input
                  label="Phone *"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                />
                <Input
                  label="Email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="customer@example.com"
                />
                <Input
                  label="Address"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Delivery or billing address"
                />
              </div>
            </>
          )}
        </div>

        {/* SCANNED PRODUCTS CART */}
        {scannedProducts.length > 0 && (
          <div className="rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Cart ({scannedProducts.length}{" "}
              {scannedProducts.length === 1 ? "item" : "items"})
            </h3>

            <div className="space-y-4">
              {scannedProducts.map((product, index) => {
                const lineTotal = roundCurrency(
                  product.salesPrice * product.quantity -
                    (product.discount / 100) *
                      (product.salesPrice * product.quantity)
                );
                return (
                  <div
                    key={product.productCode}
                    className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40"
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {product.productName}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Code: {product.productCode} •{" "}
                          {product.itemCategory || "General"}
                          {product.availableStock < Number.MAX_SAFE_INTEGER
                            ? ` • Available: ${product.availableStock}`
                            : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeProduct(index)}
                        aria-label={`Remove ${product.productName}`}
                        className="p-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <Input
                        label="Price (৳)"
                        type="number"
                        min="0"
                        step="any"
                        value={product.salesPrice}
                        onChange={(e) =>
                          updateProductField(index, "salesPrice", e.target.value)
                        }
                      />
                      <Input
                        label="Quantity"
                        type="number"
                        min="1"
                        max={
                          product.availableStock < Number.MAX_SAFE_INTEGER
                            ? product.availableStock
                            : undefined
                        }
                        value={product.quantity}
                        onChange={(e) =>
                          updateProductField(index, "quantity", e.target.value)
                        }
                      />
                      <Input
                        label="Discount (%)"
                        type="number"
                        min="0"
                        max="100"
                        value={product.discount}
                        onChange={(e) =>
                          updateProductField(index, "discount", e.target.value)
                        }
                      />
                      <Input
                        label="Line Total"
                        value={`৳${lineTotal.toFixed(2)}`}
                        readOnly
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                Grand Total: ৳{totalPrice.toFixed(2)}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => submitSale(false)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
                >
                  <CheckCircle size={16} />
                  {isSubmitting ? "Submitting..." : "Complete Sale"}
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => submitSale(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
                >
                  <Printer size={16} />
                  {isSubmitting ? "Submitting..." : "Complete & Print"}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 read-only:bg-gray-100 dark:read-only:bg-gray-800/60"
    />
  </div>
);

export default AddSaleProduct;
