import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import ExpenseTable from "../../../components/dashBoard/home/expense/ExpenseTable";
import FixedCostList from "../../../components/dashBoard/home/expense/FixedCostList";

const ExpensePage = () => {
  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Expenses &amp; Costs
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage recurring fixed costs and day-to-day operational expenses.
          </p>
        </div>

        <Link
          to="/dashboard/add-expense"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm transition-colors"
        >
          <Plus size={16} />
          Add Variable Expense
        </Link>
      </div>

      <FixedCostList />
      <ExpenseTable />
    </div>
  );
};

export default ExpensePage;
