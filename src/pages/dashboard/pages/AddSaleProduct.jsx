import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { useUser } from "@/contexts/AuthContext";
import { Button } from "@mui/material";
import SaleBarcodeScanner from "../../../components/dashBoard/home/sales/saleScanner/SaleBarcodeScanner";

const AddSaleProduct = () => {
  const [scannedProduct, setScannedProduct] = useState(null);
  const [sellingPrice, setSellingPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user, dokaan } = useUser();

  console.log(scannedProduct, "scannedProduct");
  const handleScan = async (barcodeObject) => {
    console.log(barcodeObject.barcode); // Log the scanned barcode
    try {
      const token = Cookies.get("XTOKEN");
      const response = await axios.post(
        `http://localhost:5000/api/v1/products/scan`,
        barcodeObject, // e.g., { barcode: '6760700816045' }
        {
          headers: { Authorization: `${token}` },
        }
      );

      if (response.status === 200) {
        console.log(response.data, "response.data.data");
        setScannedProduct(response.data);
        toast.success("Product fetched successfully!");
      } else {
        toast.error("Product not found!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching product.");
    }
  };

  const handleSubmit = async () => {
    const token = Cookies.get("XTOKEN");

    if (!user || !dokaan || !scannedProduct) {
      toast.error("Missing user/shop/product information.");
      return;
    }

    const payload = {
      productCode: scannedProduct.matchedProduct.code,
      code: scannedProduct.matchedProduct.productCode,
      productName: scannedProduct.matchedProduct.productName,
      brand: scannedProduct.brand || "Unknown",
      salesPrice: parseFloat(sellingPrice),
      quantity: quantity,
      totalPrice: quantity * parseFloat(sellingPrice),
      shopAddress: dokaan.address || "N/A",
      ownerName: dokaan.ownerName || user.name,
      sellerId: user.id,
      shopId: dokaan.id,
      branch: dokaan.branch || "Main",
      soldAt: new Date().toISOString(),
    };

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/v1/sales", payload, {
        headers: { Authorization: `${token}` },
      });

      toast.success("Sale recorded successfully!");
      setScannedProduct(null);
      setSellingPrice("");
      setQuantity(1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to record sale.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="dark:text-gray-50">
        <form noValidate className="container">
          <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm bg-white dark:bg-gray-900">
            <div className="col-span-full">
              <h3 className="text-xl">Scan Product</h3>
              <hr className="my-2 border-dashed bg-black dark:border-gray-300" />
            </div>
            <div className="grid grid-cols-2 gap-4 col-span-full lg:col-span-3">
              <div className="col-span-full sm:col-span-1">
                <SaleBarcodeScanner onScan={handleScan} />
              </div>
            </div>
          </fieldset>

          {scannedProduct && (
            <>
              <hr className="my-6 border-black dark:border-gray-300" />
              <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm bg-white dark:bg-gray-900">
                <div className="col-span-full">
                  <h3 className="text-xl">Product Details</h3>
                  <hr className="my-2 border-dashed bg-black dark:border-gray-300" />
                </div>
                <div className="grid grid-cols-2 gap-4 col-span-full lg:col-span-3">
                  <div className="col-span-full sm:col-span-1">
                    <label className="text-sm">Product Name</label>
                    <input
                      type="text"
                      value={scannedProduct.matchedProduct.productName}
                      readOnly
                      className="w-full rounded-md border dark:border-gray-700 dark:text-white text-black bg-white dark:bg-black p-2"
                    />
                  </div>

                  <div className="col-span-full sm:col-span-1">
                    <label className="text-sm">Product Code</label>
                    <input
                      type="text"
                      value={scannedProduct.matchedProduct.productCode}
                      readOnly
                      className="w-full rounded-md border dark:border-gray-700 dark:text-white text-black bg-white dark:bg-black p-2"
                    />
                  </div>

                  <div className="col-span-full sm:col-span-1">
                    <label className="text-sm">Selling Price</label>
                    <input
                      type="number"
                      value={scannedProduct.matchedProduct.salesPrice}
                      onChange={(e) => setSellingPrice(e.target.value)}
                      className="w-full rounded-md border dark:border-gray-700 dark:text-white text-black bg-white dark:bg-black p-2"
                    />
                  </div>

                  <div className="col-span-full sm:col-span-1">
                    <label className="text-sm">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full rounded-md border dark:border-gray-700 dark:text-white text-black bg-white dark:bg-black p-2"
                    />
                  </div>
                </div>
              </fieldset>

              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                variant="contained"
                color="primary"
                className="w-full mt-4"
              >
                {loading ? "Saving..." : "Submit Sale"}
              </Button>
            </>
          )}
        </form>
      </section>
    </div>
  );
};

export default AddSaleProduct;
