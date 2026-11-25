import { motion } from "framer-motion";
import axios from "axios";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useUser } from "../../../../contexts/AuthContext";

const BAR_COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EC4899", "#0EA5E9", "#8B5CF6"];

const SalesChannelChart = ({ title = "Sales by Category" }) => {
  const { savedShop } = useUser();
  const shopId = savedShop?.id;

  const { data = [], isLoading, isError } = useQuery({
    queryKey: ["sales-category-wise", shopId],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const { data: resData } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/sales/category-wise`,
        {
          params: { shopId },
          headers: token ? { Authorization: token } : undefined,
        }
      );
      const list = Array.isArray(resData)
        ? resData
        : Array.isArray(resData?.data)
        ? resData.data
        : [];
      return list.map((item) => ({
        name: item.category || "Uncategorized",
        value: Number(item.totalSalesAmount ?? 0),
      }));
    },
    enabled: !!shopId,
  });

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl p-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        {title}
      </h2>

      {isLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading chart...</p>
      ) : isError ? (
        <p className="text-sm text-red-500">Failed to load data.</p>
      ) : data.length > 0 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#9CA3AF" strokeOpacity={0.25} />
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
                formatter={(value) => `৳${Number(value).toLocaleString()}`}
                contentStyle={{
                  backgroundColor: "#111827",
                  borderColor: "#374151",
                  borderRadius: "0.75rem",
                  color: "#F9FAFB",
                }}
                itemStyle={{ color: "#F9FAFB" }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={BAR_COLORS[index % BAR_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">No data available</p>
      )}
    </motion.div>
  );
};

export default SalesChannelChart;
