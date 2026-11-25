import { CheckCircle, Clock, ShoppingBag } from "lucide-react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { motion } from "framer-motion";
import StatCard from "../../../components/dashBoard/home/common/StatCard";
import DailyOrders from "../../../components/dashBoard/home/orders/DailyOrders";
import OrderDistribution from "../../../components/dashBoard/home/orders/OrderDistribution";
import OrdersTable from "../../../components/dashBoard/home/orders/OrdersTable";

const orderStats = {
  totalOrders: "255",
  pendingOrders: "30",
  completedOrders: "120",
  totalRevenue: "৳98,765",
};

const OrdersPage = () => {
  return (
    <div className="flex-1 relative z-10 overflow-auto">
      <main className="max-w-7xl mx-auto py-4 px-2 sm:px-4 lg:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Orders
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track order fulfillment, pending dispatches, and order values.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <StatCard
            name="Total Orders"
            icon={ShoppingBag}
            value={orderStats.totalOrders}
            color="#6366F1"
          />
          <StatCard
            name="Pending Orders"
            icon={Clock}
            value={orderStats.pendingOrders}
            color="#F59E0B"
          />
          <StatCard
            name="Completed Orders"
            icon={CheckCircle}
            value={orderStats.completedOrders}
            color="#10B981"
          />
          <StatCard
            name="Total Revenue"
            icon={FaBangladeshiTakaSign}
            value={orderStats.totalRevenue}
            color="#EF4444"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DailyOrders />
          <OrderDistribution />
        </div>

        <OrdersTable />
      </main>
    </div>
  );
};

export default OrdersPage;
