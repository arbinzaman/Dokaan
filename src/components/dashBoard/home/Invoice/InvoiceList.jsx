import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/contexts/AuthContext";
import { Download, Eye, RotateCcw, Search } from "lucide-react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { generateInvoicePDF } from "../../../../utils/generateInvoicePDF";

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const getYearOptions = () => {
  const current = new Date().getFullYear();
  const years = [];
  for (let y = current; y >= 2023; y--) {
    years.push(String(y));
  }
  return years;
};

const fetchInvoices = async ({ queryKey }) => {
  const [, shopId] = queryKey;
  if (!shopId) return [];

  const token = Cookies.get("XTOKEN");
  const res = await fetch(
    `${import.meta.env.VITE_BASE_URL}/invoices?shopId=${shopId}`,
    {
      headers: {
        ...(token ? { Authorization: token } : {}),
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch invoices");
  const data = await res.json();
  return Array.isArray(data?.data) ? data.data : [];
};

const InvoiceList = () => {
  const { savedShop } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [returnedIds, setReturnedIds] = useState([]);
  const itemsPerPage = 6;
  const yearOptions = getYearOptions();
  const navigate = useNavigate();

  const {
    data: invoices = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["invoices", savedShop?.id],
    queryFn: fetchInvoices,
    enabled: !!savedShop?.id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const filteredInvoices = invoices.filter((invoice) => {
    if (year || month || day) {
      const invoiceDate = invoice.createdAt ? new Date(invoice.createdAt) : null;
      if (!invoiceDate || Number.isNaN(invoiceDate.getTime())) return false;
      if (year && invoiceDate.getFullYear().toString() !== year) return false;
      if (
        month &&
        (invoiceDate.getMonth() + 1).toString().padStart(2, "0") !== month
      ) {
        return false;
      }
      if (day && invoiceDate.getDate().toString().padStart(2, "0") !== day) {
        return false;
      }
    }

    const term = searchTerm.toLowerCase();
    return (
      invoice.invoiceNumber?.toLowerCase().includes(term) ||
      invoice.customer?.name?.toLowerCase().includes(term) ||
      invoice.sellerName?.toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, year, month, day]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInvoices.length / itemsPerPage)
  );
  const safePage = Math.min(currentPage, totalPages);
  const currentInvoices = filteredInvoices.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  const enrichInvoice = (inv) => ({
    ...inv,
    shop: inv.shop || savedShop,
    invoiceType: inv.invoiceType || localStorage.getItem("invoiceType") || "POS",
  });

  const handleView = (invoiceData) => {
    const payload = enrichInvoice(invoiceData);
    localStorage.setItem("invoiceData", JSON.stringify(payload));
    navigate("/dashboard/preview-invoice", { state: { invoiceData: payload } });
  };

  const handleDownloadPdf = (inv) => {
    const payload = enrichInvoice(inv);
    const blob = generateInvoicePDF(payload);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${inv.invoiceNumber || inv.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleReturn = (inv) => {
    if (returnedIds.includes(inv.id)) return;
    const confirmed = window.confirm(
      `Mark invoice ${inv.invoiceNumber || inv.id} as returned?`
    );
    if (!confirmed) return;
    setReturnedIds((prev) => [...prev, inv.id]);
    toast.success(`Return recorded for ${inv.invoiceNumber || inv.id}.`);
  };

  const selectClass =
    "px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Invoices &amp; Receipts
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Preview, print, or export PDF copies of your receipts.
          </p>
        </div>
        <div className="flex gap-2.5 flex-wrap items-center">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={selectClass}
          >
            <option value="">All Years</option>
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className={selectClass}
          >
            <option value="">All Months</option>
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className={selectClass}
          >
            <option value="">All Days</option>
            {[...Array(31).keys()].map((d) => {
              const val = String(d + 1).padStart(2, "0");
              return (
                <option key={val} value={val}>
                  {val}
                </option>
              );
            })}
          </select>
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search invoices..."
              className="w-full sm:w-56 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800/60">
            <tr>
              {["Invoice No", "Customer", "Total", "Seller", "Date", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-8 text-sm text-gray-500 dark:text-gray-400"
                >
                  Loading invoices...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-sm text-red-500">
                  Failed to load invoices.
                </td>
              </tr>
            ) : currentInvoices.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-8 text-sm text-gray-500 dark:text-gray-400"
                >
                  No invoices found.
                </td>
              </tr>
            ) : (
              currentInvoices.map((inv) => {
                const isReturned = returnedIds.includes(inv.id);
                return (
                  <tr
                    key={inv.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-sm font-mono font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {inv.invoiceNumber || inv.invoiceId || `#${inv.id}`}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">
                      {inv.customer?.name || "Walk-in Customer"}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                      ৳{Number(inv.totalPrice ?? 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {inv.sellerName || inv.user?.name || "-"}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {inv.createdAt
                        ? new Date(inv.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleView(inv)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors"
                        >
                          <Eye size={14} />
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadPdf(inv)}
                          aria-label="Download PDF"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-medium transition-colors"
                        >
                          <Download size={14} />
                          PDF
                        </button>
                        <button
                          type="button"
                          disabled={isReturned}
                          onClick={() => handleReturn(inv)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 disabled:opacity-50 rounded-lg text-xs font-medium transition-colors"
                        >
                          <RotateCcw size={13} />
                          {isReturned ? "Returned" : "Return"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-3">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="px-3.5 py-1.5 text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            Page {safePage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="px-3.5 py-1.5 text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default InvoiceList;
