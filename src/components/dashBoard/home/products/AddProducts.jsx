import { useState } from "react";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import { useUser } from "../../../../contexts/AuthContext";
import { Button } from "@mui/material";
import BarcodeScanner from "./Scanner/BarcodeScanner";

const AddProducts = () => {
  const [productData, setProductData] = useState({
    name: "",
    code: "",
    category: "",
    purchasePrice: "",
    salesPrice: "",
    initialStock: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { user, dokaan } = useUser();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProductData((prev) => ({ ...prev, [id]: value }));
  };

  const handleScan = (scannedCode) => {
    setProductData((prev) => ({ ...prev, code: scannedCode }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...productData,
      shopId: dokaan.id,
      ownerId: user.id,
    };

    const token = Cookies.get("XTOKEN");

    if (!token) {
      toast.error("Authentication token not found.");
      return;
    }

    toast.promise(
      (async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/products`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
              },
              body: JSON.stringify(payload),
            }
          );

          if (response.status === 200) {
            setMessage("Product added successfully!");
            setProductData({
              name: "",
              code: "",
              category: "",
              purchasePrice: "",
              salesPrice: "",
              initialStock: "",
            });
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to add product");
          }
        } catch (error) {
          setMessage(`Error: ${error.message}`);
        } finally {
          setLoading(false);
        }
      })(),
      {
        loading: "Saving...",
        success: <b>Product added successfully!</b>,
        error: <b>Could not save product. Please try again.</b>,
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
            <label htmlFor="category" className="block text-sm font-medium">
              Category
            </label>
            <input
              id="category"
              type="text"
              value={productData.category}
              onChange={handleInputChange}
              placeholder="e.g., Beverage"
              className="mt-1 w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="code" className="block text-sm font-medium">
              {/* Barcode (Scan or Type) */}
            </label>
            <BarcodeScanner
              onScan={handleScan}
              handleInputChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="purchasePrice" className="block text-sm font-medium">
              Purchase Price
            </label>
            <input
              id="purchasePrice"
              type="number"
              value={productData.purchasePrice}
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
              value={productData.salesPrice}
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
              value={productData.initialStock}
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
          {loading ? "Adding..." : "Save Product"}
        </Button>

        {message && <p className="text-center text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default AddProducts;
