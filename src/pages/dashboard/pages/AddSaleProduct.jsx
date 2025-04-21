import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useUser } from "@/contexts/AuthContext"; // ✅ Make sure this path is correct
import BarcodeScannerComponent from "../../../components/dashBoard/home/sales/saleScanner/SaleBarcodeScanner";

const AddSaleProduct = () => {
  const [scannedProduct, setScannedProduct] = useState(null);
  const [sellingPrice, setSellingPrice] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { user, dokaan } = useUser(); // ✅ Get user and dokaan from AuthContext

  const handleSubmit = async () => {
    const token = Cookies.get("XTOKEN");

    if (!user || !dokaan) {
      alert("User or shop info is missing.");
      return;
    }

    try {
      const payload = {
        productCode: scannedProduct.productCode,
        code: scannedProduct.productCode,
        productName: scannedProduct.productName,
        brand: scannedProduct.brand,
        salesPrice: parseFloat(sellingPrice),
        quantity: quantity,
        totalPrice: quantity * parseFloat(sellingPrice),
        shopAddress: scannedProduct.shopAddress,
        ownerName: scannedProduct.ownerName,
        sellerId: user.id,
        shopId: dokaan.id,
        branch: dokaan.branch || "Main",
        soldAt: new Date().toISOString(),
      };

      await axios.post("http://localhost:5000/api/v1/sales", payload, {
        headers: {
          Authorization: `${token}`,
        },
      });

      alert("Sale saved successfully!");
      setScannedProduct(null);
      setSellingPrice("");
      setQuantity(1);
    } catch (err) {
      console.error(err);
      alert("Failed to submit sale.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Sell a Product</h2>

      <BarcodeScannerComponent onProductScanned={setScannedProduct} />

      {scannedProduct && (
        <div className="mt-4">
          <p><strong>Product:</strong> {scannedProduct.productName}</p>
          <p><strong>Code:</strong> {scannedProduct.productCode}</p>
          <p><strong>Brand:</strong> {scannedProduct.brand}</p>
          <p><strong>Purchase Price:</strong> {scannedProduct.purchasePrice}</p>
          <p><strong>Shop Address:</strong> {scannedProduct.shopAddress}</p>
          <p><strong>Owner:</strong> {scannedProduct.ownerName}</p>

          <input
            type="number"
            placeholder="Enter sale price"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            className="border mt-2 p-2 w-full"
          />

          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            min={1}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border mt-2 p-2 w-full"
          />

          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 mt-2 rounded w-full"
          >
            Submit Sale
          </button>
        </div>
      )}
    </div>
  );
};

export default AddSaleProduct;
