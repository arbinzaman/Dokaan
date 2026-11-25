import { Edit, Search, Trash2 } from "lucide-react";
import { useState } from "react";

const DokaanTable = ({ shops = [], loading, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const safeShops = Array.isArray(shops) ? shops.filter(Boolean) : [];

  const filteredShops = safeShops.filter((shop) => {
    const q = searchTerm.toLowerCase();
    const nameMatch = shop?.dokaan_name?.toLowerCase().includes(q);
    const locationMatch = shop?.dokaan_location?.toLowerCase().includes(q);
    return nameMatch || locationMatch;
  });

  if (loading) {
    return (
      <div className="py-8 text-center text-gray-500 dark:text-gray-400">
        Loading shops...
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl p-6 mb-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Dokaan List
        </h2>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search shops..."
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
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredShops.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-8 text-sm text-gray-500 dark:text-gray-400"
                >
                  No shops found.
                </td>
              </tr>
            ) : (
              filteredShops.map((shop, index) => (
                <tr
                  key={shop.id ?? index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {shop.dokaan_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {shop.dokaan_location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      type="button"
                      aria-label={`Edit ${shop.dokaan_name}`}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mr-3 p-1"
                      onClick={() => onEdit && onEdit(shop)}
                    >
                      <Edit size={18} />
                    </button>
                    {onDelete && (
                      <button
                        type="button"
                        aria-label={`Delete ${shop.dokaan_name}`}
                        className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 p-1"
                        onClick={() => onDelete(shop)}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DokaanTable;
