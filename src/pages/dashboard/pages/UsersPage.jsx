import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";
import { format, isValid } from "date-fns";

import StatCard from "../../../components/dashBoard/home/common/StatCard";
import UsersTable from "../../../components/dashBoard/home/users/UsersTable";
import UserGrowthChart from "../../../components/dashBoard/home/users/UserGrowthChart";
import UserActivityHeatmap from "../../../components/dashBoard/home/users/UserActivityHeatmap";
import UserDemographicsChart from "../../../components/dashBoard/home/users/UserDemographicsChart";

const UsersPage = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchUsers = async () => {
      try {
        const token = Cookies.get("XTOKEN");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user`,
          {
            headers: token ? { Authorization: token } : undefined,
          }
        );
        const users = Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        if (!cancelled) setUserData(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        if (!cancelled) setUserData([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchUsers();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalUsers = userData.length;
  const activeUsers = userData.filter(
    (user) => user?.subscriptionStatus === true
  ).length;
  const formattedToday = format(new Date(), "yyyy-MM-dd");
  const newUsersToday = userData.filter((user) => {
    if (!user?.createdAt) return false;
    const d = new Date(user.createdAt);
    return isValid(d) && format(d, "yyyy-MM-dd") === formattedToday;
  }).length;

  const churnRate =
    totalUsers > 0
      ? `${(((totalUsers - activeUsers) / totalUsers) * 100).toFixed(1)}%`
      : "0.0%";

  const handleUserDeleted = (deletedId) => {
    setUserData((prev) => prev.filter((u) => u.id !== deletedId));
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-4 px-2 sm:px-4 lg:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Platform Users
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage registered shop owners, employees, and subscriptions.
          </p>
        </div>

        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <StatCard
            name="Total Users"
            icon={UsersIcon}
            value={loading ? "..." : totalUsers.toLocaleString()}
            color="#6366F1"
          />
          <StatCard
            name="New Users Today"
            icon={UserPlus}
            value={loading ? "..." : newUsersToday}
            color="#10B981"
          />
          <StatCard
            name="Subscribed Users"
            icon={UserCheck}
            value={loading ? "..." : activeUsers.toLocaleString()}
            color="#F59E0B"
          />
          <StatCard
            name="Inactive Rate"
            icon={UserX}
            value={loading ? "..." : churnRate}
            color="#EF4444"
          />
        </motion.div>

        <UsersTable
          userData={userData}
          loading={loading}
          onUserDeleted={handleUserDeleted}
        />

        {/* USER CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="lg:col-span-2">
            <UserGrowthChart />
          </div>
          <UserActivityHeatmap />
          <UserDemographicsChart />
        </div>
      </main>
    </div>
  );
};

export default UsersPage;
