import dokaanLogo from "../../../../assets/Home/logos/DOKAAN.png";

const InvoiceA4Preview = ({ invoiceData }) => {
  if (!invoiceData) return <div>No invoice data found.</div>;

  // Normalize products array: either use products or map from sales
  const products = Array.isArray(invoiceData.products)
    ? invoiceData.products
    : Array.isArray(invoiceData.sales)
    ? invoiceData.sales.map((sale) => ({
        productName: sale.name || "Unnamed Product",
        quantity: sale.quantity || 0,
        salesPrice: sale.salesPrice || 0,
        discount: sale.discount || 0,
        productCode: sale.code || "",
        itemCategory: sale.itemCategory || "",
      }))
    : [];

  const {
    shop = invoiceData.shop || {},
    customer = invoiceData.customer || {},
    totalPrice = invoiceData.totalPrice || 0,
    invoiceId = invoiceData.invoiceId || invoiceData.invoiceNumber || "N/A",
    user = invoiceData.user || {},
    createdAt = invoiceData.createdAt || new Date().toISOString(),
  } = invoiceData;

  return (
    <div className="w-full max-w-[210mm] mx-auto bg-white text-gray-800 print:p-6 font-sans border border-gray-300 shadow-md p-10 print:shadow-none">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-gray-300 pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-wide text-gray-900 uppercase">{shop?.dokaan_name || shop?.shopName || "Shop Name"}</h1>
          <p className="text-sm text-gray-600 mt-1">{shop?.dokaan_location || shop?.shopLocation || ""}</p>
          <p className="text-sm text-gray-600">{shop?.dokaan_phone || shop?.shopPhone || ""}</p>
        </div>
        {/* <img src={dokaanLogo} alt="Dokaan Logo" className="w-14 h-auto" /> */}
      </header>

      {/* Invoice Info & Seller */}
      <section className="flex justify-between text-sm mb-4">
        <div>
          <p className="font-semibold text-gray-700">Invoice ID:</p>
          <p className="text-gray-600">{invoiceId}</p>

          <p className="font-semibold text-gray-700 mt-4">Sold By:</p>
          <p className="text-gray-800">{user?.name || invoiceData.sellerName || "Seller Name"}</p>
          {user?.email && <p className="text-gray-600">{user.email}</p>}
          {user?.phone && <p className="text-gray-600">{user.phone}</p>}
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-700">Issued On:</p>
          <p className="text-gray-600">{new Date(createdAt).toLocaleString()}</p>
        </div>
      </section>

      {/* Customer Info */}
      <section className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6 text-sm">
        <p className="font-semibold text-gray-700 mb-2">Customer Information:</p>
        <p>{customer?.name || "Walk-in Customer"}</p>
        <p>{customer?.phone || ""}</p>
        {customer?.email && <p>{customer.email}</p>}
        {customer?.address && <p>{customer.address}</p>}
      </section>

      {/* Products Table */}
      <table className="w-full text-sm border border-gray-200 mb-6">
        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <th className="text-left p-3">Product</th>
            <th className="text-right p-3">Qty</th>
            <th className="text-right p-3">Unit Price</th>
            <th className="text-right p-3">Discount</th>
            <th className="text-right p-3">Line Total</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((item, idx) => {
              const lineTotal =
                item.salesPrice * item.quantity -
                (item.discount / 100) * item.salesPrice * item.quantity;

              return (
                <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="p-3">{item.productName}</td>
                  <td className="p-3 text-right">{item.quantity}</td>
                  <td className="p-3 text-right">৳{item.salesPrice.toFixed(2)}</td>
                  <td className="p-3 text-right">{item.discount || 0}%</td>
                  <td className="p-3 text-right font-medium">৳{lineTotal.toFixed(2)}</td>
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

      {/* Summary */}
      <section className="flex justify-end text-sm">
        <div className="w-full sm:w-1/2 md:w-1/3 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-700">Subtotal:</span>
            <span className="text-gray-900 font-medium">৳{totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>VAT (0%)</span>
            <span>৳0.00</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-3 text-lg mt-3">
            <span>Total Due:</span>
            <span>৳{totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 border-t pt-6 text-center text-xs text-gray-500">
        <p className="italic mb-2">Thank you for shopping with us!</p>
        <img src={dokaanLogo} alt="Dokaan Logo" className="w-10 mx-auto mb-1" />
        {/* <p className="text-[11px]">
          Made with <span className="text-red-500 font-semibold">Dokaan</span>
        </p> */}
      </footer>
    </div>
  );
};

export default InvoiceA4Preview;
