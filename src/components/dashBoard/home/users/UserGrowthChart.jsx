import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const UserGrowthChart = () => {
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchUserGrowthData = async () => {
      try {
        const token = Cookies.get("XTOKEN");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/user-growth`,
          {
            headers: token ? { Authorization: token } : undefined,
          }
        );
        const list = Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        if (!cancelled) setUserGrowthData(list);
      } catch (error) {
        console.error("Error fetching user growth data:", error);
        if (!cancelled) setUserGrowthData([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchUserGrowthData();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl p-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        User Growth
      </h2>
      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
          Loading growth chart...
        </p>
      ) : userGrowthData.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
          No user growth data available.
        </p>
      ) : (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userGrowthData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#9CA3AF"
                strokeOpacity={0.25}
              />
              <XAxis
                dataKey="month"
                stroke="#6B7280"
                tick={{ fill: "#6B7280", fontSize: 12 }}
              />
              <YAxis
                stroke="#6B7280"
                tick={{ fill: "#6B7280", fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  borderColor: "#374151",
                  borderRadius: "0.75rem",
                  color: "#F9FAFB",
                }}
                itemStyle={{ color: "#F9FAFB" }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#6366F1"
                strokeWidth={2.5}
                dot={{ fill: "#6366F1", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default UserGrowthChart;
