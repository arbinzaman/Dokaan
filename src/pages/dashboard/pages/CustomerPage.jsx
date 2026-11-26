import { motion } from "framer-motion";
import StatCard from "../../../components/dashBoard/home/common/StatCard";
import { Users, Star, ShoppingBag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import CustomersTable from "../../../components/dashBoard/home/customers/CustomersTable";
import { useUser } from "../../../contexts/AuthContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import CustomerGrowth from "../../../components/dashBoard/home/customers/CustomerGrowth";

const CustomersPage = () => {
  const { savedShop } = useUser();
  const { pick } = useLanguage();
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {pick("Customers", "কাস্টমার তালিকা")}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {pick(
              "See repeat buyers, VIP favorites, and customer growth at a glance.",
              "নিয়মিত ক্রেতা, প্রিয় কাস্টমার এবং মোট কেনাকাটার হিসাব দেখুন।"
            )}
          </p>
        </div>

        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <StatCard
            name={pick("Total Customers", "মোট কাস্টমার")}
            icon={Users}
            value={isLoading ? "..." : totalCustomers}
            subtext={pick("Tap to view all", "সব কাস্টমার দেখুন")}
            color="#DC2626"
            onClick={() => navigate("/dashboard/customers-list")}
          />
          <StatCard
            name={pick("Favorite Buyers", "প্রিয় কাস্টমার")}
            icon={Star}
            value={isLoading ? "..." : favoriteCustomers}
            subtext={pick("View VIP list", "ভিআইপি তালিকা")}
            color="#F59E0B"
            onClick={() => navigate("/dashboard/customers-list?favorite=true")}
          />
          <StatCard
            name={pick("Total Purchases", "মোট কেনাকাটা")}
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
