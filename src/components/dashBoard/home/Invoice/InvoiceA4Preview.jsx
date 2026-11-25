import dokaanLogo from "../../../../assets/Home/logos/DOKAAN.png";

const normalizeProducts = (invoiceData) => {
  if (Array.isArray(invoiceData?.products)) {
    return invoiceData.products.map((item) => ({
      productName: item.productName || item.name || "Unnamed Product",
      quantity: Number(item.quantity ?? 0),
      salesPrice: Number(item.salesPrice ?? 0),
      discount: Number(item.discount ?? 0),
    }));
  }
  if (Array.isArray(invoiceData?.sales)) {
    return invoiceData.sales.map((sale) => ({
      productName: sale.name || sale.productName || "Unnamed Product",
      quantity: Number(sale.quantity ?? 0),
      salesPrice: Number(sale.salesPrice ?? 0),
      discount: Number(sale.discount ?? 0),
    }));
  }
  return [];
};

const InvoiceA4Preview = ({ invoiceData }) => {
  if (!invoiceData) return <div>No invoice data found.</div>;

  const products = normalizeProducts(invoiceData);
  const shop = {
    dokaan_name:
      invoiceData.shop?.dokaan_name ||
      invoiceData.shopName ||
      "Unnamed Shop",
    dokaan_location:
      invoiceData.shop?.dokaan_location || invoiceData.shopAddress || "",
    dokaan_phone:
      invoiceData.shop?.dokaan_phone || invoiceData.shopPhone || "",
  };

  const customer = invoiceData.customer || {};
  const user = invoiceData.user || {};
  const invoiceId =
    invoiceData.invoiceNumber || invoiceData.invoiceId || "N/A";
  const createdAt = invoiceData.createdAt
    ? new Date(invoiceData.createdAt)
    : new Date();
  const formattedDate = Number.isNaN(createdAt.getTime())
    ? new Date().toLocaleString()
    : createdAt.toLocaleString();

  const subtotal = products.reduce(
    (sum, item) => sum + item.salesPrice * item.quantity,
    0
  );
  const totalDiscount = products.reduce(
    (sum, item) =>
      sum + (item.discount / 100) * (item.salesPrice * item.quantity),
    0
  );
  const computedTotal = Math.max(0, subtotal - totalDiscount);
  const totalPrice =
    invoiceData.totalPrice != null && !Number.isNaN(Number(invoiceData.totalPrice))
      ? Number(invoiceData.totalPrice)
      : computedTotal;

  return (
    <div className="w-full max-w-[210mm] mx-auto bg-white text-gray-800 print:p-6 font-sans border border-gray-300 rounded-xl print:rounded-none shadow-md p-8 sm:p-10 print:shadow-none">
      <header className="flex justify-between items-start border-b border-gray-300 pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-wide text-gray-900 uppercase">
            {shop.dokaan_name}
          </h1>
          {shop.dokaan_location && (
            <p className="text-sm text-gray-600 mt-1">{shop.dokaan_location}</p>
          )}
          {shop.dokaan_phone && (
            <p className="text-sm text-gray-600">{shop.dokaan_phone}</p>
          )}
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Invoice
          </span>
          <p className="text-sm font-mono font-semibold text-gray-800 mt-1">
            {invoiceId}
          </p>
        </div>
      </header>

      <section className="flex flex-wrap justify-between gap-4 text-sm mb-6">
        <div>
          <p className="font-semibold text-gray-700">Sold By:</p>
          <p className="text-gray-900">
            {user.name || invoiceData.sellerName || "Staff"}
          </p>
          {user.email && <p className="text-gray-600">{user.email}</p>}
          {user.phone && <p className="text-gray-600">{user.phone}</p>}
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-700">Issued On:</p>
          <p className="text-gray-600">{formattedDate}</p>
        </div>
      </section>

      <section className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-sm">
        <p className="font-semibold text-gray-700 mb-1.5">
          Customer Information:
        </p>
        <p className="font-medium text-gray-900">
          {customer.name || "Walk-in Customer"}
        </p>
        {customer.phone && <p>{customer.phone}</p>}
        {customer.email && <p>{customer.email}</p>}
        {customer.address && <p>{customer.address}</p>}
      </section>

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
                <tr key={idx} className="border-t border-gray-200">
                  <td className="p-3">{item.productName}</td>
                  <td className="p-3 text-right">{item.quantity}</td>
                  <td className="p-3 text-right">
                    ৳{item.salesPrice.toFixed(2)}
                  </td>
                  <td className="p-3 text-right">{item.discount}%</td>
                  <td className="p-3 text-right font-medium">
                    ৳{lineTotal.toFixed(2)}
                  </td>
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

      <section className="flex justify-end text-sm">
        <div className="w-full sm:w-1/2 md:w-1/3 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-700">Subtotal:</span>
            <span className="text-gray-900 font-medium">
              ৳{(subtotal || totalPrice).toFixed(2)}
            </span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Discount:</span>
              <span>-৳{totalDiscount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-500">
            <span>VAT (0%):</span>
            <span>৳0.00</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-3 text-lg mt-3">
            <span>Total Paid:</span>
            <span>৳{totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </section>

      <footer className="mt-10 border-t pt-6 text-center text-xs text-gray-500">
        <p className="italic mb-2">Thank you for shopping with us!</p>
        <img
          src={dokaanLogo}
          alt="Dokaan Logo"
          className="w-12 mx-auto mb-1"
        />
      </footer>
    </div>
  );
};

export default InvoiceA4Preview;
