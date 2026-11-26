import { motion } from "framer-motion";
import StatCard from "../../../components/dashBoard/home/common/StatCard";
import { Boxes, PackageCheck, PackageX, Plus } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../../contexts/AuthContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import InventoryTable from "../../../components/dashBoard/home/products/inventory/InventoryTable";

const ITEMS_PER_PAGE = 10;

const getStock = (item) => Number(item?.stock ?? item?.initialStock ?? 0);

const Inventory = () => {
  const { savedShop } = useUser();
  const { pick } = useLanguage();
  const navigate = useNavigate();
  const shopId = savedShop?.id;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);

  const {
    data: allInventory = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["inventory", shopId],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const response = await axios.get(`${baseUrl}/products`, {
        params: { shopId },
        headers: {
          ...(token ? { Authorization: `${token}` } : {}),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      return Array.isArray(response.data?.data) ? response.data.data : [];
    },
    enabled: !!shopId,
  });

  const safeInventory = useMemo(
    () => (Array.isArray(allInventory) ? allInventory : []),
    [allInventory]
  );

  const totalItems = safeInventory.length;
  const inStockCount = safeInventory.filter((item) => getStock(item) > 0).length;
  const outOfStockCount = safeInventory.filter(
    (item) => getStock(item) <= 0
  ).length;

  const uniqueCategories = useMemo(
    () => [
      ...new Set(
        safeInventory
          .map((item) => item?.itemCategory)
          .filter((category) => category && category.trim() !== "")
      ),
    ],
    [safeInventory]
  );

  const filteredInventory = safeInventory.filter((item) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      item?.name?.toLowerCase().includes(q) ||
      item?.code?.toLowerCase().includes(q);
    const matchesCategory =
      !selectedCategory || item?.itemCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInventory.length / ITEMS_PER_PAGE)
  );
  const safePage = Math.min(page, totalPages);
  const paginatedItems = filteredInventory.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex-1 overflow-auto relative z-10 mb-10">
      <main className="max-w-7xl mx-auto py-4 px-2 sm:px-4 lg:px-6">
        <div className="mb-5">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {pick("Inventory & Stock", "স্টক ও ইনভেন্টরি")}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {pick(
              "Tap any card below to filter items, restock products, or start selling.",
              "নিচের কার্ডে ট্যাপ করে স্টক দেখুন, পণ্য যোগ করুন অথবা বিক্রি শুরু করুন।"
            )}
          </p>
        </div>

        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-3.5 sm:gap-5 sm:grid-cols-3 mb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <StatCard
            name={pick("Total Items", "মোট পণ্য")}
            icon={Boxes}
            value={isLoading ? "..." : totalItems}
            subtext={pick("Tap to view all", "সব পণ্য দেখুন")}
            color="#DC2626"
            onClick={() =>
              navigate("/dashboard/total-products", {
                state: { items: safeInventory },
              })
            }
          />
          <StatCard
            name={pick("In Stock", "স্টকে আছে")}
            icon={PackageCheck}
            value={isLoading ? "..." : inStockCount}
            subtext={pick("Ready to sell", "বিক্রির জন্য প্রস্তুত")}
            color="#10B981"
            onClick={() =>
              navigate("/dashboard/products/in-stock", {
                state: { items: safeInventory },
              })
            }
          />
          <StatCard
            name={pick("Out of Stock", "স্টক শেষ")}
            icon={PackageX}
            value={isLoading ? "..." : outOfStockCount}
            subtext={pick("Needs restocking", "পুনরায় স্টক করুন")}
            color="#EF4444"
            onClick={() =>
              navigate("/dashboard/products/out-of-stock", {
                state: { items: safeInventory },
              })
            }
          />
        </motion.div>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 mb-6">
          <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
            <input
              type="text"
              placeholder={pick("Search name or barcode...", "পণ্যের নাম বা বারকোড খুঁজুন...")}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm w-full sm:w-64 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm w-full sm:w-48 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">{pick("All Categories", "সব ক্যাটাগরি")}</option>
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 sm:flex gap-2.5">
            <button
              type="button"
              onClick={() => navigate("/dashboard/product-add")}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-colors"
            >
              <Plus size={16} />
              {pick("Add Product", "পণ্য যোগ")}
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard/product-sell")}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition-colors"
            >
              <PackageCheck size={16} />
              {pick("Sell Product", "পণ্য বিক্রি")}
            </button>
          </div>
        </div>

        {isError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-sm text-red-600 dark:text-red-400">
            Failed to load inventory: {error?.message || "Please try again."}
          </div>
        )}

        {/* Inventory Table */}
        <InventoryTable items={paginatedItems} loading={isLoading} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 gap-3">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3.5 py-1.5 text-sm font-medium rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              Page {safePage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3.5 py-1.5 text-sm font-medium rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Inventory;
