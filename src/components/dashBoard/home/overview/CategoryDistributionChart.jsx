import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useUser } from "../../../../contexts/AuthContext";

// Vibrant Neon Colors
const COLORS = ["#FF6B6B", "#6BCB77", "#4D96FF", "#FFD93D", "#C74B50"];

const CategoryDistributionChart = () => {
  const { savedShop } = useUser();

  const fetchCategoryDistribution = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/sales/category-wise?shopId=${savedShop.id}`
    );
    return data.map((item) => ({
      name: item.category,
      value: item.totalSalesAmount,
    }));
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["category-distribution"],
    queryFn: fetchCategoryDistribution,
  });

  return (
    <motion.div
      className="bg-white dark:bg-black shadow-lg rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4 text-white">
        Category Distribution
      </h2>

      {isLoading ? (
        <p className="text-white">Loading chart...</p>
      ) : isError ? (
        <p className="text-sm text-red-500">Failed to load data.</p>
      ) : data?.length > 0 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
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
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.85)",
                  borderColor: "#00FFFF",
                }}
                itemStyle={{ color: "#FFFFFF", fontWeight: 500 }}
                labelStyle={{ color: "#00FFFF" }}
              />
              <Legend
                wrapperStyle={{
                  color: "#FFFFFF",
                  fontWeight: 500,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-sm text-white">No data available</p>
      )}
    </motion.div>
  );
};

export default CategoryDistributionChart;
