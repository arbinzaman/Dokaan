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
    <div>
      <section className="dark:text-gray-50">
        <form noValidate className="container">
          <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm bg-white dark:bg-gray-900">
            <div className="col-span-full">
              <h3 className="text-xl">Name and Code</h3>
              <hr className="my-2 border-dashed bg-black dark:border-gray-300" />
            </div>
            <div className="grid grid-cols-2 gap-4 col-span-full lg:col-span-3">
              <div className="col-span-full sm:col-span-1 relative">
                <label htmlFor="name" className="text-sm">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={productData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-red-400 dark:border-gray-700 dark:text-white text-black bg-white dark:bg-black p-2"
                />
              </div>

              {/* Barcode Scanner Component */}
              <BarcodeScanner onScan={handleScan} handleInputChange={handleInputChange} />

            </div>
          </fieldset>

          <hr className="my-6 border-black dark:border-gray-300" />

          <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm bg-white dark:bg-gray-900">
            <div className="col-span-full">
              <h3 className="text-xl">Pricing</h3>
              <hr className="my-2 border-dashed bg-black dark:border-gray-300" />
            </div>
            <div className="grid grid-cols-2 gap-4 col-span-full lg:col-span-3">
              <div className="col-span-full sm:col-span-1 relative">
                <label htmlFor="purchasePrice" className="text-sm">
                  Purchase Price
                </label>
                <input
                  id="purchasePrice"
                  type="text"
                  value={productData.purchasePrice}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-red-400 dark:border-gray-700 dark:text-white text-black bg-white dark:bg-black p-2"
                />
              </div>
              <div className="col-span-full sm:col-span-1 relative">
                <label htmlFor="salesPrice" className="text-sm">
                  Sales Price
                </label>
                <input
                  id="salesPrice"
                  type="text"
                  value={productData.salesPrice}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-red-400 dark:border-gray-700 dark:text-white text-black bg-white dark:bg-black p-2"
                />
              </div>
            </div>
          </fieldset>

          <hr className="my-6 border-black dark:border-gray-300" />

          <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm bg-white dark:bg-gray-900">
            <div className="col-span-full">
              <h3 className="text-xl">Stock</h3>
              <hr className="my-2 border-dashed bg-black dark:border-gray-300" />
            </div>
            <div className="col-span-full sm:col-span-2 relative">
              <label htmlFor="initialStock" className="text-sm">
                Initial Stock
              </label>
              <input
                id="initialStock"
                type="text"
                value={productData.initialStock}
                onChange={handleInputChange}
                className="w-full rounded-md border border-red-400 dark:border-gray-700 dark:text-white text-black bg-white dark:bg-black p-2"
              />
            </div>
          </fieldset>

          <hr className="my-6 border-black dark:border-gray-300" />

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            variant="contained"
            color="primary"
            className="w-full"
          >
            {loading ? "Adding..." : "Save Product"}
          </Button>

          {message && <p className="mt-4 text-center">{message}</p>}
        </form>
      </section>
    </div>
  );
};

export default AddProducts;
