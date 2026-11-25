import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useUser } from "../../../../contexts/AuthContext";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EC4899", "#0EA5E9", "#8B5CF6"];

const CategoryDistributionChart = () => {
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
      transition={{ delay: 0.15 }}
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Category Distribution
      </h2>

      {isLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading chart...</p>
      ) : isError ? (
        <p className="text-sm text-red-500">Failed to load data.</p>
      ) : data.length > 0 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                fill="#6366F1"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
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
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">No data available</p>
      )}
    </motion.div>
  );
};

export default CategoryDistributionChart;
