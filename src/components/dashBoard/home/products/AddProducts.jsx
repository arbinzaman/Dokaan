import { useState } from "react";
import { toast } from "react-hot-toast";
import QrScanner from "react-qr-scanner";
import Cookies from 'js-cookie';
import {useUser} from '../../../../contexts/AuthContext';

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
  const [qrResult, setQrResult] = useState("");
  const {user,dokaan}=useUser();


  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProductData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    // Build the payload
    const payload = {
      ...productData,
      code: qrResult || productData.code, // Use scanned code if available
      shopId: dokaan.id,  // Replace with actual dokaanId
      ownerId: user.id,    // Replace with actual ownerId
    };
  console.log(payload);
    // Get the token from cookies
    const token = Cookies.get('XTOKEN'); // Assuming the token is stored as 'authToken' in cookies
  
    if (!token) {
      // Handle case where token is missing
      toast.error("Authentication token not found.");
      return;
    }
  
    // Wrap the API call inside toast.promise
    toast.promise(
      (async () => {
        setLoading(true);
        try {
          // Make the API call
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/products`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `${token}`, // Add token to Authorization header
            },
            body: JSON.stringify(payload),
          });
  
          if (response.status === 200) {
            await response.json(); // Parse the response if needed
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
          throw new Error(error.message); // Rejecting the promise with error
        } finally {
          setLoading(false);
        }
      })(),
      {
        loading: 'Saving...',
        success: <b>Product added successfully!</b>,
        error: <b>Could not save product. Please try again.</b>,
      }
    );
  };
  

  const handleBarcodeScan = (data) => {
    if (data) setQrResult(data.text);
  };

  const handleBarcodeError = (error) => {
    console.error("QR Code Error: ", error);
  };

  return (
    <div>
      <section className="dark:text-gray-50">
        <form noValidate className="container">
          {/* Name and Code Section */}
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
              <div className="col-span-full sm:col-span-1 relative">
                <label htmlFor="code" className="text-sm">
                  Code
                </label>
                <input
                  id="code"
                  type="text"
                  value={qrResult || productData.code}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-red-400 dark:border-gray-700 dark:text-white text-black bg-white dark:bg-black p-2"
                />
                {/* QR Scanner - Only visible on mobile devices */}
                <div className="qr-scanner-mobile sm:hidden absolute top-0 right-0 z-10">
                  <QrScanner
                    delay={300}
                    onScan={handleBarcodeScan}
                    onError={handleBarcodeError}
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      marginTop: "10px",
                      position: "absolute",
                    }}
                  />
                </div>
              </div>
            </div>
          </fieldset>

          <hr className="my-6 border-black dark:border-gray-300" />

          {/* Pricing Section */}
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

          {/* Stock Section */}
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

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            {loading ? "Adding..." : "Save Product"}
          </button>

          {message && (
            <p
              className={`mt-4 text-center ${
                message.includes("Error") ? "text-red-500" : "text-green-500"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </section>
    </div>
  );
};

export default AddProducts;
