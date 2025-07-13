import { Link } from "react-router-dom";
import { LineChart } from "lucide-react";
import ExpenseTable from "../../../components/dashBoard/home/expense/ExpenseTable";
import FixedCostList from "../../../components/dashBoard/home/expense/FixedCostList";

const ExpensePage = () => {
  return (
    <div className="p-4 space-y-4">
      <FixedCostList />
      {/* Header section with Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Expense List
        </h2>

        <Link to="/dashboard/add-expense">
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 via-violet-500 to-yellow-500 text-white font-medium rounded-lg shadow hover:brightness-110 transition">
            <LineChart className="w-4 h-5" />
            <span className="hidden sm:inline">Add Variable Cost</span>
          </button>
        </Link>
      </div>

      {/* Expense Table */}
      <ExpenseTable />
    </div>
  );
};

export default ExpensePage;
