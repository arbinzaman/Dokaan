import { motion } from "framer-motion";
import StatCard from "../../../components/dashBoard/home/common/StatCard";
import { Users, Star, ShoppingBag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import CustomersTable from "../../../components/dashBoard/home/customers/CustomersTable";
import { useUser } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import CustomerGrowth from "../../../components/dashBoard/home/customers/CustomerGrowth";

const CustomersPage = () => {
  const { savedShop } = useUser();
  const navigate = useNavigate();

  const { data = {}, isLoading, isError } = useQuery({
    queryKey: ["customers", savedShop?.id],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const shopId = Number(savedShop?.id);

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/customers/stats`,
        {
          headers: {
            ...(token ? { Authorization: `${token}` } : {}),
            "Content-Type": "application/json",
          },
          params: { shopId },
        }
      );
      return response.data?.data ?? {};
    },
    enabled: !!savedShop?.id,
  });

  const {
    totalCustomers = 0,
    favoriteCustomers = 0,
    totalPurchases = 0,
  } = data || {};

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-4 px-2 sm:px-4 lg:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Customers
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track repeat buyers, favorites, and customer acquisition trends.
          </p>
        </div>

        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <StatCard
            name="Total Customers"
            icon={Users}
            value={isLoading ? "..." : totalCustomers}
            subtext="View all customers"
            color="#6366F1"
            onClick={() => navigate("/dashboard/customers-list")}
          />
          <StatCard
            name="Favorite Customers"
            icon={Star}
            value={isLoading ? "..." : favoriteCustomers}
            subtext="View VIP buyers"
            color="#F59E0B"
            onClick={() => navigate("/dashboard/customers-list?favorite=true")}
          />
          <StatCard
            name="Total Purchases"
            icon={ShoppingBag}
            value={isLoading ? "..." : totalPurchases}
            color="#10B981"
          />
        </motion.div>

        {isError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-sm text-red-600 dark:text-red-400">
            Failed to load customer statistics.
          </div>
        )}

        <CustomerGrowth />
        <CustomersTable />
      </main>
    </div>
  );
};

export default CustomersPage;
