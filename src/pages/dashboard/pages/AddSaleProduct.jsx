import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { useUser } from "@/contexts/AuthContext";
import { Button } from "@mui/material";
import SaleBarcodeScanner from "@/components/dashBoard/home/sales/saleScanner/SaleBarcodeScanner";
import { MagnifyingGlass } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

const AddSaleProduct = () => {
  const [scannedProducts, setScannedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [scanning, setScanning] = useState(false);

  // Manual code input state
  const [manualCodeInput, setManualCodeInput] = useState("");

  // Customer info fields
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  // Search related state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);

  const { user, savedShop } = useUser();
  const navigate = useNavigate();

  // To prevent multiple scans of same barcode
  const scannedRef = useRef(new Set());

  // Calculate total price on scannedProducts change
  useEffect(() => {
    const total = scannedProducts.reduce((sum, product) => {
      const price = product.salesPrice * product.quantity;
      const discountAmount = (product.discount / 100) * price;
      return sum + (price - discountAmount);
    }, 0);
    setTotalPrice(total);
  }, [scannedProducts]);

  // Search customers API call with debounce
  useEffect(() => {
    if (!searchTerm || !savedShop?.id) {
      setSearchResults([]);
      return;
    }

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const token = Cookies.get("XTOKEN");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/customers/search`,
          {
            params: {
              shopId: savedShop.id,
              search: searchTerm,
            },
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setSearchResults(response.data.data || []);
      } catch (error) {
        toast.error("Error searching customers");
      } finally {
        setIsSearching(false);
      }
    }, 500); // debounce 500ms
  }, [searchTerm, savedShop]);

  // When user selects a customer from search dropdown, autofill fields
  const handleSelectCustomer = (customer) => {
    setCustomerName(customer.name || "");
    setCustomerPhone(customer.phone || "");
    setCustomerEmail(customer.email || "");
    setCustomerAddress(customer.address || "");
    setSearchResults([]);
    setSearchTerm("");
  };

  // Search product by barcode (shared by scan or manual input)
  const searchProductByCode = async (code) => {
    if (!code.trim()) return;

    if (scannedRef.current.has(code)) {
      toast.error("Product already scanned!");
      return;
    }

    scannedRef.current.add(code);
    setScanning(true);

    try {
      const token = Cookies.get("XTOKEN");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/products/scan`,
        { barcode: code },
        { headers: { Authorization: `${token}` } }
      );

      const newProduct = response.data.matchedProduct;
      if (!newProduct) {
        toast.error("Product not found.");
        scannedRef.current.delete(code);
        return;
      }

      const alreadyExists = scannedProducts.some(
        (p) => p.productCode === newProduct.productCode
      );

      if (alreadyExists) {
        toast.error("Product already added!");
        scannedRef.current.delete(code);
      } else {
        setScannedProducts((prev) => [
          ...prev,
          { ...newProduct, quantity: 1, discount: 0 },
        ]);
        toast.success("Product added!");
        setManualCodeInput(""); // Clear input after success
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      toast.error("Error fetching product.");
      scannedRef.current.delete(code);
    } finally {
      setScanning(false);
    }
  };

  // Handle scan from scanner component
  const handleScan = (barcodeObject) => {
    const scannedCode = barcodeObject.code;
    setManualCodeInput(scannedCode); // autofill manual input box
    searchProductByCode(scannedCode); // trigger product fetch immediately
  };

  // Optional: debounce manual input search after user stops typing (700ms)
  useEffect(() => {
    if (!manualCodeInput) return;

    const timeout = setTimeout(() => {
      searchProductByCode(manualCodeInput.trim());
    }, 700);

    return () => clearTimeout(timeout);
  }, [manualCodeInput]);

  const updateProductField = (index, field, value) => {
    const updated = [...scannedProducts];
    updated[index][field] = value;
    setScannedProducts(updated);
  };

  const handlePrintDirect = () => {
    if (scannedProducts.length === 0 || !customerName || !customerPhone) {
      toast.error("Please complete required fields.");
      return;
    }

    const invoiceId = `${Date.now()}`;
    const invoiceType = localStorage.getItem("invoiceType") || "POS";

    const invoiceData = {
      products: scannedProducts,
      totalPrice,
      customer: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        address: customerAddress,
      },
      shop: savedShop,
      user,
      invoiceId,
      invoiceType,
    };

    localStorage.setItem("invoiceData", JSON.stringify(invoiceData));

    navigate("/dashboard/preview-invoice?autoPrint=true");
  };

  const handleSubmitSale = async () => {
    if (scannedProducts.length === 0 || !customerName || !customerPhone) {
      toast.error("Please complete required fields.");
      return;
    }

    try {
      const token = Cookies.get("XTOKEN");

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/sales?shopId=${savedShop.id}`,
        {
          sellerId: user.id,
          shopId: savedShop.id,
          branch: savedShop.dokaan_location,
          soldAt: new Date().toISOString(),
          customer: {
            name: customerName,
            phone: customerPhone,
            email: customerEmail,
            address: customerAddress,
          },
          products: scannedProducts.map((p) => ({
            code: p.productCode,
            quantity: p.quantity,
            totalPrice:
              p.salesPrice * p.quantity -
              (p.discount / 100) * p.salesPrice * p.quantity,
            discount: p.discount,
          })),
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      toast.success("Sale submitted successfully!");
    } catch (error) {
      console.error("Sale submit error:", error);
      toast.error(
        error?.response?.data?.message || "Error submitting sale. Check console."
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mb-10">
      <section className="dark:text-gray-50">
        <form noValidate className="space-y-8">
          {/* SCANNER */}
          <div className="rounded-xl shadow bg-white dark:bg-gray-900 p-6">
            <h3 className="text-2xl font-semibold mb-4">Scan Product</h3>
            {scanning ? (
              <div className="flex justify-center items-center h-40">
                <MagnifyingGlass
                  visible={true}
                  height="80"
                  width="80"
                  color="#e15b64"
                />
              </div>
            ) : (
              <SaleBarcodeScanner
                onScan={handleScan}
                setManualCodeInput={setManualCodeInput}
              />
            )}
            {/* Manual barcode input */}
            <div className="mt-4">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Manual Barcode Entry
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md dark:bg-black dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter barcode manually"
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
            </div>
          </div>

          {/* CUSTOMER INFO WITH SEARCH */}
          <div className="rounded-xl shadow bg-white dark:bg-gray-900 p-6 relative">
            <h3 className="text-2xl font-semibold mb-4">Customer Info</h3>

            <Input
              label="Search Customer by Name / Phone / Email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Start typing to search..."
              autoComplete="off"
            />

            {isSearching && (
              <div className="text-center text-sm text-gray-500">Searching...</div>
            )}

            {searchResults.length > 0 && (
              <ul
                className="absolute z-50 w-full max-h-60 overflow-y-auto mt-1 
                border border-gray-300 dark:border-gray-700 
                bg-white dark:bg-gray-800 
                rounded-lg shadow-lg 
                transition-all duration-200 ease-out 
                sm:text-sm text-xs"
              >
                {searchResults.map((customer) => (
                  <li
                    key={customer.id}
                    className="px-4 py-2 cursor-pointer 
                    hover:bg-blue-100 dark:hover:bg-blue-600 
                    text-gray-900 dark:text-gray-100 
                    transition-colors duration-150"
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {customer.phone} • {customer.email}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Input
                label="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <Input
                label="Phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
              <Input
                label="Email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
              <Input
                label="Address"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
              />
            </div>
          </div>

          {/* SCANNED PRODUCTS */}
          {scannedProducts.length > 0 && (
            <div className="rounded-xl shadow bg-white dark:bg-gray-900 p-6">
              <h3 className="text-2xl font-semibold mb-4">Scanned Products</h3>
              {scannedProducts.map((product, index) => (
                <div key={product.productCode} className="mb-4 border-b pb-4">
                  <h4 className="font-semibold text-lg mb-2">{product.productName}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Code" value={product.productCode} readOnly />
                    <Input label="Category" value={product.itemCategory} readOnly />
                    <Input
                      label="Selling Price"
                      type="number"
                      value={product.salesPrice}
                      onChange={(e) =>
                        updateProductField(index, "salesPrice", Number(e.target.value))
                      }
                    />
                    <Input
                      label="Quantity"
                      type="number"
                      value={product.quantity}
                      onChange={(e) =>
                        updateProductField(index, "quantity", Number(e.target.value))
                      }
                    />
                    <Input
                      label="Discount (%)"
                      type="number"
                      value={product.discount}
                      onChange={(e) =>
                        updateProductField(index, "discount", Number(e.target.value))
                      }
                    />
                    <Input
                      label="Total"
                      value={(
                        product.salesPrice * product.quantity -
                        (product.discount / 100) * (product.salesPrice * product.quantity)
                      ).toFixed(2)}
                      readOnly
                    />
                  </div>
                </div>
              ))}

              <div className="text-xl font-bold mt-4">Grand Total: ৳{totalPrice.toFixed(2)}</div>

              <div className="flex flex-wrap gap-4 mt-6">
                <Button
                  onClick={() => {
                    handleSubmitSale();
                    handlePrintDirect();
                  }}
                  variant="outlined"
                  color="secondary"
                >
                  Print
                </Button>
              </div>
            </div>
          )}
        </form>
      </section>
    </div>
  );
};

// Reusable Input Component
const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default AddSaleProduct;
