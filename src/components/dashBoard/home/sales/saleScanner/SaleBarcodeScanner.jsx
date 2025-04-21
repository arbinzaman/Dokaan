// components/SaleBarcodeScanner.jsx
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const SaleBarcodeScanner = ({ onProductScanned }) => {
  const [barcode, setBarcode] = useState("");
  const [error, setError] = useState("");

  const handleScan = async () => {
    setError("");
    const token = Cookies.get("XTOKEN"); // Adjust "token" to your actual cookie name
    // console.log(token);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/products/scan",
        { barcode },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      onProductScanned(response.data.matchedProduct);
    } catch (err) {
      setError(err.response?.data?.message || "Scan failed");
    }
  };

  return (
    <div className="p-4 border rounded">
      <input
        type="text"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        placeholder="Scan or enter barcode"
        className="border p-2 w-full mb-2"
      />
      <button
        onClick={handleScan}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Scan
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default SaleBarcodeScanner;
