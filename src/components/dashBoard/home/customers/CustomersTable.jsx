import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import axios from "axios";
import { useUser } from "../../../../contexts/AuthContext";

const monthOptions = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

const CustomersTable = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const {savedShop} = useUser();
  

  const itemsPerPage = 5;

  const fetchCustomers = async () => {
    try {
      const params = {};
      if (year) params.year = year;
      if (month) params.month = month;
      if (day) params.day = day;

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/customers?shopId=${savedShop.id}`,
        { params }
      );

      const transformed = response.data.data.map((c) => {
        const totalPurchases = c.purchases?.reduce(
          (sum, p) => sum + p.purchaseCount,
          0
        );
        const shopCount = new Set(c.purchases?.map((p) => p.savedShopName)).size;

        return {
          ...c,
          totalPurchases,
          shopCount,
          isFavorite: c.favorite,
        };
      });

      setCustomers(transformed);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [year, month, day]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });
  }, [customers, searchTerm]);

  const paginated = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const getYears = () => {
    const years = new Set(
      customers.map((c) => new Date(c.createdAt).getFullYear())
    );
    return Array.from(years).sort();
  };
  console.log(customers);
  return (
    <motion.div
      className="bg-white dark:bg-black bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 mb-10 mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-black dark:text-white">
          Customers
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Year Dropdown */}
          <select
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded px-3 py-1"
          >
            <option value="">All Years</option>
            {getYears().map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* Month Dropdown */}
          <select
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded px-3 py-1"
          >
            <option value="">All Months</option>
            {monthOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* Day Dropdown */}
          <select
            value={day}
            onChange={(e) => {
              setDay(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded px-3 py-1"
          >
            <option value="">All Days</option>
            {[...Array(31)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search customers"
            className="bg-blue-400 dark:bg-gray-500 text-white placeholder-white rounded-lg pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            value={searchTerm}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              {[
                "Name",
                "Email",
                "Total Purchases",
                "Shops Visited",
                "Favorite",
              ].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-gray-500 dark:text-gray-400 py-8"
                >
                  No customers found.
                </td>
              </tr>
            ) : (
              paginated.map((customer) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td className="px-6 py-4 text-sm font-medium text-black dark:text-white">
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-black dark:text-white">
                    {customer.email || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-black dark:text-white">
                    {customer.totalPurchases}
                  </td>
                  <td className="px-6 py-4 text-sm text-black dark:text-white">
                    {customer.shopCount}
                  </td>
                  <td className="px-6 py-4 text-sm text-yellow-400">
                    {customer.isFavorite && <Star fill="yellow" size={18} />}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredCustomers.length > itemsPerPage && (
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className={`px-2 rounded-md ${
              currentPage === 1
                ? "bg-gray-300 text-gray-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>
          <span className="text-black dark:text-white font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default CustomersTable;
