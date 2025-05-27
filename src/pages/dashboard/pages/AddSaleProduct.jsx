import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { useUser } from "@/contexts/AuthContext";
import { Button } from "@mui/material";
import SaleBarcodeScanner from "../../../components/dashBoard/home/sales/saleScanner/SaleBarcodeScanner";
import { MagnifyingGlass } from "react-loader-spinner";
import { generateInvoicePDF } from "../../../utils/generateInvoicePDF";

const AddSaleProduct = () => {
  const [scannedProducts, setScannedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const { user, savedShop } = useUser();

  useEffect(() => {
    const total = scannedProducts.reduce((sum, product) => {
      const price = product.salesPrice * product.quantity;
      const discountAmount = (product.discount / 100) * price;
      return sum + (price - discountAmount);
    }, 0);
    setTotalPrice(total);
  }, [scannedProducts]);

  const handleScan = async (barcodeObject) => {
    setScanning(true);
    try {
      const token = Cookies.get("XTOKEN");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/products/scan`,
        barcodeObject,
        {
          headers: { Authorization: `${token}` },
        }
      );

      if (response.status === 200) {
        const newProduct = response.data.matchedProduct;
        const alreadyExists = scannedProducts.some(
          (p) => p.productCode === newProduct.productCode
        );

        if (alreadyExists) {
          toast.error("Product already added!");
        } else {
          setScannedProducts((prev) => [
            ...prev,
            {
              ...newProduct,
              salesPrice: newProduct.salesPrice,
              quantity: 1,
              discount: 0,
            },
          ]);
          toast.success("Product added!");
        }
      } else {
        toast.error("Product not found!");
      }
    } catch {
      toast.error("Error fetching product.");
    } finally {
      setScanning(false);
    }
  };

  const updateProductField = (index, field, value) => {
    const updated = [...scannedProducts];
    updated[index][field] = value;
    setScannedProducts(updated);
  };

  // const handleSubmit = async () => {
  //   const token = Cookies.get("XTOKEN");

  //   if (!user || !savedShop || scannedProducts.length === 0) {
  //     toast.error("Missing user/shop/product information.");
  //     return;
  //   }

  //   const payload = {
  //     products: scannedProducts.map((product) => ({
  //       productCode: product.code,
  //       code: product.productCode,
  //       productName: product.productName,
  //       itemCategory: product.itemCategory,
  //       brand: product.brand || "Unknown",
  //       salesPrice: parseFloat(product.salesPrice),
  //       quantity: product.quantity,
  //       discount: product.discount,
  //       totalPrice:
  //         product.salesPrice * product.quantity -
  //         (product.discount / 100) * (product.salesPrice * product.quantity),
  //     })),
  //     // totalPrice,
  //     shopAddress: savedShop.address || "N/A",
  //     ownerName: savedShop.ownerName || user.name,
  //     sellerId: user.id,
  //     shopId: savedShop.id,
  //     branch: savedShop.branch || "Main",
  //     soldAt: new Date().toISOString(),
  //     customer: {
  //       name: customerName,
  //       phone: customerPhone,
  //       email: customerEmail,
  //       address: customerAddress,
  //     },
  //   };

  //   try {
  //     setLoading(true);
  //     await axios.post(`${import.meta.env.VITE_BASE_URL}/sales`, payload, {
  //       headers: { Authorization: `${token}` },
  //     });

  //     toast.success("Sale recorded successfully!");
  //     setScannedProducts([]);
  //     setCustomerName("");
  //     setCustomerPhone("");
  //     setCustomerEmail("");
  //     setCustomerAddress("");
  //   } catch {
  //     toast.error("Failed to record sale.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async () => {
  if (scannedProducts.length === 0) {
    toast.error("Please scan at least one product.");
    return;
  }

  if (!customerName || !customerPhone) {
    toast.error("Please enter customer name and phone.");
    return;
  }

  const token = Cookies.get("token");

  const payload = {
    products: scannedProducts.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      salesPrice: item.salesPrice,
      discount: item.discount,
      totalPrice: item.totalPrice,
    })),
    totalPrice,
    customerName,
    customerPhone,
    customerEmail,
    customerAddress,
    shopId: savedShop?.id,
    userId: user?.id,
  };

  try {
    setLoading(true);

    // 1. Create the sale
    const saleResponse = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/sales`,
      payload,
      {
        headers: { Authorization: `${token}` },
      }
    );

    const sale = saleResponse.data;
    const saleId = sale?.id || new Date().getTime(); // fallback if no ID returned

    toast.success("Sale recorded successfully!");

    // 2. Generate invoice PDF
    const pdfBlob = generateInvoicePDF({
      products: payload.products,
      totalPrice,
      customer: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        address: customerAddress,
      },
      shop: savedShop,
      user,
      invoiceId: saleId,
    });

    // 3. Upload invoice PDF
    const formData = new FormData();
    formData.append("invoice", pdfBlob, `invoice-${saleId}.pdf`);
    formData.append("saleId", saleId);

    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/sales`,
      formData,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // 4. Reset form
    setScannedProducts([]);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setCustomerAddress("");
    setTotalPrice(0);
  } catch (error) {
    console.error("Error submitting sale:", error);
    toast.error("Failed to record sale.");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="max-w-4xl mx-auto p-6 mb-10">
      <section className="dark:text-gray-50">
        <form noValidate className="space-y-8">
          {/* Scanner */}
          <div className="rounded-2xl shadow-lg bg-white dark:bg-gray-900 p-6">
            <h3 className="text-2xl font-semibold mb-4">Scan Product</h3>
            {scanning ? (
              <div className="flex justify-center items-center h-40">
                <MagnifyingGlass
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="magnifying-glass-loading"
                  wrapperStyle={{}}
                  wrapperClass="magnifying-glass-wrapper"
                  glassColor="#c0efff"
                  color="#e15b64"
                />
              </div>
            ) : (
              <SaleBarcodeScanner onScan={handleScan} />
            )}
          </div>

          {/* Customer Info */}
          <div className="rounded-2xl shadow-lg bg-white dark:bg-gray-900 p-6">
            <h3 className="text-2xl font-semibold mb-4">Customer Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Customer Name"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <Input
                label="Phone"
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
              <Input
                label="Address"
                type="text"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Product List */}
          {scannedProducts.length > 0 && (
            <div className="rounded-2xl shadow-lg bg-white dark:bg-gray-900 p-6">
              <h3 className="text-2xl font-semibold mb-4">Scanned Products</h3>
              {scannedProducts.map((product, index) => (
                <div key={product.productCode} className="mb-4 border-b pb-4">
                  <h4 className="font-semibold text-lg mb-2">{product.productName}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Product Code" value={product.productCode} readOnly />
                    <Input label="Category" value={product.itemCategory} readOnly />
                    <Input
                      label="Selling Price"
                      type="number"
                      value={product.salesPrice}
                      onChange={(e) =>
                        updateProductField(index, "salesPrice", Number(e.target.value))
                      }
                    />
                    <Input
                      label="Quantity"
                      type="number"
                      value={product.quantity}
                      onChange={(e) =>
                        updateProductField(index, "quantity", Number(e.target.value))
                      }
                    />
                    <Input
                      label="Discount (%)"
                      type="number"
                      value={product.discount}
                      onChange={(e) =>
                        updateProductField(index, "discount", Number(e.target.value))
                      }
                    />
                    <Input
                      label="Total (After Discount)"
                      value={(
                        product.salesPrice * product.quantity -
                        (product.discount / 100) *
                          (product.salesPrice * product.quantity)
                      ).toFixed(2)}
                      readOnly
                    />
                  </div>
                </div>
              ))}

              <div className="text-xl font-bold mt-6">
                Grand Total: ৳{totalPrice.toFixed(2)}
              </div>

              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                variant="contained"
                color="primary"
                className="w-full mt-6"
              >
                {loading ? "Saving..." : "Submit Sale"}
              </Button>
            </div>
          )}
        </form>
      </section>
    </div>
  );
};

// Reusable Input Component
const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />
  </div>
);

export default AddSaleProduct;
