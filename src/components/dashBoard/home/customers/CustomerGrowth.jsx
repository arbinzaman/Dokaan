import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { useUser } from "../../../../contexts/AuthContext";

const CustomerGrowth = () => {
  const { savedShop } = useUser();
  const shopId = savedShop?.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["customerGrowth", shopId],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/customers/growth`,
        {
          params: { shopId },
          headers: token ? { Authorization: token } : undefined,
        }
      );
      return response.data ?? {};
    },
    enabled: !!shopId,
  });

  const growthData = Array.isArray(data?.data) ? data.data : [];
  const lastUpdated = data?.lastUpdatedMonth || "N/A";

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl p-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Customer Growth
        </h2>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Last Updated: {lastUpdated}
        </span>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
          Loading customer growth data...
        </p>
      ) : error ? (
        <p className="text-sm text-red-500 py-4">
          Failed to load growth data.
        </p>
      ) : growthData.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
          No customer growth data yet.
        </p>
      ) : (
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#9CA3AF"
                strokeOpacity={0.25}
              />
              <XAxis
                dataKey="month"
                stroke="#6B7280"
                tick={{ fill: "#6B7280", fontSize: 12 }}
              />
              <YAxis
                stroke="#6B7280"
                tick={{ fill: "#6B7280", fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  borderColor: "#374151",
                  borderRadius: "0.75rem",
                  color: "#F9FAFB",
                }}
                itemStyle={{ color: "#F9FAFB" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#10B981"
                strokeWidth={2.5}
                name="New Customers"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default CustomerGrowth;
