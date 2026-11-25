import { useLocation, useSearchParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Download, Printer } from "lucide-react";
import InvoicePreview from "../../../components/dashBoard/home/Invoice/InvoicePreview";
import InvoiceA4Preview from "../../../components/dashBoard/home/Invoice/InvoiceA4Preview";
import { generateInvoicePDF } from "../../../utils/generateInvoicePDF";

const readStoredInvoice = () => {
  try {
    const raw = localStorage.getItem("invoiceData");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const InvoicePreviewPage = () => {
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const autoPrint = searchParams.get("autoPrint") === "true";

  const invoiceData = useMemo(
    () => state?.invoiceData || readStoredInvoice(),
    [state]
  );

  const [layoutType, setLayoutType] = useState(
    () =>
      invoiceData?.invoiceType || localStorage.getItem("invoiceType") || "POS"
  );

  useEffect(() => {
    if (!autoPrint || !invoiceData) return;
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, [autoPrint, invoiceData]);

  if (!invoiceData) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-4">
        <p className="text-gray-600 dark:text-gray-300">
          No invoice data available to preview.
        </p>
        <Link
          to="/dashboard/invoices"
          className="inline-flex px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
        >
          Go to Invoices
        </Link>
      </div>
    );
  }

  const handleDownloadPdf = () => {
    const blob = generateInvoicePDF(invoiceData);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${
      invoiceData.invoiceNumber || invoiceData.invoiceId || Date.now()
    }.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="max-w-5xl mx-auto py-4 px-2 sm:px-4">
      {/* Action Bar (hidden when printing) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Format:
          </span>
          <button
            type="button"
            onClick={() => setLayoutType("POS")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              layoutType === "POS"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            POS (92mm)
          </button>
          <button
            type="button"
            onClick={() => setLayoutType("A4")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              layoutType === "A4"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            A4 Page
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium transition-colors"
          >
            <Download size={16} />
            Download PDF
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
          >
            <Printer size={16} />
            Print Invoice
          </button>
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div
        id="print-section"
        className="print:bg-white print:p-0 mx-auto"
        style={
          layoutType === "POS"
            ? { maxWidth: "92mm" }
            : { maxWidth: "210mm" }
        }
      >
        {layoutType === "A4" ? (
          <InvoiceA4Preview invoiceData={invoiceData} />
        ) : (
          <InvoicePreview invoiceData={invoiceData} />
        )}
      </div>
    </div>
  );
};

export default InvoicePreviewPage;
