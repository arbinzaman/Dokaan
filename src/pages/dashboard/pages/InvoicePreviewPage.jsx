import { useLocation } from "react-router-dom";
import InvoicePreview from "../../../components/dashBoard/home/Invoice/InvoicePreview";
import InvoiceA4Preview from "../../../components/dashBoard/home/Invoice/InvoiceA4Preview";

const InvoicePreviewPage = () => {
  const { state } = useLocation();
  const invoiceData = state?.invoiceData;

  if (!invoiceData) return <div>No data to preview.</div>;

  const invoiceType = invoiceData.invoiceType || "POS"; // fallback to POS

  return (
    <div className="p-4 print:bg-white print:p-0">
      {invoiceType === "A4" ? (
        <InvoiceA4Preview invoiceData={invoiceData} />
      ) : (
        <InvoicePreview invoiceData={invoiceData} />
      )}

      <button
        onClick={() => window.print()}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 hidden print:hidden"
      >
        Print Invoice
      </button>
    </div>
  );
};

export default InvoicePreviewPage;
