import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../../../../contexts/AuthContext";
import { useThemeMode } from "../../../../contexts/ThemeContext";
import BarcodeScanner from "./Scanner/BarcodeScanner";
import CreatableSelect from "react-select/creatable";

const categoryOptions = [
  { value: "Groceries", label: "Groceries" },
  { value: "Electronics", label: "Electronics" },
  { value: "Mobile Shop", label: "Mobile Shop" },
  { value: "Stationery", label: "Stationery" },
  { value: "Clothing", label: "Clothing" },
  { value: "Cosmetics", label: "Cosmetics" },
  { value: "Pharmacy", label: "Pharmacy" },
  { value: "Bakery", label: "Bakery" },
];

const emptyProduct = {
  name: "",
  code: "",
  itemCategory: "",
  purchasePrice: "",
  salesPrice: "",
  initialStock: "",
};

const AddProducts = () => {
  const location = useLocation();
  const editingProduct = location.state?.product;
  const queryClient = useQueryClient();
  const { user, savedShop } = useUser();
  const { mode } = useThemeMode();

  const [productData, setProductData] = useState(() =>
    editingProduct
      ? {
          name: editingProduct.name || "",
          code: editingProduct.code || "",
          itemCategory: editingProduct.itemCategory || "",
          purchasePrice: editingProduct.purchasePrice ?? "",
          salesPrice: editingProduct.salesPrice ?? "",
          initialStock:
            editingProduct.stock ?? editingProduct.initialStock ?? "",
        }
      : emptyProduct
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isUpdateMode, setIsUpdateMode] = useState(Boolean(editingProduct));

  useEffect(() => {
    if (editingProduct) {
      setProductData({
        name: editingProduct.name || "",
        code: editingProduct.code || "",
        itemCategory: editingProduct.itemCategory || "",
        purchasePrice: editingProduct.purchasePrice ?? "",
        salesPrice: editingProduct.salesPrice ?? "",
        initialStock:
          editingProduct.stock ?? editingProduct.initialStock ?? "",
      });
      setIsUpdateMode(true);
    }
  }, [editingProduct]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProductData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCategoryChange = (selectedOption) => {
    setProductData((prev) => ({
      ...prev,
      itemCategory: selectedOption?.value || "",
    }));
  };

  const handleScan = useCallback(async (scannedCode) => {
    const trimmed = String(scannedCode || "").trim();
    setProductData((prev) => ({ ...prev, code: trimmed }));
    if (!trimmed) return;

    const token = Cookies.get("XTOKEN");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/products/scan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `${token}` } : {}),
          },
          body: JSON.stringify({
            barcode: trimmed,
            shopId: savedShop?.id,
          }),
        }
      );

      let data = {};
      try {
        data = await res.json();
      } catch {
        // non-json response
      }

      if (res.ok && data?.matchedProduct) {
        const found = data.matchedProduct;
        setProductData({
          name: found.productName || found.name || "",
          code: found.code || found.productCode || trimmed,
          itemCategory: found.itemCategory || "",
          purchasePrice: found.purchasePrice ?? "",
          salesPrice: found.salesPrice ?? "",
          initialStock: found.stock ?? found.initialStock ?? "",
        });
        setIsUpdateMode(true);
        toast.success("Product found. You can update its details or stock.");
      } else {
        setIsUpdateMode(false);
        toast("No existing product found — ready to add as new.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error looking up barcode.");
    }
  }, [savedShop?.id]);

  const resetForm = () => {
    setProductData(emptyProduct);
    setIsUpdateMode(false);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (loading) return;

    if (!savedShop?.id || !user?.id) {
      toast.error("Please select a shop before saving products.");
      return;
    }

    if (!productData.name.trim()) {
      toast.error("Product name is required.");
      return;
    }

    if (!productData.code.trim()) {
      toast.error("Product barcode/code is required.");
      return;
    }

    const purchasePrice = Number(productData.purchasePrice);
    const salesPrice = Number(productData.salesPrice);
    const initialStock = Number(productData.initialStock);

    if (Number.isNaN(purchasePrice) || purchasePrice < 0) {
      toast.error("Purchase price must be a valid non-negative number.");
      return;
    }
    if (Number.isNaN(salesPrice) || salesPrice < 0) {
      toast.error("Sales price must be a valid non-negative number.");
      return;
    }
    if (Number.isNaN(initialStock) || initialStock < 0) {
      toast.error("Stock quantity must be a valid non-negative number.");
      return;
    }

    const token = Cookies.get("XTOKEN");
    if (!token) {
      toast.error("Authentication token not found.");
      return;
    }

    const payload = {
      name: productData.name.trim(),
      code: productData.code.trim(),
      itemCategory: productData.itemCategory || "General",
      purchasePrice,
      salesPrice,
      initialStock,
      stock: initialStock,
      shopId: savedShop.id,
      ownerId: user.id,
    };

    const url = isUpdateMode
      ? `${import.meta.env.VITE_BASE_URL}/products/${encodeURIComponent(
          productData.code.trim()
        )}`
      : `${import.meta.env.VITE_BASE_URL}/products`;

    setLoading(true);
    const toastId = toast.loading(
      isUpdateMode ? "Updating product..." : "Saving product..."
    );

    try {
      const response = await fetch(url, {
        method: isUpdateMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(payload),
      });

      let responseData = {};
      try {
        responseData = await response.json();
      } catch {
        // non-json response
      }

      if (response.ok) {
        const successMsg = isUpdateMode
          ? "Product updated successfully!"
          : "Product added successfully!";
        setMessage(successMsg);
        toast.success(successMsg, { id: toastId });
        setProductData(emptyProduct);
        setIsUpdateMode(false);
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["inventory"] });
        queryClient.invalidateQueries({ queryKey: ["totalProducts"] });
      } else {
        throw new Error(responseData.message || "Failed to save product.");
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      toast.error(error.message || "Something went wrong!", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const isDark = mode === "dark";

  return (
    <div className="px-2 sm:px-4 py-6 max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isUpdateMode ? "Update Product" : "Add New Product"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Scan a barcode or enter product details below.
            </p>
          </div>
          {isUpdateMode && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Clear / New
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                Product Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={productData.name}
                onChange={handleInputChange}
                placeholder="e.g., Fresh Soybean Oil 5L"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="itemCategory"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                Category
              </label>
              <CreatableSelect
                inputId="itemCategory"
                isClearable
                options={categoryOptions}
                onChange={handleCategoryChange}
                value={
                  productData.itemCategory
                    ? {
                        value: productData.itemCategory,
                        label: productData.itemCategory,
                      }
                    : null
                }
                placeholder="Select or create category"
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: isDark ? "#1f2937" : "#ffffff",
                    borderColor: isDark ? "#374151" : "#d1d5db",
                    borderRadius: "0.75rem",
                    minHeight: "42px",
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: isDark ? "#f9fafb" : "#111827",
                  }),
                  input: (base) => ({
                    ...base,
                    color: isDark ? "#f9fafb" : "#111827",
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: isDark ? "#1f2937" : "#ffffff",
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused
                      ? isDark
                        ? "#374151"
                        : "#eef2ff"
                      : "transparent",
                    color: isDark ? "#f9fafb" : "#111827",
                  }),
                }}
              />
            </div>

            <div className="sm:col-span-2">
              <BarcodeScanner
                value={productData.code}
                onScan={handleScan}
                handleInputChange={handleInputChange}
              />
            </div>

            <div>
              <label
                htmlFor="purchasePrice"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                Purchase Price (৳)
              </label>
              <input
                id="purchasePrice"
                type="number"
                min="0"
                step="any"
                required
                value={productData.purchasePrice}
                onChange={handleInputChange}
                placeholder="0.00"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="salesPrice"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                Sales Price (৳)
              </label>
              <input
                id="salesPrice"
                type="number"
                min="0"
                step="any"
                required
                value={productData.salesPrice}
                onChange={handleInputChange}
                placeholder="0.00"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="initialStock"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                {isUpdateMode ? "Stock Quantity" : "Initial Stock"}
              </label>
              <input
                id="initialStock"
                type="number"
                min="0"
                required
                value={productData.initialStock}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm transition-colors"
          >
            {loading
              ? "Processing..."
              : isUpdateMode
              ? "Update Product"
              : "Save Product"}
          </button>

          {message && (
            <p className="text-center text-sm text-gray-600 dark:text-gray-300">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddProducts;
