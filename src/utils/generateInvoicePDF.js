import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateInvoicePDF({
  products,
  totalPrice,
  customer,
  shop,
  user,
  invoiceId,
}) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Invoice", 14, 22);

  doc.setFontSize(12);
  doc.text(`Invoice ID: ${invoiceId}`, 14, 32);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 38);
  doc.text(`Seller: ${user?.name}`, 14, 44);
  doc.text(`Shop: ${shop?.name || "N/A"}`, 14, 50);
  doc.text(`Customer: ${customer.name}`, 14, 56);
  doc.text(`Phone: ${customer.phone}`, 14, 62);
  if (customer.email) doc.text(`Email: ${customer.email}`, 14, 68);
  if (customer.address) doc.text(`Address: ${customer.address}`, 14, 74);

  autoTable(doc, {
    startY: 80,
    head: [["Product", "Qty", "Price", "Discount (%)", "Total"]],
    body: products.map((p) => [
      p.productName || p.productCode,
      p.quantity,
      p.salesPrice.toFixed(2),
      p.discount,
      (
        p.salesPrice * p.quantity -
        (p.discount / 100) * (p.salesPrice * p.quantity)
      ).toFixed(2),
    ]),
  });

  doc.text(`Grand Total: ৳${totalPrice.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);

  return doc.output("blob");
}
