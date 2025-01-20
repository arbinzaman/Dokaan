import { useState, useEffect } from 'react'; 
import axios from 'axios';
import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";
import { format } from 'date-fns'; // Import date-fns for date formatting

import Header from "../../../components/dashBoard/home/common/Header";
import StatCard from "../../../components/dashBoard/home/common/StatCard";
import UsersTable from "../../../components/dashBoard/home/users/UsersTable";
import UserGrowthChart from "../../../components/dashBoard/home/users/UserGrowthChart";
import UserActivityHeatmap from "../../../components/dashBoard/home/users/UserActivityHeatmap";
import UserDemographicsChart from "../../../components/dashBoard/home/users/UserDemographicsChart";

const UsersPage = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [newUsersToday, setNewUsersToday] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0); // State for active users
  const [userData, setUserData] = useState([]); // State to store all user data

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user`); // Use axios for the request
        const users = response.data.data;

        setTotalUsers(users.length); // Total users count
        setUserData(users); // Store all user data

        // Calculate Active Users
        const activeUsersCount = users.filter(user => user.subscriptionStatus === true).length;
        setActiveUsers(activeUsersCount); // Update active users count

        // Calculate New Users Today
        const today = new Date();
        const formattedToday = format(today, 'yyyy-MM-dd'); // Format today's date

        const newUsers = users.filter(user => {
          const userDate = new Date(user.createdAt);
          const formattedUserDate = format(userDate, 'yyyy-MM-dd');
          return formattedUserDate === formattedToday;
        });

        setNewUsersToday(newUsers.length); // Update new users count
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const userStats = {
    totalUsers: totalUsers,
    newUsersToday: newUsersToday,
    activeUsers: activeUsers, // Use dynamic active users count
    churnRate: "2.4%", // Replace with actual data (consider fetching from API)
  };

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title='Users' />

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        {/* STATS */}
        <motion.div
          className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name='Total Users'
            icon={UsersIcon}
            value={userStats.totalUsers.toLocaleString()}
            color='#6366F1'
          />
          <StatCard name='New Users Today' icon={UserPlus} value={userStats.newUsersToday} color='#10B981' />
          <StatCard
            name='Subscribed Users'
            icon={UserCheck}
            value={userStats.activeUsers.toLocaleString()}
            color='#F59E0B'
          />
          <StatCard name='Churn Rate' icon={UserX} value={userStats.churnRate} color='#EF4444' />
        </motion.div>

        <UsersTable userData={userData} /> {/* Pass user data to UsersTable */}

        {/* USER CHARTS */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
          <UserGrowthChart userData={userData} /> {/* Pass user data to UserGrowthChart */}
          <UserActivityHeatmap userData={userData} /> {/* Pass user data to UserActivityHeatmap */}
          <UserDemographicsChart userData={userData} /> {/* Pass user data to UserDemographicsChart */}
        </div>
      </main>
    </div>
  );
};

export default UsersPage;
