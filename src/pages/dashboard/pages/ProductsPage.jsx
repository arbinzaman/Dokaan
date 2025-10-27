import { motion } from "framer-motion";
import StatCard from "../../../components/dashBoard/home/common/StatCard";
import { AlertTriangle, Package, TrendingUp } from "lucide-react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import CategoryDistributionChart from "../../../components/dashBoard/home/overview/CategoryDistributionChart";
import SalesTrendChart from "../../../components/dashBoard/home/products/SalesTrendChart";
import ProductsTable from "../../../components/dashBoard/home/products/ProductsTable";
import axios from "axios";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../../contexts/AuthContext";
import ProductPerformance from "../../../components/dashBoard/home/analytics/ProductPerformance";

const ProductsPage = () => {
  const { user, savedShop } = useUser(); // Get user details from context
  // const token = Cookies.get("XTOKEN");
  // console.log(token);
  // console.log(typeof(savedShop.id));

  // Fetch all products
  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
    error: productsErrorMsg,
  } = useQuery({
    queryKey: ["products", user?.email],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");

      if (!token) {
        throw new Error("No token found in cookies");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/products?shopId=${savedShop?.id}`,
        {
          headers: {
            Authorization: `${token}`,
            Accept: "application/json", // <--- ADD this
            "Content-Type": "application/json", // <--- ADD this
          },
        }
      );

      return response.data.data;
    },
    enabled: !!user?.email, // only run if user email exists
  });

  const productCount = products.length;

  // Fetch top selling products
  const { data: topSellingData = {}, isLoading: topSellingLoading } = useQuery({
    queryKey: ["topSellingProducts", savedShop?.id], // Ensure savedShop has shopId
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");

      if (!token) {
        throw new Error("No token found in cookies");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/sales/top-selling?shopId=${savedShop.id}`, // Use savedShop?.id
        {
          headers: {
            Authorization: `${token}`,
            Accept: "application/json", // <--- ADD this
            "Content-Type": "application/json", // <--- ADD this
          },
        }
      );

      return response.data;
    },
    enabled: !!savedShop?.id, // Ensure savedShop has id before making the request
  });

  // Fetch low stock products
  const { data: lowStockData = {}, isLoading: lowStockLoading } = useQuery({
    queryKey: ["lowStockProducts", savedShop?.id],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");

      if (!token) {
        throw new Error("No token found in cookies");
      }

      const shopId = Number(savedShop?.id);

      if (isNaN(shopId)) {
        throw new Error("Invalid shop ID");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/sales/products/low-stock`,
        {
          headers: {
            Authorization: `${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          params: {
            shopId,
          },
        }
      );

      return response.data;
    },
    enabled: !!savedShop?.id,
  });

  // Fetch total revenue
  const { data: revenueData = {}, isLoading: revenueLoading } = useQuery({
    queryKey: ["totalRevenue", savedShop?.id],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");

      if (!token) {
        throw new Error("No token found in cookies");
      }

      const shopId = Number(savedShop?.id);
      if (isNaN(shopId)) {
        throw new Error("Invalid shop ID");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/sales/total-revenue`,
        {
          headers: {
            Authorization: `${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          params: { shopId },
        }
      );

      return response.data;
    },
    enabled: !!savedShop?.id,
  });

  const totalRevenue = revenueData?.totalRevenue || 0;

  // const shopId = Number(savedShop?.id);
  // console.log("Token:", token);
  // console.log("savedShop ID:", savedShop?.id);
  // console.log("Shop ID (converted):", shopId);

  const topSellingCount = topSellingData?.totalTopSellingProducts || 0;
  const lowStockCount = lowStockData?.totalLowStockProducts || 0;
  console.log(lowStockData);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Products"
            icon={Package}
            value={productCount}
            color="#6366F1"
          />
          <StatCard
            name="Top Selling"
            icon={TrendingUp}
            value={topSellingLoading ? "..." : topSellingCount}
            color="#10B981"
          />
          <StatCard
            name="Low Stock"
            icon={AlertTriangle}
            value={lowStockLoading ? "..." : lowStockCount}
            color="#F59E0B"
          />
          <StatCard
            name="Total Revenue"
            icon={FaBangladeshiTakaSign} // Swap to Rupee or Taka-looking icon
            value={revenueLoading ? "..." : `৳${totalRevenue.toLocaleString()}`}
            color="#EF4444"
          />
        </motion.div>
        <ProductPerformance />
        {/* Products Table */}
        <ProductsTable
          products={products} // Pass the products as a prop here
          loading={productsLoading} // Optionally pass loading state to ProductsTable
        />

        {/* Error States */}
        {productsLoading && <div>Loading Products...</div>}
        {productsError && <div>Error: {productsErrorMsg.message}</div>}

        {/* CHARTS */}
        <div className="grid grid-col-1 lg:grid-cols-2 gap-8">
          <SalesTrendChart />
          <CategoryDistributionChart />
        </div>
      </main>
    </div>
  );
};

export default ProductsPage;
