// src/components/dashBoard/home/employees/EmployeesTable.jsx

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";

const EmployeesTable = ({ employees }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
console.log(employees);
  const filteredEmployees = employees
    ? employees.filter(
        (emp) =>
          emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.shopRole?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <motion.div
      className="bg-white dark:bg-black bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 mb-10 mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-black dark:text-white">
          Employee List
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="bg-red-400 dark:bg-gray-400 text-white placeholder-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            value={searchTerm}
          />
          <Search
            className="absolute left-3 top-2.5 text-black dark:text-white"
            size={18}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              {["Name", "Email", "Role", "Salary", "Work Days", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {paginatedEmployees.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-gray-500 dark:text-gray-400 py-8"
                >
                  No employees found.
                </td>
              </tr>
            ) : (
              paginatedEmployees.map((emp) => (
                <motion.tr
                  key={emp.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 text-sm font-medium text-black dark:text-white">
                    {emp.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-black dark:text-white">
                    {emp.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-black dark:text-white">
                    {emp.shopRole || "Employee"}
                  </td>
                  <td className="px-6 py-4 text-sm text-black dark:text-white">
                    {emp.salary ? `৳ ${emp.salary}` : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-black dark:text-white">
                    {emp.workDays || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-black dark:text-white">
                    {emp.workStatus || "Inactive"}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredEmployees.length > itemsPerPage && (
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-2 rounded-md ${
              currentPage === 1
                ? "bg-gray-300 text-gray-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>
          <span className="text-black dark:text-white items-center justify-center flex gap-2 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default EmployeesTable;
