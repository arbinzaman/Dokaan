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
import { useUser } from "../../../../contexts/AuthContext";

const SalesTrendChart = () => {
  const { savedShop } = useUser(); // Get user details from context

  const fetchSalesData = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/sales/stats-by-month?shopId=${savedShop.id}`
    );
    return response.data.map((item) => ({
      month: item.month,
      sales: item.sales,
    }));
  };

  const {
    data: salesData = [],
    isError,
    error,
  } = useQuery({
    queryKey: ["salesTrend"],
    queryFn: fetchSalesData,
  });

  if (isError)
    return <div>{error?.message || "Failed to load sales data."}</div>;

  return (
    <motion.div
      className="bg-white dark:bg-black bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">
        Sales Trend
      </h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3"  />
            <XAxis
              dataKey="month"
              stroke="#00FFFF"
              tick={{ fill: "#FFFFFF", fontWeight: 600 }}
            />
            <YAxis
              stroke="#00FFFF"
              tick={{ fill: "#FFFFFF", fontWeight: 600 }}
            />
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
                fontWeight: 600,
              }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#00FFFF"
              strokeWidth={3}
              dot={{ stroke: "#00FFFF", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalesTrendChart;
