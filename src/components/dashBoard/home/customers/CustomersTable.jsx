import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Star } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { useUser } from "../../../../contexts/AuthContext";

const monthOptions = [
  { value: "jan", label: "January" },
  { value: "feb", label: "February" },
  { value: "mar", label: "March" },
  { value: "apr", label: "April" },
  { value: "may", label: "May" },
  { value: "jun", label: "June" },
  { value: "jul", label: "July" },
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

const CustomersTable = ({ favoriteOnly = false }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const { savedShop } = useUser();
  const shopId = savedShop?.id;
  const itemsPerPage = 6;
  const yearOptions = getYearOptions();

  const fetchCustomers = useCallback(async () => {
    if (!shopId) {
      setCustomers([]);
      return;
    }
    setLoading(true);
    try {
      const token = Cookies.get("XTOKEN");
      const params = { shopId };
      if (year) params.year = year;
      if (month) params.month = month;
      if (day) params.day = day;

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/customers`,
        {
          params,
          headers: token ? { Authorization: token } : undefined,
        }
      );

      const list = Array.isArray(response.data?.data) ? response.data.data : [];
      const transformed = list.map((c) => {
        const purchases = Array.isArray(c.purchases) ? c.purchases : [];
        const totalPurchases =
          purchases.length > 0
            ? purchases.reduce((sum, p) => sum + Number(p.purchaseCount || 0), 0)
            : Number(c.totalPurchases ?? 0);
        const distinctShops = new Set(
          purchases
            .map((p) => p.shopName || p.savedShopName)
            .filter(Boolean)
        ).size;

        return {
          ...c,
          totalPurchases,
          shopCount: distinctShops || (totalPurchases > 0 ? 1 : 0),
          isFavorite: Boolean(c.isFavorite ?? c.favorite),
        };
      });

      setCustomers(transformed);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [shopId, year, month, day]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return customers.filter((customer) => {
      if (favoriteOnly && !customer.isFavorite) return false;
      if (!q) return true;
      return (
        customer.name?.toLowerCase().includes(q) ||
        customer.email?.toLowerCase().includes(q) ||
        customer.phone?.toLowerCase().includes(q)
      );
    });
  }, [customers, searchTerm, favoriteOnly]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / itemsPerPage)
  );
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filteredCustomers.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  const selectClass =
    "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl p-6 mb-10 mt-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {favoriteOnly ? "Favorite Customers" : "Customer Directory"}
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-2.5 items-center">
          <select
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              setCurrentPage(1);
            }}
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
            onChange={(e) => {
              setMonth(e.target.value);
              setCurrentPage(1);
            }}
            className={selectClass}
          >
            <option value="">All Months</option>
            {monthOptions.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          <select
            value={day}
            onChange={(e) => {
              setDay(e.target.value);
              setCurrentPage(1);
            }}
            className={selectClass}
          >
            <option value="">All Days</option>
            {[...Array(31)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search customers..."
              className="w-full sm:w-56 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              value={searchTerm}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800/60">
            <tr>
              {[
                "Name",
                "Phone",
                "Email",
                "Purchases",
                "Shops Visited",
                "Favorite",
              ].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-sm text-gray-500 dark:text-gray-400 py-8"
                >
                  Loading customers...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-sm text-gray-500 dark:text-gray-400 py-8"
                >
                  No customers found.
                </td>
              </tr>
            ) : (
              paginated.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                >
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    {customer.name || "Unnamed"}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {customer.phone || "N/A"}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {customer.email || "N/A"}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                    {customer.totalPurchases}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {customer.shopCount}
                  </td>
                  <td className="px-5 py-3.5 text-sm whitespace-nowrap">
                    {customer.isFavorite ? (
                      <Star
                        className="text-amber-400 fill-amber-400"
                        size={18}
                      />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredCustomers.length > itemsPerPage && (
        <div className="flex justify-center items-center mt-6 gap-4">
          <button
            type="button"
            disabled={safePage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            Page {safePage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={safePage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default CustomersTable;
