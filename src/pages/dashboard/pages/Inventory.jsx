import { motion } from "framer-motion";
import StatCard from "../../../components/dashBoard/home/common/StatCard";
import { Boxes, PackageCheck, PackageX, Plus } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../../contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InventoryTable from "../../../components/dashBoard/home/products/inventory/InventoryTable";

const ITEMS_PER_PAGE = 10;

const Inventory = () => {
  const { user, savedShop } = useUser();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);

  const { data: inventory = [], isLoading } = useQuery({
    queryKey: ["inventory", user?.id, selectedCategory],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      if (!token) throw new Error("No token found in cookies");

      const baseUrl = import.meta.env.VITE_BASE_URL;
      const endpoint = selectedCategory
        ? `${baseUrl}/products/category?shopId=${savedShop.id}&categories=${selectedCategory}`
        : `${baseUrl}/products?shopId=${savedShop.id}`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      return response.data.data;
    },
    enabled: !!user?.id,
  });
  // console.log(inventory);
  const totalItems = inventory.length;
  const inStockCount = inventory.filter((item) => item.initialStock > 0).length;
  const outOfStockCount = inventory.filter(
    (item) => item.initialStock <= 0
  ).length;

  // Filter and paginate
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedItems = filteredInventory.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const uniqueCategories = [
    ...new Set(
      inventory
        .map((item) => item.itemCategory)
        .filter((category) => category && category.trim() !== "")
    ),
  ];

  const totalPages = Math.ceil(filteredInventory.length / ITEMS_PER_PAGE);

  return (
    <div className="flex-1 overflow-auto relative z-10 mb-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Items"
            icon={Boxes}
            value={totalItems}
            color="#6366F1"
            onClick={() =>
              navigate("/dashboard/total-products", {
                state: { items: inventory },
              })
            }
          />
          <StatCard
            name="In Stock"
            icon={PackageCheck}
            value={inStockCount}
            color="#10B981"
            onClick={() =>
              navigate("/dashboard/products/in-stock", {
                state: { items: inventory },
              })
            }
          />
          <StatCard
            name="Out of Stock"
            icon={PackageX}
            value={outOfStockCount}
            color="#EF4444"
            onClick={() =>
              navigate("/dashboard/products/out-of-stock", {
                state: { items: inventory },
              })
            }
          />
        </motion.div>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="border rounded-md px-3 py-2 w-full sm:w-64 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="border rounded-md px-3 py-2 w-full sm:w-48 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((category, idx) => (
                <option key={idx} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard/product-add")}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:shadow-lg transition duration-300"
            >
              <Plus size={18} />
              <span className="font-medium">Add Product</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard/product-sell")}
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg transition duration-300"
            >
              <PackageCheck size={18} />
              <span className="font-medium">Sell Product</span>
            </motion.button>
          </div>
        </div>

        {/* Inventory Table */}
        <InventoryTable items={paginatedItems} loading={isLoading} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                onClick={() => setPage(idx + 1)}
                className={`px-3 py-1 rounded-md ${
                  page === idx + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Inventory;
