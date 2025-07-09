import { Edit, Search, Trash2 } from "lucide-react";
import { useState } from "react";

const DokaanTable = ({ shops = [], loading, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState("");
console.log(shops);
  const filteredShops = shops.filter((shop) => {
    const nameMatch = shop.dokaan_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const locationMatch = shop.dokaan_location
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    return nameMatch || locationMatch;
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white dark:bg-black bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 mb-10 mt-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-black dark:text-white">
          Dokaan List
        </h2>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search"
            className="w-full sm:w-64 bg-red-400 dark:bg-gray-400 text-white placeholder-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <Search
            className="absolute left-3 top-2.5 text-black dark:text-white"
            size={18}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredShops.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8 text-gray-500 dark:text-gray-400"
                >
                  No shops found.
                </td>
              </tr>
            ) : (
              filteredShops.map((shop, index) => (
                <tr key={shop.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-black dark:text-white">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-black dark:text-white">
                    {shop.dokaan_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-black dark:text-white">
                    {shop.dokaan_location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      className="text-indigo-400 hover:text-indigo-300 mr-2"
                      onClick={() => onEdit(shop)}
                    >
                      <Edit size={18} />
                    </button>
                    <button className="text-red-400 hover:text-red-300">
                      <Trash2 size={18} />
                    </button>
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
