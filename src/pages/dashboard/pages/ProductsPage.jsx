import { motion } from "framer-motion";
import StatCard from "../../../components/dashBoard/home/common/StatCard";
import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import CategoryDistributionChart from "../../../components/dashBoard/home/overview/CategoryDistributionChart";
import SalesTrendChart from "../../../components/dashBoard/home/products/SalesTrendChart";
import ProductsTable from "../../../components/dashBoard/home/products/ProductsTable";
import axios from "axios";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../../contexts/AuthContext";

const ProductsPage = () => {
  const { user, dokaan } = useUser(); // Get user details from context

  // Fetch all products
  const { data: products = [], isLoading: productsLoading, isError: productsError, error: productsErrorMsg } = useQuery({
    queryKey: ["products", user?.email],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");

      if (!token) {
        throw new Error("No token found in cookies");
      }

      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/products/${user?.email}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      return response.data.data;
    },
    enabled: !!user?.email, // only run if user email exists
  });

  const productCount = products.length;

  // Fetch top selling products
  const { data: topSellingData = {}, isLoading: topSellingLoading } = useQuery({
    queryKey: ["topSellingProducts", dokaan?.id], // Ensure dokaan has shopId
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");

      if (!token) {
        throw new Error("No token found in cookies");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/sales/top-selling?shopId=${dokaan?.id}`, // Use dokaan?.id
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      // Log the full response to check if it's correct
      console.log("Top Selling API Response:", response.data);

      return response.data;
    },
    enabled: !!dokaan?.id, // Ensure dokaan has id before making the request
  });

  console.log(topSellingData); // Log the topSellingData to check its structure

  // Access totalTopSellingProducts safely
  const topSellingCount = topSellingData?.totalTopSellingProducts || 0;
  // console.log("Top Selling Count:", topSellingCount); // This should safely log 0 if the data is not available

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
          <StatCard name="Total Products" icon={Package} value={productCount} color="#6366F1" />
          <StatCard name="Top Selling" icon={TrendingUp} value={topSellingLoading ? "..." : topSellingCount} color="#10B981" />
          <StatCard name="Low Stock" icon={AlertTriangle} value={23} color="#F59E0B" />
          <StatCard name="Total Revenue" icon={DollarSign} value={"$543,210"} color="#EF4444" />
        </motion.div>

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
