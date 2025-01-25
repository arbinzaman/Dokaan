import { motion } from "framer-motion";
import StatCard from "../../../components/dashBoard/home/common/StatCard";
import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import CategoryDistributionChart from "../../../components/dashBoard/home/overview/CategoryDistributionChart";
import SalesTrendChart from "../../../components/dashBoard/home/products/SalesTrendChart";
import ProductsTable from "../../../components/dashBoard/home/products/ProductsTable";
import axios from "axios";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query"; // Import the useQuery hook from TanStack Query

const ProductsPage = () => {
  // Fetch products using TanStack Query
  const { data: products = [], isLoading, isError, error } = useQuery({
    queryKey: ["products"], // The query key
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");

      if (!token) {
        throw new Error("No token found in cookies");
      }

      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/products`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      return response.data.data; // Return the product data
    },
  });

  const productCount = products.length;
  console.log(products);

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
          <StatCard name="Top Selling" icon={TrendingUp} value={89} color="#10B981" />
          <StatCard name="Low Stock" icon={AlertTriangle} value={23} color="#F59E0B" />
          <StatCard name="Total Revenue" icon={DollarSign} value={"$543,210"} color="#EF4444" />
        </motion.div>

        {/* Products Table with data passed as props */}
        <ProductsTable
          products={products}   // Passing the products data
          loading={isLoading}  // Passing loading state
        //   apiBaseUrl={import.meta.env.VITE_BASE_URL}  // Passing the base API URL
        />

        {/* Handle error and loading states */}
        {isLoading && <div>Loading...</div>}
        {isError && <div>Error: {error.message}</div>}

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
