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
} from "recharts";
import { motion } from "framer-motion";
import axios from "axios";

const ProductPerformance = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/sales/top-selling?shopId=1`
        );

        const backendProducts = response.data["1"].products;

        const formattedData = backendProducts.map((product) => ({
          name: product.name,
          totalSold: product.totalSold,
          initialStock: product.initialStock,
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching top-selling products:", error);
      }
    };

    fetchTopSellingProducts();
  }, []);

  return (
    <motion.div
      className='bg-white dark:bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className='text-xl font-semibold text-black dark:text-white mb-4'>
        Product Performance
      </h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
            <XAxis dataKey='name' stroke='#9CA3AF' />
            <YAxis stroke='#9CA3AF' />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
            <Bar dataKey='totalSold' fill='#8B5CF6' name='Total Sold' />
            <Bar dataKey='initialStock' fill='#10B981' name='Initial Stock' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ProductPerformance;
