import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useUser } from "../../../../contexts/AuthContext";

const CustomerGrowth = () => {
  const { dokaan } = useUser();
  const shopId = dokaan?.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["customerGrowth", shopId],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/customers/growth?shopId=${shopId}`
      );
      return response.data;
    },
    enabled: !!shopId,
  });

  if (isLoading) {
    return (
      <div className="p-6 bg-white dark:bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl">
        <p className="text-gray-500">Loading customer growth data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white dark:bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl">
        <p className="text-red-500">Failed to load growth data</p>
      </div>
    );
  }

  const growthData = data?.data || [];
  const lastUpdated = data?.lastUpdatedMonth || "N/A";

  return (
    <motion.div
      className="bg-white dark:bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#10B981] drop-shadow-[0_0_6px_#10B981]">
          Customer Growth
        </h2>
        <span className="text-sm text-gray-500">
          Last Updated: {lastUpdated}
        </span>
      </div>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#10B981"
              strokeWidth={2}
              name="New Customers"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default CustomerGrowth;
