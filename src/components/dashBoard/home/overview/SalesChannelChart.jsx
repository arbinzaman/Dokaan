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
  Cell,
} from "recharts";
import { useUser } from "../../../../contexts/AuthContext";

// New neon color palette
const neonColors = [
  "#FF4500", // Neon Orange Red
  "#7B3FBF", // Neon Purple
  "#1DE9B6", // Neon Teal
  "#FF007F", // Neon Pink
  "#BFFF00", // Neon Lime
];

const SalesChannelChart = ({ title = "Sales by Category" }) => {
  const { dokaan } = useUser();
  const fetchSalesCategoryWise = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/sales/category-wise?shopId=${dokaan.id}`
    );
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
      <h2 className="text-lg font-medium mb-4 text-white">{title}</h2>

      {isLoading ? (
        <p className="text-white">Loading chart...</p>
      ) : isError ? (
        <p className="text-sm text-red-500">Failed to load data.</p>
      ) : data?.length > 0 ? (
        <div className="h-80">
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                stroke="#FF4500"
                tick={{ fill: "#FFA07A", fontWeight: 600 }}
              />
              <YAxis
                stroke="#FF4500"
                tick={{ fill: "#FFA07A", fontWeight: 600 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.85)",
                  borderColor: "#FF4500",
                }}
                itemStyle={{ color: "#FFA07A", fontWeight: 500 }}
                labelStyle={{ color: "#FF4500" }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={neonColors[index % neonColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-sm text-white">No data available</p>
      )}
    </motion.div>
  );
};

export default SalesChannelChart;
