import { motion } from "framer-motion";
import { Package, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const InventoryTableDetails = ({ items = [], loading = false }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const safeItems = Array.isArray(items) ? items : [];
  const filteredItems = safeItems.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      item?.name?.toLowerCase().includes(q) ||
      item?.itemCategory?.toLowerCase().includes(q) ||
      item?.code?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-8">
        Loading inventory...
      </p>
    );
  }

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl p-6 mb-10"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Items ({filteredItems.length})
        </h2>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search items..."
            className="w-full sm:w-64 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <Search
            className="absolute left-3 top-2.5 text-gray-400"
            size={18}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800/60">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredItems.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-8 text-sm text-gray-500 dark:text-gray-400"
                >
                  No matching items found.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const stock = Number(item?.stock ?? item?.initialStock ?? 0);
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white flex gap-3 items-center">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="size-9 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                        />
                      ) : (
                        <div className="size-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                          <Package size={18} />
                        </div>
                      )}
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {item.itemCategory || "Uncategorized"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        type="button"
                        onClick={() => navigate(`/dashboard/product/${item.id}`)}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default InventoryTableDetails;
