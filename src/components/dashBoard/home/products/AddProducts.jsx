import { useState } from "react";
import { toast } from "react-hot-toast";
import QrScanner from "react-qr-scanner"; // Ensure you have this dependency installed
import Cookies from "js-cookie";
import { useUser } from "../../../../contexts/AuthContext";

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
  const [isScannerVisible, setScannerVisible] = useState(false); // State to toggle QR scanner visibility
  const { user, dokaan } = useUser();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProductData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    const payload = {
      ...productData,
      code: qrResult || productData.code, // Use scanned code if available
      shopId: dokaan.id, // Replace with actual dokaanId
      ownerId: user.id, // Replace with actual ownerId
    };

    const token = Cookies.get("XTOKEN"); // Assuming the token is stored as 'authToken' in cookies

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
            await response.json();
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
          throw new Error(error.message);
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

  const handleBarcodeScan = (data) => {
    if (data) {
      setQrResult(data.text);
      setScannerVisible(false); // Hide scanner after successful scan
    }
  };

  const handleBarcodeError = (error) => {
    console.error("QR Code Error: ", error);
  };

  const handleCodeInputClick = () => {
    setScannerVisible(true); // Show QR scanner when code input is clicked
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
                  onClick={handleCodeInputClick} // Trigger QR scanner when clicked
                  className="w-full rounded-md border border-red-400 dark:border-gray-700 dark:text-white text-black bg-white dark:bg-black p-2"
                />
                {/* QR Scanner - Only visible when triggered */}
                {isScannerVisible && (
                  <div className="qr-scanner-mobile absolute top-0 left-0 z-10 w-full h-full bg-black bg-opacity-60">
                    <QrScanner
                      delay={300}
                      onScan={handleBarcodeScan}
                      onError={handleBarcodeError}
                      style={{
                        width: "100%",
                        maxHeight: "400px", // Set a max height to avoid it covering everything
                        marginTop: "10px", // Set some margin to adjust position
                        position: "absolute", // Keep it positioned
                      }}
                    />
                  </div>
                )}
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
