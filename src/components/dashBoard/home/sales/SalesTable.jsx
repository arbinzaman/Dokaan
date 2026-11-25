import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../../../contexts/AuthContext";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const MONTHS = [
  { value: "jan", label: "January" },
  { value: "feb", label: "February" },
  { value: "march", label: "March" },
  { value: "april", label: "April" },
  { value: "may", label: "May" },
  { value: "june", label: "June" },
  { value: "july", label: "July" },
  { value: "aug", label: "August" },
  { value: "sep", label: "September" },
  { value: "oct", label: "October" },
  { value: "nov", label: "November" },
  { value: "dec", label: "December" },
];

const getYearOptions = () => {
  const current = new Date().getFullYear();
  const years = [];
  for (let y = current; y >= 2023; y--) {
    years.push(String(y));
  }
  return years;
};

const fetchSalesData = async ({ queryKey }) => {
  const [, shopId, year, month, day] = queryKey;
  const token = Cookies.get("XTOKEN");

  const params = new URLSearchParams();
  if (shopId) params.append("shopId", shopId);
  if (year) params.append("year", year);
  if (month) params.append("month", month);
  if (day) params.append("day", day);

  const res = await fetch(
    `${import.meta.env.VITE_BASE_URL}/sales?${params.toString()}`,
    {
      headers: {
        ...(token ? { Authorization: token } : {}),
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch sales");
  const response = await res.json();
  return Array.isArray(response?.filteredSales)
    ? response.filteredSales
    : Array.isArray(response?.data)
    ? response.data
    : [];
};

const SalesTable = () => {
  const { savedShop } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const yearOptions = getYearOptions();

  const {
    data: sales = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sales", savedShop?.id, year, month, day],
    queryFn: fetchSalesData,
    enabled: !!savedShop?.id,
  });

  const filteredSales = sales.filter((sale) => {
    const term = searchTerm.toLowerCase();
    return (
      sale?.name?.toLowerCase().includes(term) ||
      sale?.itemCategory?.toLowerCase().includes(term) ||
      sale?.code?.toLowerCase().includes(term) ||
      sale?.seller?.name?.toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, year, month, day]);

  const totalPages = Math.max(1, Math.ceil(filteredSales.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const currentSales = filteredSales.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  const selectClass =
    "px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl p-6 mb-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Sales History
        </h2>
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
              placeholder="Search sales..."
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
              {[
                "Name",
                "Category",
                "Price",
                "Qty",
                "Total",
                "Code",
                "Sold At",
                "Seller",
                "Shop",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {isLoading ? (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-8 text-sm text-gray-500 dark:text-gray-400"
                >
                  Loading sales...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-sm text-red-500">
                  Error loading sales.
                </td>
              </tr>
            ) : currentSales.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-8 text-sm text-gray-500 dark:text-gray-400"
                >
                  No sales records available.
                  <div className="mt-4">
                    <Link
                      to="/dashboard/product-sell"
                      className="inline-flex bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Record a Sale
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              currentSales.map((sale) => {
                const unitPrice = Number(sale.salesPrice ?? 0);
                const total = Number(sale.totalPrice ?? 0);
                return (
                  <tr
                    key={sale.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-4 py-3.5 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {sale.name}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {sale.itemCategory || "-"}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">
                      ৳{unitPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">
                      {sale.quantity}
                    </td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                      ৳{total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5 text-xs font-mono text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {sale.code}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {sale.soldAt
                        ? new Date(sale.soldAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {sale.seller?.name || "-"}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {sale.shop?.name || "-"}
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

export default SalesTable;
