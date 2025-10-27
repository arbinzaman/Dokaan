import dokaanLogo from "../../../../assets/Home/logos/DOKAAN.png";

const InvoicePreview = ({ invoiceData }) => {
  if (!invoiceData) return <div>No invoice data found.</div>;

  const products = Array.isArray(invoiceData.products)
    ? invoiceData.products
    : Array.isArray(invoiceData.sales)
    ? invoiceData.sales.map((sale) => ({
        productName: sale.name || "Unnamed Item",
        quantity: sale.quantity || 0,
        salesPrice: sale.salesPrice || 0,
        discount: sale.discount || 0,
        productCode: sale.code || "",
        itemCategory: sale.itemCategory || "",
      }))
    : [];

  const shop = {
    dokaan_name: invoiceData.shop?.dokaan_name || invoiceData.shopName || "Unnamed Shop",
    dokaan_location: invoiceData.shop?.dokaan_location || invoiceData.shopAddress || "",
    dokaan_phone: invoiceData.shop?.dokaan_phone || invoiceData.shopPhone || "",
  };

  const {
    customer = invoiceData.customer || {},
    totalPrice = invoiceData.totalPrice || 0,
    invoiceNumber,
    invoiceId,
    user = invoiceData.user || {},
    createdAt = invoiceData.createdAt || new Date().toISOString(),
  } = invoiceData;

  return (
    <div className="invoice-container w-full max-w-[92mm] mx-auto bg-white p-6 shadow-md text-gray-800 print:shadow-none print:px-2 print:py-2 font-inter border border-gray-300">
      <div className="text-center border-b border-gray-300 pb-3 mb-4">
        <h1 className="text-2xl font-bold uppercase text-gray-900 tracking-wide">
          {shop.dokaan_name}
        </h1>
        <p className="text-sm text-gray-600">{shop.dokaan_location}</p>
        <p className="text-sm text-gray-600">{shop.dokaan_phone}</p>
      </div>

      <div className="flex justify-between text-xs mb-4">
        <div>
          <p className="font-semibold">Invoice ID</p>
          <p className="text-gray-700">{invoiceNumber || invoiceId || "N/A"}</p>

          <p className="font-semibold mt-3">Sold By</p>
          <p className="text-gray-800">{user.name || invoiceData.sellerName || "Unknown Seller"}</p>
          {user.email && <p className="text-gray-600">{user.email}</p>}
          {user.phone && <p className="text-gray-600">{user.phone}</p>}
        </div>
        <div className="text-right">
          <p className="font-semibold">Date</p>
          <p className="text-gray-700">{new Date(createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="mb-4 border border-gray-200 p-3 text-sm">
        <p className="font-semibold text-gray-700 mb-1">Billed To:</p>
        <p>{customer.name || "Walk-in Customer"}</p>
        {customer.phone && <p>{customer.phone}</p>}
        {customer.email && <p>{customer.email}</p>}
        {customer.address && <p>{customer.address}</p>}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse mb-4">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="text-left p-2">Item</th>
              <th className="text-right p-2">Qty</th>
              <th className="text-right p-2">Price</th>
              <th className="text-right p-2">Disc%</th>
              <th className="text-right p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((item, idx) => {
                const total =
                  item.salesPrice * item.quantity -
                  (item.discount / 100) * item.salesPrice * item.quantity;

                return (
                  <tr key={idx} className="border-b">
                    <td className="p-2">{item.productName}</td>
                    <td className="text-right p-2">{item.quantity}</td>
                    <td className="text-right p-2">৳{item.salesPrice.toFixed(2)}</td>
                    <td className="text-right p-2">{item.discount || 0}%</td>
                    <td className="text-right p-2 font-semibold">৳{total.toFixed(2)}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="text-sm border-t pt-3 mt-4">
        <div className="flex justify-between py-1">
          <span className="font-medium">Subtotal</span>
          <span>৳{totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-1 text-gray-500">
          <span>VAT (0%)</span>
          <span>৳0.00</span>
        </div>
        <div className="flex justify-between py-2 mt-2 text-base font-bold border-t">
          <span>Total</span>
          <span>৳{totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="text-center mt-6 text-xs text-gray-500 border-t pt-3">
        <p className="italic">Thanks for shopping with us!</p>
        <img src={dokaanLogo} alt="Dokaan Logo" className="w-12 mx-auto mt-2 mb-1" />
      </div>
    </div>
  );
};

export default InvoicePreview;
