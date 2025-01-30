import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import { useUser } from "../../../../contexts/AuthContext";
import Quagga from "quagga"; // Import Quagga library
import { Button } from "@mui/material";

const AddProducts = () => {
  const [productData, setProductData] = useState({
    name: "",
    code: "",
    purchasePrice: "",
    salesPrice: "",
    initialStock: "",
  });

  const [refresh, setRefresh] = useState(false);
  const [scannedBarcodes, setScanBarcodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { user, dokaan } = useUser();

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          constraints: {
            width: 800,
            facingMode: "environment", // or "user" for the front camera
          },
        },
        locator: {
          patchSize: "medium",
          halfSample: false,
        },
        numOfWorkers: navigator.hardwareConcurrency,
        decoder: {
          readers: ["ean_reader"],
          debug: {
            drawBoundingBox: true,
            showFrequency: true,
            drawScanline: true,
            showPattern: true,
          },
          multiple: false,
        },
        locate: true,
      },
      function (err) {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
      }
    );

    // Detect barcode and output result
    Quagga.onDetected((data) => {
      const scannedCode = data.codeResult.code;

      if (scannedCode) {
        setProductData((prev) => ({ ...prev, code: scannedCode })); // Directly update the state with scanned code
        setScanBarcodes((prevItems) => [...prevItems, data]);
        console.log(scannedCode); // Log barcode data
        Quagga.stop(); // Stop scanning after a barcode is detected
      }
    });

    // Clean up
    return () => {
      Quagga.offDetected(); // Remove event listener
      Quagga.stop(); // Stop Quagga
    };
  }, [refresh]);

  const scan = () => {
    setRefresh((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProductData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    const payload = {
      ...productData,
      shopId: dokaan.id,
      ownerId: user.id,
    };
    console.log(payload);

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
          console.log(response);
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

              <div style={{ display: "flex" }}>
                <div id="interactive" className="viewport w-40 h-40 mr-10" />
                <div style={{}}>
                  <Button onClick={scan}>Re-Scan</Button>
                  {scannedBarcodes.map((data, id) => (
                    <input
                      key={id}
                      id="code"
                      type="text"
                      value={data.codeResult.code}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-red-400 dark:border-gray-700 dark:text-white text-black bg-white dark:bg-black p-2"
                    />
                  ))}
                </div>
              </div>
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
