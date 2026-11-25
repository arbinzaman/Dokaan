import { ShoppingBag, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import StatCard from "../../../components/dashBoard/home/common/StatCard";
import CategoryDistributionChart from "../../../components/dashBoard/home/overview/CategoryDistributionChart";
import SalesChannelChart from "../../../components/dashBoard/home/overview/SalesChannelChart";
import { useUser } from "../../../contexts/AuthContext";
import SalesTrendChart from "../../../components/dashBoard/home/products/SalesTrendChart";

const OverviewPage = () => {
  const { savedShop } = useUser();
  const shopId = savedShop?.id;

  // Fetch total sales
  const {
    data: salesTotalData,
    isLoading: salesLoading,
    isError: salesError,
  } = useQuery({
    queryKey: ["totalSales", shopId],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/sales/total`,
        {
          params: { shopId },
          headers: token ? { Authorization: token } : undefined,
        }
      );
      return response.data ?? {};
    },
    enabled: !!shopId,
  });

  // Fetch total products
  const {
    data: productData,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: ["totalProducts", shopId],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/products/total-products`,
        {
          params: { shopId },
          headers: token ? { Authorization: token } : undefined,
        }
      );
      return response.data ?? {};
    },
    enabled: !!shopId,
  });

  // Fetch total revenue
  const {
    data: revenueData = {},
    isLoading: revenueLoading,
    isError: revenueError,
  } = useQuery({
    queryKey: ["totalRevenue", shopId],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/sales/total-revenue`,
        {
          headers: {
            ...(token ? { Authorization: token } : {}),
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

  const matchedShopSales =
    salesTotalData && String(salesTotalData.shopId) === String(shopId)
      ? salesTotalData
      : salesTotalData;

  const formattedSales = salesLoading
    ? "..."
    : salesError
    ? "—"
    : Number(matchedShopSales?.totalSales ?? 0).toLocaleString();

  const matchedShopProduct = Array.isArray(productData?.data)
    ? productData.data.find((item) => String(item.shopId) === String(shopId))
    : null;

  const formattedProducts = productsLoading
    ? "..."
    : productsError
    ? "—"
    : Number(matchedShopProduct?.totalProducts ?? 0).toLocaleString();

  const totalRevenue = Number(revenueData?.totalRevenue ?? 0);
  const formattedRevenue = revenueLoading
    ? "..."
    : revenueError
    ? "—"
    : `৳${totalRevenue.toLocaleString()}`;

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-4 px-2 sm:px-4 lg:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          {savedShop?.dokaan_name && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {savedShop.dokaan_name}
              {savedShop.dokaan_location ? ` — ${savedShop.dokaan_location}` : ""}
            </p>
          )}
        </div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <StatCard
            name="Total Sales Count"
            icon={Zap}
            value={formattedSales}
            color="#6366F1"
          />
          <StatCard
            name="Total Products"
            icon={ShoppingBag}
            value={formattedProducts}
            color="#8B5CF6"
          />
          <StatCard
            name="Total Revenue"
            icon={FaBangladeshiTakaSign}
            value={formattedRevenue}
            color="#10B981"
          />
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <SalesTrendChart />
          </div>
          <CategoryDistributionChart />
          <SalesChannelChart />
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
