import { FaMoneyBill, FaWallet, FaPiggyBank } from "react-icons/fa6";

const SummaryCard = ({ label, value, Icon, accent }) => (
  <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
        {label}
      </p>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
        ৳{Number(value ?? 0).toLocaleString()}
      </h3>
    </div>
    <div className={`p-3 rounded-xl ${accent}`}>
      <Icon className="text-2xl" />
    </div>
  </div>
);

const FinancialStats = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
      <SummaryCard
        label="Total Revenue"
        value={summary.totalRevenue}
        Icon={FaMoneyBill}
        accent="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
      />
      <SummaryCard
        label="Total Expenses"
        value={summary.totalExpenses}
        Icon={FaWallet}
        accent="bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
      />
      <SummaryCard
        label="Net Profit"
        value={summary.netProfit}
        Icon={FaPiggyBank}
        accent="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
      />
    </div>
  );
};

export default FinancialStats;
