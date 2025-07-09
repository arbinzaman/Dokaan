import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/contexts/AuthContext";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const fetchInvoices = async ({ queryKey }) => {
  const [, shopId, year, month, day] = queryKey;
  const token = Cookies.get("XTOKEN");

  const params = new URLSearchParams();
  if (shopId) params.append("shopId", shopId);
  if (year) params.append("year", year);
  if (month) params.append("month", month);
  if (day) params.append("day", day);

  const res = await fetch(
    `${import.meta.env.VITE_BASE_URL}/invoices?${params.toString()}`,
    {
      headers: {
        Authorization: token,
        Accept: "application/json",
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch invoices");
  const data = await res.json();

  return Array.isArray(data.data) ? data.data : [];
};

const InvoiceList = () => {
  const { savedShop } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  const {
    data: invoices = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["invoices", savedShop?.id, year, month, day],
    queryFn: fetchInvoices,
    enabled: !!savedShop?.id,
  });

  const filteredInvoices = invoices.filter((invoice) => {
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = filteredInvoices.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) setCurrentPage(pageNum);
  };

  const handleView = (invoiceData) => {
    localStorage.setItem("invoiceData", JSON.stringify(invoiceData));
    navigate("/dashboard/preview-invoice", {
      state: { invoiceData },
    });
  };

  const renderOptions = (options) =>
    options.map((opt) => (
      <option key={opt} value={opt}>
        {opt}
      </option>
    ));

  return (
    <motion.div
      className="bg-white dark:bg-black p-6 rounded-xl shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-black dark:text-white">
          Invoices
        </h2>
        <div className="flex gap-3 flex-wrap">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="p-2 rounded"
          >
            <option value="">All Years</option>
            {renderOptions(["2023", "2024", "2025"])}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="p-2 rounded"
          >
            <option value="">All Months</option>
            {renderOptions([
              "01",
              "02",
              "03",
              "04",
              "05",
              "06",
              "07",
              "08",
              "09",
              "10",
              "11",
              "12",
            ])}
          </select>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="p-2 rounded"
          >
            <option value="">All Days</option>
            {renderOptions(
              [...Array(31).keys()].map((d) =>
                (d + 1).toString().padStart(2, "0")
              )
            )}
          </select>
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="bg-blue-400 text-white placeholder-white rounded-lg pl-10 pr-4 py-2"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
            <Search className="absolute left-3 top-2.5 text-white" size={18} />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              {["Invoice No", "Customer", "Total", "Seller", "Date", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-sm font-semibold text-black dark:text-white uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-red-500">
                  Failed to load
                </td>
              </tr>
            ) : currentInvoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  No invoices found.
                </td>
              </tr>
            ) : (
              currentInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="px-6 py-4">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4">{inv.customer?.name || "-"}</td>
                  <td className="px-6 py-4">৳ {inv.totalPrice?.toFixed(2)}</td>
                  <td className="px-6 py-4">{inv.sellerName || "-"}</td>
                  <td className="px-6 py-4">
                    {inv.createdAt
                      ? new Date(inv.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleView(inv)}
                      className="px-4 py-1 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all duration-200 text-sm"
                    >
                      View
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-1 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-all duration-200 text-sm"
                    >
                      Return
                    </motion.button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 rounded ${
                  page === currentPage
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
                }`}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default InvoiceList;
