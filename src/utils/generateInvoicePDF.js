import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateInvoicePDF({
  products = [],
  sales = [],
  totalPrice = 0,
  customer = {},
  shop = {},
  user = {},
  sellerName,
  invoiceId,
  invoiceNumber,
  createdAt,
} = {}) {
  const doc = new jsPDF();
  const safeCustomer = customer || {};
  const safeShop = shop || {};
  const safeUser = user || {};

  const items =
    Array.isArray(products) && products.length > 0
      ? products
      : Array.isArray(sales)
        ? sales.map((s) => ({
          productName: s.name || s.productName || s.code || "Item",
          quantity: s.quantity,
          salesPrice: s.salesPrice,
          discount: s.discount ?? 0,
        }))
        : [];

  const dateObj = createdAt ? new Date(createdAt) : new Date();
  const formattedDate = Number.isNaN(dateObj.getTime())
    ? new Date().toLocaleDateString()
    : dateObj.toLocaleString();

  const shopName = safeShop.dokaan_name || safeShop.name || "Dokaan";
  const displayInvoiceId = invoiceNumber || invoiceId || "N/A";

  doc.setFontSize(18);
  doc.text(shopName, 14, 20);

  doc.setFontSize(11);
  let y = 28;
  if (safeShop.dokaan_location) {
    doc.text(String(safeShop.dokaan_location), 14, y);
    y += 6;
  }
  if (safeShop.dokaan_phone) {
    doc.text(`Phone: ${safeShop.dokaan_phone}`, 14, y);
    y += 6;
  }

  y += 2;
  doc.text(`Invoice ID: ${displayInvoiceId}`, 14, y);
  y += 6;
  doc.text(`Date: ${formattedDate}`, 14, y);
  y += 6;
  doc.text(`Seller: ${safeUser.name || sellerName || "Staff"}`, 14, y);
  y += 6;
  doc.text(`Customer: ${safeCustomer.name || "Walk-in Customer"}`, 14, y);
  y += 6;
  if (safeCustomer.phone) {
    doc.text(`Phone: ${safeCustomer.phone}`, 14, y);
    y += 6;
  }
  if (safeCustomer.email) {
    doc.text(`Email: ${safeCustomer.email}`, 14, y);
    y += 6;
  }
  if (safeCustomer.address) {
    doc.text(`Address: ${safeCustomer.address}`, 14, y);
    y += 6;
  }

  autoTable(doc, {
    startY: y + 4,
    head: [["Product", "Qty", "Price (BDT)", "Discount (%)", "Total (BDT)"]],
    body: items.map((p) => {
      const price = Number(p.salesPrice ?? 0);
      const qty = Number(p.quantity ?? 0);
      const disc = Number(p.discount ?? 0);
      const lineTotal = price * qty - (disc / 100) * (price * qty);
      return [
        p.productName || p.name || p.productCode || "Item",
        qty,
        price.toFixed(2),
        `${disc}%`,
        lineTotal.toFixed(2),
      ];
    }),
  });

  const finalY = doc.lastAutoTable?.finalY || y + 20;
  doc.setFontSize(12);
  doc.text(
    `Grand Total: BDT ${Number(totalPrice ?? 0).toFixed(2)}`,
    14,
    finalY + 10
  );

  return doc.output("blob");
}
