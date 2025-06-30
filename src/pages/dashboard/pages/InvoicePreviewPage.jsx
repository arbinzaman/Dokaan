import { useLocation, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import InvoicePreview from "../../../components/dashBoard/home/Invoice/InvoicePreview";
import InvoiceA4Preview from "../../../components/dashBoard/home/Invoice/InvoiceA4Preview";

const InvoicePreviewPage = () => {
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const autoPrint = searchParams.get("autoPrint") === "true";

  // Prefer passed state, fallback to localStorage
  const invoiceData =
    state?.invoiceData || JSON.parse(localStorage.getItem("invoiceData"));

  useEffect(() => {
    if (autoPrint && invoiceData) {
      setTimeout(() => {
        window.print();
      }, 500); // slight delay to ensure DOM ready
    }
  }, [autoPrint, invoiceData]);

  if (!invoiceData) return <div>No data to preview.</div>;

  const invoiceType = invoiceData.invoiceType || "POS";

  return (
    <div className="p-4 print:bg-white print:p-0" id="print-section">
      {invoiceType === "A4" ? (
        <InvoiceA4Preview invoiceData={invoiceData} />
      ) : (
        <InvoicePreview invoiceData={invoiceData} />
      )}

      {!autoPrint && (
        <button
          onClick={() => window.print()}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 hidden print:hidden"
        >
          Print Invoice
        </button>
      )}
    </div>
  );
};

export default InvoicePreviewPage;
