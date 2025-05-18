import { motion } from "framer-motion";
import StatCard from "../../../components/dashBoard/home/common/StatCard";
import { Users, Star, ShoppingBag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import CustomersTable from "../../../components/dashBoard/home/customers/CustomersTable";
import { useUser } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import CustomerGrowth from "../../../components/dashBoard/home/customers/CustomerGrowth";

const CustomersPage = () => {
  const { dokaan } = useUser();
  const navigate = useNavigate();

  const {
    data = {},
    // isLoading,
    //  isError
  } = useQuery({
    queryKey: ["customers", dokaan?.id],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const shopId = Number(dokaan?.id);

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/customers/stats`,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          params: { shopId },
        }
      );
      return response.data.data;
    },
    enabled: !!dokaan?.id,
  });
  console.log(data);
  const {
    totalCustomers = 0,
    favoriteCustomers = 0,
    totalPurchases = 0,
    customers = [],
  } = data;

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
            name="Total Customers"
            icon={Users}
            value={totalCustomers}
            color="#4F46E5"
            onClick={() => navigate("/dashboard/customers-list")}
          />
          <StatCard
            name="Favorite Customers"
            icon={Star}
            value={favoriteCustomers}
            color="#F59E0B"
            onClick={() => navigate("/dashboard/customers-list?favorite=true")}
          />
          <StatCard
            name="Total Purchases"
            icon={ShoppingBag}
            value={totalPurchases}
            color="#10B981"
          />
        </motion.div>

        {/* TABLE */}
        <CustomerGrowth/>
        <CustomersTable customers={customers} />
        {/* 
        {isLoading && <div>Loading customer data...</div>}
        {isError && <div>Error loading data.</div>} */}
      </main>
    </div>
  );
};

export default CustomersPage;
