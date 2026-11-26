import { Link } from "react-router-dom";
import { Plus, TrendingUp } from "lucide-react";
import ExpenseTable from "../../../components/dashBoard/home/expense/ExpenseTable";
import FixedCostList from "../../../components/dashBoard/home/expense/FixedCostList";
import { useLanguage } from "../../../contexts/LanguageContext";

const ExpensePage = () => {
  const { pick } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto p-1 sm:p-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {pick("Expenses & Bills", "খরচ ও মাসিক বিল")}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {pick(
              "Track monthly fixed bills (rent, electricity) and daily expenses easily.",
              "মাসিক ভাড়া, বিদ্যুৎ বিল ও প্রতিদিনের খরচ সহজে হিসাব রাখুন।"
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex gap-2.5">
          <Link
            to="/dashboard/add-expense"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
          >
            <Plus size={16} />
            {pick("Add Expense", "খরচ লিখুন")}
          </Link>
          <Link
            to="/dashboard/income"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
          >
            <TrendingUp size={16} />
            {pick("Add Income", "আয় লিখুন")}
          </Link>
        </div>
      </div>

      <FixedCostList />
      <ExpenseTable />
    </div>
  );
};

export default ExpensePage;
