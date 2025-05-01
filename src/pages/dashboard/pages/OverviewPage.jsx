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

const ACCENT_COLOR = "rgb(204, 51, 51)";

const OverviewPage = () => {
   const {  dokaan } = useUser(); // Get user details from context
  const { data, isError } = useQuery({
    queryKey: ["totalSales"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/sales/total`
      );
      return response.data;
    },
  });

  const { data: productData, isError: isProductError } = useQuery({
    queryKey: ["totalProducts"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/products/total-products`
      );
      return response.data;
    },
  });

  const formattedSales = data?.totalSales
    ? `৳${data.totalSales.toLocaleString()}`
    : isError
    ? "Error"
    : "৳0";

  const formattedProducts = productData?.data
    ? productData.data
    : isProductError
    ? "Error"
    : "0";
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
        `${import.meta.env.VITE_BASE_URL}/sales/total-revenue`,
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
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Sales"
            icon={Zap}
            value={formattedSales}
            color={ACCENT_COLOR}
          />
          <StatCard
            name="Total Products"
            icon={ShoppingBag}
            value={formattedProducts}
            color={ACCENT_COLOR}
          />
          <StatCard
            name="Total Revenue"
            icon={FaBangladeshiTakaSign} // Swap to Rupee or Taka-looking icon
            value={revenueLoading ? "..." : `৳${totalRevenue.toLocaleString()}`}
            color="#EF4444"
          />
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalesTrendChart accentColor={ACCENT_COLOR} />
          <CategoryDistributionChart accentColor={ACCENT_COLOR} />
          <SalesChannelChart accentColor={ACCENT_COLOR} />
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
