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
import { useUser } from "../../../../contexts/AuthContext"; // adjust the path as needed

const fetchDailySalesData = async (shopId) => {
  const token = Cookies.get("XTOKEN");
  if (!token) throw new Error("No token found");
  if (!shopId) throw new Error("Invalid shop ID");

  const response = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/sales/total-sales-count?shopId=${shopId}`,
    {
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

const DailySalesTrend = () => {
  const { savedShop } = useUser();
  const shopId = savedShop?.id;

  const {
    data,
    error,
    // isLoading
  } = useQuery({
    queryKey: ["dailySalesData", shopId],
    queryFn: () => fetchDailySalesData(shopId),
    enabled: !!shopId,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });

  //   if (isLoading) {
  //     return <div>Loading daily sales...</div>;
  //   }

  if (error) {
    return <div>Error loading sales data: {error.message}</div>;
  }

  const dailySalesData = data?.dailySalesData || [];

  return (
    <motion.div
      className="bg-white dark:bg-black bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-xl font-semibold text-white dark:bg-black mb-4">
        Daily Sales Trend - {data?.date || ""}
      </h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dailySalesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Bar dataKey="sales" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default DailySalesTrend;
