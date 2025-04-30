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

const fetchCategoryDistribution = async () => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/sales/category-wise`
  );
  return data.map(item => ({
    name: item.category,
    value: item.totalSalesAmount,
  }));
};

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const CategoryDistributionChart = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["category-distribution"],
    queryFn: fetchCategoryDistribution,
  });

  return (
    <motion.div
      className='bg-white dark:bg-black shadow-lg rounded-xl p-6'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className='text-lg font-medium mb-4 dark:text-white'>Category Distribution</h2>

      {isLoading ? (
        <p className='text-gray-500 dark:text-gray-400'>Loading chart...</p>
      ) : isError ? (
        <p className='text-sm text-red-500'>Failed to load data.</p>
      ) : data?.length > 0 ? (
        <div className='h-80'>
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
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          No data available
        </p>
      )}
    </motion.div>
  );
};

export default CategoryDistributionChart;
