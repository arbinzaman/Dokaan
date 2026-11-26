import { motion } from "framer-motion";
import StatCard from "../../../components/dashBoard/home/common/StatCard";
import { AlertTriangle, Package, Plus, TrendingUp } from "lucide-react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import CategoryDistributionChart from "../../../components/dashBoard/home/overview/CategoryDistributionChart";
import SalesTrendChart from "../../../components/dashBoard/home/products/SalesTrendChart";
import ProductsTable from "../../../components/dashBoard/home/products/ProductsTable";
import axios from "axios";
import Cookies from "js-cookie";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../../../contexts/AuthContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import ProductPerformance from "../../../components/dashBoard/home/analytics/ProductPerformance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProductsPage = () => {
  const { savedShop } = useUser();
  const { pick } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const shopId = savedShop?.id;

  // Fetch all products
  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
    error: productsErrorMsg,
  } = useQuery({
    queryKey: ["products", shopId],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/products`,
        {
          params: { shopId },
          headers: {
            ...(token ? { Authorization: `${token}` } : {}),
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      return Array.isArray(response.data?.data) ? response.data.data : [];
    },
    enabled: !!shopId,
  });

  // Fetch top selling products count
  const { data: topSellingData = {}, isLoading: topSellingLoading } = useQuery({
    queryKey: ["topSellingProducts", shopId],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/sales/top-selling`,
        {
          params: { shopId },
          headers: {
            ...(token ? { Authorization: `${token}` } : {}),
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      return response.data ?? {};
    },
    enabled: !!shopId,
  });

  // Fetch low stock products count
  const { data: lowStockData = {}, isLoading: lowStockLoading } = useQuery({
    queryKey: ["lowStockProducts", shopId],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/sales/products/low-stock`,
        {
          headers: {
            ...(token ? { Authorization: `${token}` } : {}),
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          params: { shopId: Number(shopId) },
        }
      );
      return response.data ?? {};
    },
    enabled: !!shopId,
  });

  // Fetch total revenue
  const { data: revenueData = {}, isLoading: revenueLoading } = useQuery({
    queryKey: ["totalRevenue", shopId],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/sales/total-revenue`,
        {
          headers: {
            ...(token ? { Authorization: `${token}` } : {}),
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          params: { shopId: Number(shopId) },
        }
      );
      return response.data ?? {};
    },
    enabled: !!shopId,
  });

  const handleEditProduct = (product) => {
    navigate("/dashboard/product-add", { state: { product } });
  };

  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const token = Cookies.get("XTOKEN");
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/products/${product.id}`,
        {
          headers: token ? { Authorization: token } : undefined,
        }
      );
      toast.success("Product deleted.");
      queryClient.invalidateQueries({ queryKey: ["products", shopId] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["totalProducts", shopId] });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete product.");
    }
  };

  const safeProducts = Array.isArray(products) ? products : [];
  const productCount = safeProducts.length;
  const totalRevenue = Number(revenueData?.totalRevenue ?? 0);
  const topSellingCount = Number(topSellingData?.totalTopSellingProducts ?? 0);
  const lowStockCount = Number(lowStockData?.totalLowStockProducts ?? 0);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-4 px-2 sm:px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {pick("Products", "পণ্য তালিকা")}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {pick(
                "View all items, edit prices or stock, and see top sellers.",
                "সব পণ্যের দাম ও স্টক দেখুন, সহজে পরিবর্তন করুন।"
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/dashboard/product-add")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <Plus size={16} />
            {pick("Add Product", "নতুন পণ্য যোগ করুন")}
          </button>
        </div>

        {/* STATS */}
        <motion.div
          className="grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-4 mb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <StatCard
            name={pick("Total Products", "মোট পণ্য")}
            icon={Package}
            value={productsLoading ? "..." : productCount}
            color="#DC2626"
          />
          <StatCard
            name={pick("Top Selling", "বেশি বিক্রি")}
            icon={TrendingUp}
            value={topSellingLoading ? "..." : topSellingCount}
            color="#10B981"
          />
          <StatCard
            name={pick("Low Stock", "স্টক কম")}
            icon={AlertTriangle}
            value={lowStockLoading ? "..." : lowStockCount}
            color="#F59E0B"
          />
          <StatCard
            name={pick("Total Revenue", "মোট আয়")}
            icon={FaBangladeshiTakaSign}
            value={revenueLoading ? "..." : `৳${totalRevenue.toLocaleString()}`}
            color="#EF4444"
          />
        </motion.div>

        <ProductPerformance />

        {productsError && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-sm text-red-600 dark:text-red-400">
            Error loading products: {productsErrorMsg?.message || "Unknown error"}
          </div>
        )}

        <ProductsTable
          products={safeProducts}
          loading={productsLoading}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesTrendChart />
          <CategoryDistributionChart />
        </div>
      </main>
    </div>
  );
};

export default ProductsPage;
