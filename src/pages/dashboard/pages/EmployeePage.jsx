// src/pages/dashboard/Employee.jsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { useUser } from "../../../contexts/AuthContext";
import EmployeeTable from "../../../components/dashBoard/home/Employee/EmployeeTable";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import StatCard from "../../../components/dashBoard/home/common/StatCard";
import { useNavigate } from "react-router-dom";

const EmployeePage = () => {
  const { savedShop } = useUser();
  const navigate = useNavigate();
  // console.log(savedShop);
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees", savedShop?.id],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const response = await axios.get(
        `${baseUrl}/employee?shopId=${savedShop?.id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      return response.data.data;
    },
    enabled: !!savedShop?.id,
  });

  //   console.log(employees);
  const activeEmployees = employees.filter(
    (emp) => emp.workStatus === "active"
  );
  const inactiveEmployees = employees.filter(
    (emp) => emp.workStatus !== "active"
  );

  return (
    <div className="flex-1 overflow-auto relative z-10 mb-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Employees"
            icon={Users}
            value={employees.length}
            color="#6366F1"
          />
          <StatCard
            name="Active"
            icon={Users}
            value={activeEmployees.length}
            color="#10B981"
          />
          <StatCard
            name="Inactive"
            icon={Users}
            value={inactiveEmployees.length}
            color="#EF4444"
          />
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition  items-center flex justify-self-end"
          onClick={() => navigate("/dashboard/add-a-employee")}
        >
          + Add Employee
        </motion.button>

        {/* Table */}
        <EmployeeTable employees={employees} loading={isLoading} />
      </main>
    </div>
  );
};

export default EmployeePage;
