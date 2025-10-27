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
  const { savedShop} = useUser(); // Get user details from context
// console.log(savedShop);
  // Fetch total sales
  const { data, isError } = useQuery({
    queryKey: ["totalSales"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/sales/total?shopId=${savedShop.id}`
      );
      return response.data;
    },
  });

  const matchedShopSales =
    data && String(data.shopId) === String(savedShop?.id) ? data : null;

  // Fetch total products
  const { data: productData } = useQuery({
    queryKey: ["totalProducts"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/products/total-products`
      );
      return response.data;
    },
  });

  const formattedSales = isError
    ? "Error"
    : `৳${(matchedShopSales?.totalSales ?? 0).toLocaleString()}`;

  const matchedShopProduct = productData?.data?.find(
    (item) => String(item.shopId) === String(savedShop?.id)
  );

  const formattedProducts = isError
    ? "Error"
    : matchedShopProduct?.totalProducts ?? 0;

  // Fetch total revenue
  const { data: revenueData = {}, isLoading: revenueLoading } = useQuery({
    queryKey: ["totalRevenue", savedShop?.id],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");

      if (!token) {
        throw new Error("No token found in cookies");
      }

      const shopId = Number(savedShop?.id);
      if (isNaN(shopId)) {
        throw new Error("Invalid shop ID");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/sales/total-revenue?${shopId}`,
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
    enabled: !!savedShop?.id,
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
            color="#00FFFF" // Vibrant Cyan
          />
          <StatCard
            name="Total Products"
            icon={ShoppingBag}
            value={formattedProducts}
            color="#FF00FF" // Neon Pink
          />
          <StatCard
            name="Total Profit"
            icon={FaBangladeshiTakaSign}
            value={revenueLoading ? "..." : `৳${totalRevenue.toLocaleString()}`}
            color="#39FF14" // Neon Green
          />
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalesTrendChart accentColor="#00FFFF" />
          <CategoryDistributionChart accentColor="#FF00FF" />
          <SalesChannelChart accentColor="#39FF14" />
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
