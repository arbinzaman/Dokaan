import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import axios from "axios";
import Cookies from "js-cookie";
import { useUser } from "../../../../contexts/AuthContext";

const ProductPerformance = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { savedShop } = useUser();
  const shopId = savedShop?.id;

  useEffect(() => {
    if (!shopId) {
      setChartData([]);
      return;
    }

    let cancelled = false;
    const fetchTopSellingProducts = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("XTOKEN");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/sales/top-selling`,
          {
            params: { shopId },
            headers: token ? { Authorization: token } : undefined,
          }
        );

        const raw = response.data || {};
        const shopBucket =
          raw[String(shopId)] ||
          raw.data ||
          Object.values(raw).find((entry) => Array.isArray(entry?.products));

        const backendProducts = Array.isArray(shopBucket?.products)
          ? shopBucket.products
          : Array.isArray(raw.products)
          ? raw.products
          : [];

        const formattedData = backendProducts.map((product) => ({
          name: product.name || "Unnamed",
          totalSold: Number(product.totalSold ?? 0),
          initialStock: Number(product.initialStock ?? product.stock ?? 0),
        }));

        if (!cancelled) setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching top-selling products:", error);
        if (!cancelled) setChartData([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTopSellingProducts();
    return () => {
      cancelled = true;
    };
  }, [shopId]);

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl p-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Product Performance
      </h2>

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">
          Loading product performance...
        </div>
      ) : chartData.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">
          No product performance data available.
        </div>
      ) : (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#9CA3AF" strokeOpacity={0.25} />
              <XAxis dataKey="name" stroke="#6B7280" tick={{ fill: "#6B7280", fontSize: 12 }} />
              <YAxis stroke="#6B7280" tick={{ fill: "#6B7280", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  borderColor: "#374151",
                  borderRadius: "0.75rem",
                  color: "#F9FAFB",
                }}
                itemStyle={{ color: "#F9FAFB" }}
              />
              <Legend />

              <Bar dataKey="totalSold" name="Total Sold" radius={[6, 6, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`sold-${index}`} fill="#6366F1" />
                ))}
              </Bar>

              <Bar dataKey="initialStock" name="Stock" radius={[6, 6, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`stock-${index}`} fill="#10B981" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default ProductPerformance;
