import { useState } from "react";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import { useUser } from "../../../../contexts/AuthContext";
import { Button } from "@mui/material";
import BarcodeScanner from "./Scanner/BarcodeScanner";
import CreatableSelect from "react-select/creatable";

const toastStyle = {
  borderRadius: "12px",
  background: "#1e293b",
  color: "#fff",
  padding: "14px 20px",
  fontSize: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
};

const toastIconTheme = {
  primary: "#60a5fa",
  secondary: "#fff",
};

const AddProducts = () => {
  const [productData, setProductData] = useState({
    name: "",
    code: "",
    itemCategory: "",
    purchasePrice: null,
    salesPrice: null,
    initialStock: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const { user, savedShop } = useUser();

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

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const numericFields = ["purchasePrice", "salesPrice", "initialStock"];

    setProductData((prev) => ({
      ...prev,
      [id]: numericFields.includes(id)
        ? value === ""
          ? null
          : Number(value)
        : value,
    }));
  };

  const handleCategoryChange = (selectedOption) => {
    setProductData((prev) => ({
      ...prev,
      itemCategory: selectedOption?.value || "",
    }));
  };

  const handleScan = async (scannedCode) => {
    setProductData((prev) => ({ ...prev, code: scannedCode }));

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/products/scan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ barcode: scannedCode }),
        }
      );

      const data = await res.json();
      if (res.ok && data?.matchedProduct) {
        const found = data.matchedProduct;

        setProductData({
          name: found.productName || "",
          code: found.code || scannedCode,
          itemCategory: found.itemCategory || "",
          purchasePrice: found.purchasePrice ?? null,
          salesPrice: found.salesPrice ?? null,
          initialStock: null,
        });
        setIsUpdateMode(true);
        toast.success("Product found. You can update the stock.", {
          style: { ...toastStyle, background: "#22c55e" }, // green bg for success
          iconTheme: { primary: "#ffffff", secondary: "#22c55e" },
        });
      } else {
        setIsUpdateMode(false);
        toast("No product found. You can add it as a new product.", {
          style: { ...toastStyle, background: "#3b82f6" }, // blue bg for info
          iconTheme: { primary: "#ffffff", secondary: "#3b82f6" },
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching product info", {
        style: { ...toastStyle, background: "#ef4444" }, // red bg for error
        iconTheme: { primary: "#ffffff", secondary: "#ef4444" },
      });
    }
  };

  const handleSubmit = async () => {
    const payload = {
      ...productData,
      shopId: savedShop.id,
      ownerId: user.id,
    };

    const token = Cookies.get("XTOKEN");

    if (!token) {
      toast.error("Authentication token not found.", {
        style: { ...toastStyle, background: "#ef4444" },
        iconTheme: { primary: "#fff", secondary: "#ef4444" },
      });
      return;
    }

    const url = isUpdateMode
      ? `${import.meta.env.VITE_BASE_URL}/products/${productData.code}`
      : `${import.meta.env.VITE_BASE_URL}/products`;

    toast.promise(
      (async () => {
        setLoading(true);
        try {
          const response = await fetch(url, {
            method: isUpdateMode ? "PUT" : "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            setMessage(
              isUpdateMode
                ? "Stock updated successfully!"
                : "Product added successfully!"
            );
            setProductData({
              name: "",
              code: "",
              itemCategory: "",
              purchasePrice: null,
              salesPrice: null,
              initialStock: null,
            });
            setIsUpdateMode(false);
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to save product");
          }
        } catch (error) {
          setMessage(`Error: ${error.message}`);
          throw error; // rethrow to trigger toast.promise error toast
        } finally {
          setLoading(false);
        }
      })(),
      {
        loading: isUpdateMode ? "Updating stock..." : "Saving...",
        success: isUpdateMode ? "Stock updated!" : "Product added!",
        error: "Something went wrong!",
      },
      {
        style: toastStyle,
        iconTheme: toastIconTheme,
      }
    );
  };

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto dark:text-gray-50">
      <form noValidate className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Product Name
            </label>
            <input
              id="name"
              type="text"
              value={productData.name}
              onChange={handleInputChange}
              className="mt-1 w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="itemCategory"
              className="block text-sm font-medium mb-1"
            >
              Category
            </label>
            <CreatableSelect
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
                  backgroundColor: "#1f2937",
                  borderColor: "#4b5563",
                  color: "#fff",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "#fff",
                }),
                input: (base) => ({
                  ...base,
                  color: "#fff",
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "#1f2937",
                  color: "#fff",
                }),
              }}
            />
          </div>

          <div>
            <BarcodeScanner
              onScan={handleScan}
              handleInputChange={handleInputChange}
            />
          </div>

          <div>
            <label
              htmlFor="purchasePrice"
              className="block text-sm font-medium"
            >
              Purchase Price
            </label>
            <input
              id="purchasePrice"
              type="number"
              value={productData.purchasePrice ?? ""}
              onChange={handleInputChange}
              className="mt-1 w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="salesPrice" className="block text-sm font-medium">
              Sales Price
            </label>
            <input
              id="salesPrice"
              type="number"
              value={productData.salesPrice ?? ""}
              onChange={handleInputChange}
              className="mt-1 w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="initialStock" className="block text-sm font-medium">
              Initial Stock
            </label>
            <input
              id="initialStock"
              type="number"
              value={productData.initialStock ?? ""}
              onChange={handleInputChange}
              className="mt-1 w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          color="primary"
          className="w-full !mt-4"
        >
          {loading
            ? "Processing..."
            : isUpdateMode
            ? "Update Stock"
            : "Save Product"}
        </Button>

        {message && <p className="text-center text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default AddProducts;
