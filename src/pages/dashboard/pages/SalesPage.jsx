import { motion } from "framer-motion";
import axios from "axios";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import StatCard from "../../../components/dashBoard/home/common/StatCard";
import { CreditCard, Plus, ShoppingCart } from "lucide-react";
import DailySalesTrend from "../../../components/dashBoard/home/sales/DailySalesTrend";
import { useUser } from "../../../contexts/AuthContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import SalesTrendChart from "../../../components/dashBoard/home/products/SalesTrendChart";
import CategoryDistributionChart from "../../../components/dashBoard/home/overview/CategoryDistributionChart";
import SalesTable from "../../../components/dashBoard/home/sales/SalesTable";
import SalesChannelChart from "../../../components/dashBoard/home/overview/SalesChannelChart";
import { useNavigate } from "react-router-dom";

const SalesPage = () => {
  const { savedShop } = useUser();
  const { pick } = useLanguage();
  const navigate = useNavigate();
  const shopId = savedShop?.id;

  const {
    data: salesData = {},
    isLoading: salesDataLoading,
    isError: salesDataError,
  } = useQuery({
    queryKey: ["salesData", shopId],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/sales/total-revenue`,
        {
          params: { shopId: Number(shopId) },
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

  const {
    data: totalSalesData = {},
    isLoading: totalSalesLoading,
    isError: totalSalesError,
  } = useQuery({
    queryKey: ["totalSalesCount", shopId],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/sales/total-sales-count`,
        {
          params: { shopId: Number(shopId) },
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

  const totalRevenue = Number(salesData?.totalRevenue ?? 0);
  const totalSales = Number(totalSalesData?.totalSales ?? 0);
  const salesGrowth = salesData?.salesGrowth ?? "0.0%";

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-4 px-2 sm:px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {pick("Sales", "বিক্রয় হিসাব")}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {pick(
                "Review daily sales, growth trends, and start new bills fast.",
                "প্রতিদিনের বিক্রি ও আয়ের হিসাব দেখুন, নতুন বিল তৈরি করুন।"
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/dashboard/product-sell")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <Plus size={16} />
            {pick("New Sale (POS)", "নতুন বিক্রি (POS)")}
          </button>
        </div>

        {/* SALES STATS */}
        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <StatCard
            name={pick("Total Revenue", "মোট আয়")}
            icon={FaBangladeshiTakaSign}
            value={
              salesDataLoading
                ? "..."
                : salesDataError
                ? "—"
                : `৳${totalRevenue.toLocaleString()}`
            }
            color="#DC2626"
          />
          <StatCard
            name={pick("Total Sales Count", "মোট বিক্রয় সংখ্যা")}
            icon={ShoppingCart}
            value={
              totalSalesLoading
                ? "..."
                : totalSalesError
                ? "—"
                : totalSales.toLocaleString()
            }
            subtext={totalSalesData?.date || undefined}
            color="#10B981"
          />
          <StatCard
            name={pick("Sales Growth", "বিক্রয় প্রবৃদ্ধি")}
            icon={CreditCard}
            value={salesDataLoading ? "..." : salesDataError ? "—" : salesGrowth}
            color="#F59E0B"
          />
        </motion.div>

        <SalesTable />

        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SalesTrendChart />
            <DailySalesTrend />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <CategoryDistributionChart />
            <SalesChannelChart />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SalesPage;
