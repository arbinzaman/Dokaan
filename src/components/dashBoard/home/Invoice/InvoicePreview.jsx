import dokaanLogo from "../../../../assets/Home/logos/DOKAAN.png";

const normalizeProducts = (invoiceData) => {
  if (Array.isArray(invoiceData?.products)) {
    return invoiceData.products.map((item) => ({
      productName: item.productName || item.name || "Unnamed Item",
      quantity: Number(item.quantity ?? 0),
      salesPrice: Number(item.salesPrice ?? 0),
      discount: Number(item.discount ?? 0),
    }));
  }
  if (Array.isArray(invoiceData?.sales)) {
    return invoiceData.sales.map((sale) => ({
      productName: sale.name || sale.productName || "Unnamed Item",
      quantity: Number(sale.quantity ?? 0),
      salesPrice: Number(sale.salesPrice ?? 0),
      discount: Number(sale.discount ?? 0),
    }));
  }
  return [];
};

const InvoicePreview = ({ invoiceData }) => {
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
  const invoiceNumber =
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
    <div className="invoice-container w-full max-w-[92mm] mx-auto bg-white p-5 shadow-md text-gray-800 print:shadow-none print:px-2 print:py-2 font-sans border border-gray-300 rounded-lg print:rounded-none">
      <div className="text-center border-b border-gray-300 pb-3 mb-4">
        <h1 className="text-xl font-bold uppercase text-gray-900 tracking-wide">
          {shop.dokaan_name}
        </h1>
        {shop.dokaan_location && (
          <p className="text-xs text-gray-600">{shop.dokaan_location}</p>
        )}
        {shop.dokaan_phone && (
          <p className="text-xs text-gray-600">{shop.dokaan_phone}</p>
        )}
      </div>

      <div className="flex justify-between text-xs mb-4 gap-2">
        <div>
          <p className="font-semibold">Invoice ID</p>
          <p className="text-gray-700 font-mono">{invoiceNumber}</p>

          <p className="font-semibold mt-2.5">Sold By</p>
          <p className="text-gray-800">
            {user.name || invoiceData.sellerName || "Staff"}
          </p>
          {user.email && <p className="text-gray-600">{user.email}</p>}
        </div>
        <div className="text-right">
          <p className="font-semibold">Date</p>
          <p className="text-gray-700">{formattedDate}</p>
        </div>
      </div>

      <div className="mb-4 border border-gray-200 rounded p-2.5 text-xs">
        <p className="font-semibold text-gray-700 mb-0.5">Billed To:</p>
        <p className="font-medium">{customer.name || "Walk-in Customer"}</p>
        {customer.phone && <p>{customer.phone}</p>}
        {customer.email && <p>{customer.email}</p>}
        {customer.address && <p>{customer.address}</p>}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse mb-4">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="text-left p-1.5">Item</th>
              <th className="text-right p-1.5">Qty</th>
              <th className="text-right p-1.5">Price</th>
              <th className="text-right p-1.5">Disc</th>
              <th className="text-right p-1.5">Total</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((item, idx) => {
                const lineTotal =
                  item.salesPrice * item.quantity -
                  (item.discount / 100) * item.salesPrice * item.quantity;

                return (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="p-1.5">{item.productName}</td>
                    <td className="text-right p-1.5">{item.quantity}</td>
                    <td className="text-right p-1.5">
                      ৳{item.salesPrice.toFixed(2)}
                    </td>
                    <td className="text-right p-1.5">{item.discount}%</td>
                    <td className="text-right p-1.5 font-semibold">
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
      </div>

      <div className="text-xs border-t pt-3 mt-4 space-y-1">
        <div className="flex justify-between">
          <span className="font-medium">Subtotal</span>
          <span>৳{(subtotal || totalPrice).toFixed(2)}</span>
        </div>
        {totalDiscount > 0 && (
          <div className="flex justify-between text-emerald-700">
            <span>Discount</span>
            <span>-৳{totalDiscount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-500">
          <span>VAT (0%)</span>
          <span>৳0.00</span>
        </div>
        <div className="flex justify-between py-2 mt-2 text-sm font-bold border-t">
          <span>Total</span>
          <span>৳{totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="text-center mt-5 text-xs text-gray-500 border-t pt-3">
        <p className="italic">Thanks for shopping with us!</p>
        <img
          src={dokaanLogo}
          alt="Dokaan Logo"
          className="w-12 mx-auto mt-2 mb-1"
        />
      </div>
    </div>
  );
};

export default InvoicePreview;
