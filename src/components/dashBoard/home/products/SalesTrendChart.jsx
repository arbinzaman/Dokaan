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
  const {dokaan} = useUser(); // Get user details from context
  
  const fetchSalesData = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/sales/stats-by-month?shopId=${dokaan.id}`);
    return response.data.map(item => ({
      month: item.month,
      sales: item.sales,
    }));
  };
 
  const {
    data: salesData = [],
    // isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["salesTrend"],
    queryFn: fetchSalesData,
  });
// console.log(salesData);
  // if (isLoading) return <div></div>;
  if (isError) return <div>{error?.message || "Failed to load sales data."}</div>;

  return (
    <motion.div
      className="bg-white dark:bg-black bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Sales Trend</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#8B5CF6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalesTrendChart;
