import { motion } from "framer-motion";
import axios from "axios";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import StatCard from "../../../components/dashBoard/home/common/StatCard";
import {
  CreditCard,
  ShoppingCart,
  // TrendingUp
} from "lucide-react";
// import SalesByCategoryChart from "../../../components/dashBoard/home/sales/SalesByCategoryChart";
import DailySalesTrend from "../../../components/dashBoard/home/sales/DailySalesTrend";
import { useUser } from "../../../contexts/AuthContext";
import SalesTrendChart from "../../../components/dashBoard/home/products/SalesTrendChart";
import CategoryDistributionChart from "../../../components/dashBoard/home/overview/CategoryDistributionChart";
import SalesTable from "../../../components/dashBoard/home/sales/SalesTable";
import SalesChannelChart from "../../../components/dashBoard/home/overview/SalesChannelChart";

const ACCENT_COLOR = "rgb(204, 51, 51)";

const SalesPage = () => {
  const { dokaan } = useUser();

  const fetchSalesData = async () => {
    const token = Cookies.get("XTOKEN");
    if (!token) throw new Error("No token found");
    const shopId = Number(dokaan?.id);
    if (isNaN(shopId)) throw new Error("Invalid shop ID");

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/sales/total-revenue?shopId=${shopId}`,
      {
        headers: {
          Authorization: `${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // expected: { totalRevenue: number, salesGrowth: string }
  };

  const fetchTotalSalesCount = async () => {
    const token = Cookies.get("XTOKEN");
    if (!token) throw new Error("No token found");
    const shopId = Number(dokaan?.id);
    if (isNaN(shopId)) throw new Error("Invalid shop ID");

    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL
      }/sales/total-sales-count?shopId=${shopId}`,
      {
        headers: {
          Authorization: `${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // expected: { totalSales: number, date: string }
  };

  const {
    data: salesData = { totalRevenue: 0, salesGrowth: "0.0%" },
    isLoading: salesDataLoading,
    isError: salesDataError,
    error: salesDataErrorObj,
  } = useQuery({
    queryKey: ["salesData", dokaan?.id],
    queryFn: fetchSalesData,
    enabled: !!dokaan?.id,
  });

  const {
    data: totalSalesData = { totalSales: 0, date: "" },
    isLoading: totalSalesLoading,
    isError: totalSalesError,
    error: totalSalesErrorObj,
  } = useQuery({
    queryKey: ["totalSalesCount", dokaan?.id],
    queryFn: fetchTotalSalesCount,
    enabled: !!dokaan?.id,
  });

  if (salesDataError)
    return (
      <div className="text-red-500 text-center p-4">
        Error loading sales data: {salesDataErrorObj?.message}
      </div>
    );

  if (totalSalesError)
    return (
      <div className="text-red-500 text-center p-4">
        Error loading total sales count: {totalSalesErrorObj?.message}
      </div>
    );

  return (
    <div className="flex-1 overflow-auto relative z-10">
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
            icon={FaBangladeshiTakaSign}
            value={
              salesDataLoading ? "..." : salesData.totalRevenue.toLocaleString()
            }
            color="#EF4444"
          />
          <StatCard
            name="Total Sales Count"
            icon={ShoppingCart}
            value={
              totalSalesLoading
                ? "..."
                : totalSalesData.totalSales.toLocaleString()
            }
            subtext={totalSalesData.date}
            color="#10B981"
          />

          {/* Changed this card
          <StatCard
            name="Total Revenue"
            icon={FaBangladeshiTakaSign}
            value={
              salesDataLoading ? "..." : salesData.totalRevenue.toLocaleString()
            }
            color="#3B82F6" // blue neon or your choice
          /> */}

          <StatCard
            name="Sales Growth"
            icon={CreditCard}
            value={salesDataLoading ? "..." : salesData.salesGrowth}
            color=""
          />
        </motion.div>

        <SalesTable />
        <SalesTrendChart />

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* <SalesByCategoryChart /> */}
          <CategoryDistributionChart accentColor={ACCENT_COLOR} />
          <SalesChannelChart/>
          <DailySalesTrend />
        </div>
      </main>
    </div>
  );
};

export default SalesPage;
