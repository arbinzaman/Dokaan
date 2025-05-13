import { motion } from "framer-motion";
import axios from "axios";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
// import Header from "../../../components/dashBoard/home/common/Header";
import StatCard from "../../../components/dashBoard/home/common/StatCard";
import { CreditCard, ShoppingCart, TrendingUp } from "lucide-react";
import SalesByCategoryChart from "../../../components/dashBoard/home/sales/SalesByCategoryChart";
import DailySalesTrend from "../../../components/dashBoard/home/sales/DailySalesTrend";
import { useUser } from "../../../contexts/AuthContext";
import SalesTrendChart from "../../../components/dashBoard/home/products/SalesTrendChart";
import CategoryDistributionChart from "../../../components/dashBoard/home/overview/CategoryDistributionChart";
import SalesTable from "../../../components/dashBoard/home/sales/SalesTable";

const salesStats = {
  totalRevenue: "$1,234,567",
  averageOrderValue: "$78.90",
  conversionRate: "3.45%",
  salesGrowth: "12.3%",
};
const ACCENT_COLOR = "rgb(204, 51, 51)";
const SalesPage = () => {
  const { dokaan } = useUser();

  // Fetch total revenue
  const { data: revenueData = {}, isLoading: revenueLoading } = useQuery({
    queryKey: ["totalRevenue", dokaan?.id],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");

      if (!token) {
        throw new Error("No token found in cookies");
      }

      const shopId = Number(dokaan?.id);
      if (isNaN(shopId)) {
        throw new Error("Invalid shop ID");
      }

      const response = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/sales/total-revenue/?shopId=${shopId}`,
        {
          headers: {
            Authorization: `${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          params: { shopId },
        }
      );

      return response.data;
    },
    enabled: !!dokaan?.id,
  });

  const totalRevenue = revenueData?.totalRevenue || 0;

  return (
    <div className="flex-1 overflow-auto relative z-10">
      {/* <Header title='Sales Dashboard' /> */}

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* SALES STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Profit"
            icon={FaBangladeshiTakaSign} // Swap to Rupee or Taka-looking icon
            value={revenueLoading ? "..." : `৳${totalRevenue.toLocaleString()}`}
            color="#EF4444"
          />
          <StatCard
            name="Avg. Order Value"
            icon={ShoppingCart}
            value={salesStats.averageOrderValue}
            color="#10B981"
          />
          <StatCard
            name="Conversion Rate"
            icon={TrendingUp}
            value={salesStats.conversionRate}
            color="#F59E0B"
          />
          <StatCard
            name="Sales Growth"
            icon={CreditCard}
            value={salesStats.salesGrowth}
            color="#EF4444"
          />
        </motion.div>
        <SalesTable />
        {/* <SalesOverviewChart /> */}
        <SalesTrendChart />

        <div className=" mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SalesByCategoryChart />
          <CategoryDistributionChart accentColor={ACCENT_COLOR} />
          <DailySalesTrend />
        </div>
      </main>
    </div>
  );
};
export default SalesPage;
