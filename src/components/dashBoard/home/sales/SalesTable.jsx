import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../../../contexts/AuthContext";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import Cookies from "js-cookie"; // Import Cookies to get the token

// Fetch function
const fetchSalesData = async (shopId) => {
  const token = Cookies.get("XTOKEN"); // Get token from cookies
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/sales?shopId=${shopId}`, {
    headers: {
      Authorization: `${token}`, // Include the token in the Authorization header
      Accept: "application/json", 
    },
  });
  if (!response.ok) {
    throw new Error("Error fetching sales data");
  }
  return response.json();
};

const SalesTable = () => {
  const { dokaan } = useUser(); // Get user details from context
  const [searchTerm, setSearchTerm] = useState("");

  const { data: sales, error, isLoading } = useQuery({
    queryKey: ["sales", dokaan.id],
    queryFn: () => fetchSalesData(dokaan.id),
    enabled: !!dokaan.id, // Make sure shopId is available before making the request
  });

  const filteredSales = sales
    ? sales.filter(
        (sale) =>
          sale.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (sale.itemCategory &&
            sale.itemCategory.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (sale.code &&
            sale.code.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  if (isLoading) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        Loading sales data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 dark:text-red-400 py-8">
        Failed to load sales data. Please try again later.
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white dark:bg-black bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-black dark:text-white">
          Sales List
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="bg-blue-400 dark:bg-gray-400 text-white placeholder-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              {[
                "Name",
                "Category",
                "Price",
                "Quantity",
                "Total",
                "Code",
                "Sold At",
                "Seller",
                "Shop",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredSales.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No sales records available.
                  <div className="mt-4">
                    <Link to="/dashboard/product-add">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                        Add Product
                      </button>
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              filteredSales.map((sale) => (
                <motion.tr
                  key={sale.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white">
                    {sale.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white">
                    {sale.itemCategory || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white">
                    ৳ {sale.salesPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white">
                    {sale.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white">
                    ৳ {sale.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white">
                    {sale.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white">
                    {new Date(sale.soldAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white">
                    {sale.seller?.name || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white">
                    {sale.shop?.name || "-"}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default SalesTable;
