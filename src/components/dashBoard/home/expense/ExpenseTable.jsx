import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../../../contexts/AuthContext";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

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

const fetchExpensesData = async ({ queryKey }) => {
  const [, shopId, year, month, day] = queryKey;
  const token = Cookies.get("XTOKEN");

  const params = new URLSearchParams();
  if (shopId) params.append("shopId", shopId);
  if (year) params.append("year", year);
  if (month) params.append("month", month);
  if (day) params.append("day", day);

  const res = await fetch(
    `${import.meta.env.VITE_BASE_URL}/expenses?${params.toString()}`,
    {
      headers: {
        ...(token ? { Authorization: token } : {}),
        Accept: "application/json",
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch expenses");

  const response = await res.json();
  const list = Array.isArray(response?.data) ? response.data : [];
  // Exclude fixed costs so they aren't duplicated or stripped of type="fixed" on edit
  return list.filter((e) => e?.type !== "fixed");
};

const ExpenseTable = () => {
  const { savedShop } = useUser();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const yearOptions = getYearOptions();

  const {
    data: expenses = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["expenses", savedShop?.id, year, month, day],
    queryFn: fetchExpensesData,
    enabled: !!savedShop?.id,
  });

  const filteredExpenses = expenses.filter((expense) => {
    const term = searchTerm.toLowerCase();
    return (
      expense?.title?.toLowerCase().includes(term) ||
      expense?.category?.toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, year, month, day]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredExpenses.length / itemsPerPage)
  );
  const safePage = Math.min(currentPage, totalPages);
  const currentExpenses = filteredExpenses.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  const selectClass =
    "px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl p-6 mb-10"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Variable Expenses
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
              placeholder="Search expenses..."
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
              {["Title", "Category", "Amount", "Date", "Added By", "Shop"].map(
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
                  Loading expenses...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-sm text-red-500">
                  Error loading expenses.
                </td>
              </tr>
            ) : currentExpenses.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-8 text-sm text-gray-500 dark:text-gray-400"
                >
                  No expense records available.
                </td>
              </tr>
            ) : (
              currentExpenses.map((expense) => {
                const rawDate = expense.date || expense.updated_at;
                const formattedDate = rawDate
                  ? new Date(rawDate).toLocaleDateString()
                  : "-";
                return (
                  <tr
                    key={expense.id}
                    onClick={() =>
                      navigate("/dashboard/add-expense", { state: { expense } })
                    }
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {expense.title}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {expense.category || "-"}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                      ৳{Number(expense.amount ?? 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {formattedDate}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {expense.createdBy?.name || "-"}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {expense.shop?.name || "-"}
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

export default ExpenseTable;
