import { CheckCircle, Clock, ShoppingBag } from "lucide-react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import StatCard from "../../../components/dashBoard/home/common/StatCard";
import DailyOrders from "../../../components/dashBoard/home/orders/DailyOrders";
import OrderDistribution from "../../../components/dashBoard/home/orders/OrderDistribution";
import OrdersTable from "../../../components/dashBoard/home/orders/OrdersTable";
import { useUser } from "../../../contexts/AuthContext";

const OrdersPage = () => {
  const { savedShop } = useUser();
  const queryClient = useQueryClient();
  const shopId = savedShop?.id;

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", shopId],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/orders`, {
        params: { shopId },
        headers: token ? { Authorization: token } : undefined,
      });
      return Array.isArray(res.data?.data) ? res.data.data : [];
    },
    enabled: !!shopId,
  });

  const handleStatusChange = async (orderId, nextStatus) => {
    try {
      const token = Cookies.get("XTOKEN");
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/orders/${encodeURIComponent(orderId)}`,
        { status: nextStatus },
        { headers: token ? { Authorization: token } : undefined }
      );
      queryClient.invalidateQueries({ queryKey: ["orders", shopId] });
      toast.success(`Order ${orderId} updated to ${nextStatus}.`);
    } catch {
      toast.error("Failed to update order status.");
    }
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.status === "Pending" || o.status === "Processing"
  ).length;
  const completedOrders = orders.filter((o) => o.status === "Delivered").length;
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);

  return (
    <div className="flex-1 relative z-10 overflow-auto">
      <main className="max-w-7xl mx-auto py-4 px-2 sm:px-4 lg:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Orders
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track order fulfillment, update statuses live, and monitor order values.
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
            value={isLoading ? "..." : totalOrders}
            color="#6366F1"
          />
          <StatCard
            name="Active / Pending"
            icon={Clock}
            value={isLoading ? "..." : pendingOrders}
            color="#F59E0B"
          />
          <StatCard
            name="Delivered"
            icon={CheckCircle}
            value={isLoading ? "..." : completedOrders}
            color="#10B981"
          />
          <StatCard
            name="Order Value"
            icon={FaBangladeshiTakaSign}
            value={isLoading ? "..." : `৳${totalRevenue.toLocaleString()}`}
            color="#EF4444"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DailyOrders />
          <OrderDistribution orders={orders} />
        </div>

        <OrdersTable
          orders={orders}
          loading={isLoading}
          onStatusChange={handleStatusChange}
        />
      </main>
    </div>
  );
};

export default OrdersPage;
