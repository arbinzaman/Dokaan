import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { useUser } from "../../../../contexts/AuthContext";

const SalesTrendChart = () => {
  const { savedShop } = useUser();
  const shopId = savedShop?.id;

  const {
    data: salesData = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["salesTrend", shopId],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/sales/stats-by-month`,
        {
          params: { shopId },
          headers: token ? { Authorization: token } : undefined,
        }
      );
      const list = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
        ? response.data.data
        : [];
      return list.map((item) => ({
        month: item.month,
        sales: Number(item.sales ?? 0),
      }));
    },
    enabled: !!shopId,
  });

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl p-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Sales Trend
      </h2>

      {isLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading chart...</p>
      ) : isError ? (
        <p className="text-sm text-red-500">
          {error?.message || "Failed to load sales data."}
        </p>
      ) : salesData.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No sales trend data available.
        </p>
      ) : (
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#9CA3AF" strokeOpacity={0.25} />
              <XAxis
                dataKey="month"
                stroke="#6B7280"
                tick={{ fill: "#6B7280", fontSize: 12 }}
              />
              <YAxis
                stroke="#6B7280"
                tick={{ fill: "#6B7280", fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => `৳${Number(value).toLocaleString()}`}
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
                dataKey="sales"
                name="Sales"
                stroke="#6366F1"
                strokeWidth={2.5}
                dot={{ stroke: "#6366F1", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default SalesTrendChart;
