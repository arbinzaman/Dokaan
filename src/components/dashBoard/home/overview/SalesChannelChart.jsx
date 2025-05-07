import { motion } from "framer-motion";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
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

const SalesChannelChart = ({
  accentColor = "#6366F1",
  title = "Sales by Category",
}) => {
  const { dokaan } = useUser(); // Get user details from context
  const fetchSalesCategoryWise = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/sales/category-wise?shopId=${dokaan.id}`
    );
    // Map API response to recharts-friendly format
    return data.map((item) => ({
      name: item.category,
      value: item.totalSalesAmount,
    }));
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["sales-category-wise"],
    queryFn: fetchSalesCategoryWise,
  });

  return (
    <motion.div
      className="bg-white dark:bg-black shadow-lg rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-lg font-medium mb-4 text-black dark:text-white">
        {title}
      </h2>

      {isLoading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading chart...</p>
      ) : isError ? (
        <p className="text-sm text-red-500">Failed to load data.</p>
      ) : data?.length > 0 ? (
        <div className="h-80">
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderColor: accentColor,
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <Bar dataKey="value" fill={accentColor} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No data available
        </p>
      )}
    </motion.div>
  );
};

export default SalesChannelChart;
