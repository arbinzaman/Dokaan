import { motion } from "framer-motion";
import { Star, Search } from "lucide-react";
import { useState } from "react";

const CustomersTable = ({ customers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredCustomers = customers?.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginated = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <motion.div
      className="bg-white dark:bg-black bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-black dark:text-white">
          Customers
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search customers"
            className="bg-blue-400 dark:bg-gray-500 text-white placeholder-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-black dark:text-white" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              {["Name", "Email", "Total Purchases", "Shops Visited", "Favorite"].map((h) => (
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
                <td colSpan={5} className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No customers found.
                </td>
              </tr>
            ) : (
              paginated.map((customer) => (
                <motion.tr key={customer.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
