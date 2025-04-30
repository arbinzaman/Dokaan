import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const InventoryTableDetails = ({ items, loading }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = items
    ? items.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.itemCategory?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (loading) return <p className="text-center text-gray-500">Loading inventory...</p>;

  return (
    <motion.div
      className="bg-white dark:bg-black bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-black dark:text-white">Inventory</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="bg-red-400 dark:bg-gray-400 text-white placeholder-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-black dark:text-white" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredItems.map((item) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black dark:text-white flex gap-2 items-center">
                  <img
                    src={item.imageUrl || "/placeholder.png"}
                    alt={item.name}
                    className="size-10 rounded-full border"
                  />
                  {item.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white">
                  {item.itemCategory || "No category"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white">
                  {item.initialStock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => navigate(`/dashboard/product/${item.id}`)}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default InventoryTableDetails;
