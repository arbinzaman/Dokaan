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

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees", savedShop?.id],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const response = await axios.get(
        `${baseUrl}/employee?shopId=${savedShop?.id}`,
        {
          headers: token ? { Authorization: `${token}` } : undefined,
        }
      );
      return Array.isArray(response.data?.data) ? response.data.data : [];
    },
    enabled: !!savedShop?.id,
  });

  const safeEmployees = Array.isArray(employees) ? employees : [];
  const activeEmployees = safeEmployees.filter(
    (emp) => emp?.workStatus?.toLowerCase() === "active"
  );
  const inactiveEmployees = safeEmployees.filter(
    (emp) => emp?.workStatus?.toLowerCase() !== "active"
  );

  return (
    <div className="flex-1 overflow-auto relative z-10 mb-10">
      <main className="max-w-7xl mx-auto py-4 px-2 sm:px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Employees
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage staff schedules, roles, and payroll.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium shadow-sm hover:bg-indigo-700 transition-colors"
            onClick={() => navigate("/dashboard/add-a-employee")}
          >
            + Add Employee
          </button>
        </div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <StatCard
            name="Total Employees"
            icon={Users}
            value={isLoading ? "..." : safeEmployees.length}
            color="#6366F1"
          />
          <StatCard
            name="Active"
            icon={Users}
            value={isLoading ? "..." : activeEmployees.length}
            color="#10B981"
          />
          <StatCard
            name="Inactive"
            icon={Users}
            value={isLoading ? "..." : inactiveEmployees.length}
            color="#EF4444"
          />
        </motion.div>

        {/* Table */}
        <EmployeeTable employees={safeEmployees} loading={isLoading} />
      </main>
    </div>
  );
};

export default EmployeePage;
