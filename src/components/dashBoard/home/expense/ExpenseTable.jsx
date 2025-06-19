import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../../../contexts/AuthContext";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const fetchExpensesData = async ({ queryKey }) => {
  const [, shopId, year, month, day] = queryKey;
  const token = Cookies.get("XTOKEN");

  const params = new URLSearchParams();
  if (shopId) params.append("shopId", shopId);
  if (year) params.append("year", year);
  if (month) params.append("month", month);
  if (day) params.append("day", day);

  const res = await fetch(
    `${import.meta.env.VITE_BASE_URL}/expenses/shop?${params.toString()}`,
    {
      headers: {
        Authorization: token,
        Accept: "application/json",
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch expenses");

  const response = await res.json();
  return Array.isArray(response.data) ? response.data : [];
};

const ExpenseTable = () => {
  const { savedShop } = useUser();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
      expense.title?.toLowerCase().includes(term) ||
      expense.category?.toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, year, month, day]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExpenses = filteredExpenses.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const renderOptions = (options) =>
    options.map((opt) => (
      <option key={opt} value={opt}>
        {opt}
      </option>
    ));

  return (
    <motion.div
      className="bg-white dark:bg-black bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-black dark:text-white">
          Expense List
        </h2>
        <div className="flex gap-3 flex-wrap items-center">
          <select value={year} onChange={(e) => setYear(e.target.value)} className="p-2 rounded">
            <option value="">All Years</option>
            {renderOptions(["2023", "2024", "2025"])}
          </select>
          <select value={month} onChange={(e) => setMonth(e.target.value)} className="p-2 rounded">
            <option value="">All Months</option>
            {renderOptions([
              "jan", "feb", "march", "april", "may", "june",
              "july", "aug", "sep", "oct", "nov", "dec",
            ])}
          </select>
          <select value={day} onChange={(e) => setDay(e.target.value)} className="p-2 rounded">
            <option value="">All Days</option>
            {renderOptions([...Array(31).keys()].map((d) => (d + 1).toString().padStart(2, "0")))}
          </select>
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="bg-blue-400 dark:bg-gray-400 text-white placeholder-white rounded-lg pl-10 pr-4 py-2 focus:outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
            <Search className="absolute left-3 top-2.5 text-black dark:text-white" size={18} />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              {["Title", "Category", "Amount", "Date", "Added By", "Shop"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium text-black dark:text-white uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-red-500">
                  Error loading expenses
                </td>
              </tr>
            ) : currentExpenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No expense records available.
                </td>
              </tr>
            ) : (
              currentExpenses.map((expense) => (
                <motion.tr
                  key={expense.id}
                  onClick={() => navigate("/dashboard/add-expense", { state: { expense } })}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
                >
                  <td className="px-6 py-4 text-sm text-black dark:text-white">{expense.title}</td>
                  <td className="px-6 py-4 text-sm text-black dark:text-white">{expense.category || "-"}</td>
                  <td className="px-6 py-4 text-sm text-black dark:text-white">৳ {expense.amount?.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-black dark:text-white">
                    {expense.updated_at ? new Date(expense.updated_at).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-black dark:text-white">{expense.createdBy?.name || "-"}</td>
                  <td className="px-6 py-4 text-sm text-black dark:text-white">{expense.shop?.name || "-"}</td>
                </motion.tr>
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

export default ExpenseTable;
