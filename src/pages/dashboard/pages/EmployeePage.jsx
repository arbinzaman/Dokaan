// src/pages/dashboard/Employee.jsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { useUser } from "../../../contexts/AuthContext";
import EmployeeTable from "../../../components/dashBoard/home/Employee/EmployeeTable";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import StatCard from "../../../components/dashBoard/home/common/StatCard";

const EmployeePage = () => {
  const { dokaan } = useUser();
// console.log(dokaan);
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees", dokaan?.id],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const response = await axios.get(`${baseUrl}/employee?shopId=${dokaan?.id}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      return response.data.data;
    },
    enabled: !!dokaan?.id,
  });

//   console.log(employees);
  const activeEmployees = employees.filter((emp) => emp.workStatus === "active");
  const inactiveEmployees = employees.filter((emp) => emp.workStatus !== "active");

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
          <StatCard name="Total Employees" icon={Users} value={employees.length} color="#6366F1" />
          <StatCard name="Active" icon={Users} value={activeEmployees.length} color="#10B981" />
          <StatCard name="Inactive" icon={Users} value={inactiveEmployees.length} color="#EF4444" />
        </motion.div>

        {/* Table */}
        <EmployeeTable employees={employees} loading={isLoading} />
      </main>
    </div>
  );
};

export default EmployeePage;
