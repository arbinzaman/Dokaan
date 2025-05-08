import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../../../contexts/AuthContext";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const fetchSalesData = async ({ queryKey }) => {
  const [, shopId, year, month, day] = queryKey;
  const token = Cookies.get("XTOKEN");

  const params = new URLSearchParams();
  if (shopId) params.append("shopId", shopId);
  if (year) params.append("year", year);
  if (month) params.append("month", month);
  if (day) params.append("day", day);

  const res = await fetch(
    `${import.meta.env.VITE_BASE_URL}/sales?${params.toString()}`,
    {
      headers: {
        Authorization: token,
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch sales");
  console.log(res);
  const response = await res.json();
  return Array.isArray(response.filteredSales) ? response.filteredSales : [];
};

const SalesTable = () => {
  const { dokaan } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  const {
    data: sales = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sales", dokaan?.id, year, month, day],
    queryFn: fetchSalesData,
    enabled: !!dokaan?.id,
  });

  console.log(sales);
  const filteredSales = sales.filter((sale) => {
    const term = searchTerm.toLowerCase();

    const name = sale.name ? sale.name.toLowerCase() : "";
    const itemCategory = sale.itemCategory
      ? sale.itemCategory.toLowerCase()
      : "";
    const code = sale.code ? sale.code.toLowerCase() : "";

    return (
      name.includes(term) || itemCategory.includes(term) || code.includes(term)
    );
  });

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
          Sales List
        </h2>
        <div className="flex gap-3 flex-wrap items-center">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="p-2 rounded"
          >
            <option value="">All Years</option>
            {renderOptions(["2023", "2024", "2025"])}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="p-2 rounded"
          >
            <option value="">All Months</option>
            {renderOptions([
              "jan",
              "feb",
              "march",
              "april",
              "may",
              "june",
              "july",
              "aug",
              "sep",
              "oct",
              "nov",
              "dec",
            ])}
          </select>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="p-2 rounded"
          >
            <option value="">All Days</option>
            {renderOptions(
              [...Array(31).keys()].map((d) =>
                (d + 1).toString().padStart(2, "0")
              )
            )}
          </select>
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="bg-blue-400 dark:bg-gray-400 text-white placeholder-white rounded-lg pl-10 pr-4 py-2 focus:outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
            <Search
              className="absolute left-3 top-2.5 text-black dark:text-white"
              size={18}
            />
          </div>
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
              ].map((h) => (
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
                <td colSpan={9} className="text-center py-8 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-red-500">
                  Error loading sales
                </td>
              </tr>
            ) : filteredSales.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-gray-500">
                  No sales records available.
                  <div className="mt-4">
                    <Link to="/dashboard/product-add">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
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
                  <td className="px-6 py-4 text-sm text-black dark:text-white">
                    {sale.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-black dark:text-white">
                    {sale.itemCategory || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-black dark:text-white">
                    ৳ {sale.salesPrice?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-black dark:text-white">
                    {sale.quantity}
                  </td>
                  <td className="px-6 py-4 text-sm text-black dark:text-white">
                    ৳ {sale.totalPrice?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-black dark:text-white">
                    {sale.code}
                  </td>
                  <td className="px-6 py-4 text-sm text-black dark:text-white">
                    {sale.soldAt ? new Date(sale.soldAt).toLocaleString() : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-black dark:text-white">
                    {sale.seller?.name || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-black dark:text-white">
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
