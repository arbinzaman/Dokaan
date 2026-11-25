import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import axios from "axios";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useUser } from "../../../../contexts/AuthContext";

const DailySalesTrend = () => {
  const { savedShop } = useUser();
  const shopId = savedShop?.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["totalSalesCount", shopId],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/sales/total-sales-count`,
        {
          params: { shopId: Number(shopId) },
          headers: {
            ...(token ? { Authorization: token } : {}),
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      return response.data ?? {};
    },
    enabled: !!shopId,
    staleTime: 1000 * 60 * 5,
  });

  const dailySalesData = Array.isArray(data?.dailySalesData)
    ? data.dailySalesData
    : [];

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl p-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Daily Sales Trend {data?.date ? `— ${data.date}` : ""}
      </h2>

      {isLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading daily sales...
        </p>
      ) : error ? (
        <p className="text-sm text-red-500">
          Failed to load daily sales data.
        </p>
      ) : dailySalesData.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
          No daily sales data available.
        </p>
      ) : (
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailySalesData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#9CA3AF"
                strokeOpacity={0.25}
              />
              <XAxis
                dataKey="name"
                stroke="#6B7280"
                tick={{ fill: "#6B7280", fontSize: 12 }}
              />
              <YAxis
                stroke="#6B7280"
                tick={{ fill: "#6B7280", fontSize: 12 }}
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
              <Bar dataKey="sales" fill="#10B981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default DailySalesTrend;
