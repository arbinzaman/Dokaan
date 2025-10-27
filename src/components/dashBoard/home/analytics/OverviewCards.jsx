import { motion } from "framer-motion";
import StatCard from "../../../../components/dashBoard/home/common/StatCard";
import { ShoppingCart, UserCheck, BarChart3 } from "lucide-react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import axios from "axios";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../../../contexts/AuthContext";

const OverviewCards = () => {
  const { user, savedShop } = useUser();

  // Fetch total products
  const { data: productData = [], isLoading: productLoading } = useQuery({
    queryKey: ["products", user?.email],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/products?shopId=${savedShop?.id}`,
        {
          headers: {
            Authorization: `${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    },
    enabled: !!user?.email,
  });

  // Fetch total customers
  const { data: customerData = [], isLoading: customerLoading } = useQuery({
    queryKey: ["customers", savedShop?.id],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/customers?shopId=${savedShop?.id}`,
        {
          headers: {
            Authorization: `${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    },
    enabled: !!savedShop?.id,
  });

  // Fetch total sales amount
  const { data: salesData, isLoading: salesLoading } = useQuery({
    queryKey: ["totalSales", savedShop?.id],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/sales/total?shopId=${savedShop?.id}`
      );
      return response.data;
    },
    enabled: !!savedShop?.id,
  });

  const totalSalesAmount = salesData?.totalSales ?? 0;

  // Fetch total revenue (profit)
  const { data: profitData = {}, isLoading: profitLoading } = useQuery({
    queryKey: ["totalProfit", savedShop?.id],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/sales/total-revenue?shopId=${
          savedShop?.id
        }`,
        {
          headers: {
            Authorization: `${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    enabled: !!savedShop?.id,
  });

  const totalProfit = profitData?.totalRevenue ?? 0;

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Profit"
            icon={FaBangladeshiTakaSign}
            value={profitLoading ? "..." : `৳${totalProfit.toLocaleString()}`}
            color="#22C55E"
          />
          <StatCard
            name="Total Products"
            icon={ShoppingCart}
            value={productLoading ? "..." : productData.length}
            color="#6366F1"
          />
          <StatCard
            name="Total Customers"
            icon={UserCheck}
            value={customerLoading ? "..." : customerData.length}
            color="#0EA5E9"
          />
          <StatCard
            name="Total Sales"
            icon={BarChart3}
            value={
              salesLoading ? "..." : `৳${totalSalesAmount.toLocaleString()}`
            }
            color="#F97316"
          />
        </motion.div>
      </main>
    </div>
  );
};

export default OverviewCards;
