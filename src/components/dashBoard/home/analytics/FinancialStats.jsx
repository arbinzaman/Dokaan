import { FaMoneyBill, FaWallet, FaPiggyBank } from "react-icons/fa6";

const StatCard = ({ label, value, Icon, color, glow }) => (
  <div
    className={`p-6 rounded-xl border border-opacity-20 backdrop-blur-lg shadow-lg 
      transition-all duration-300 relative overflow-hidden group 
      ${color.bg} ${color.border} dark:text-white text-gray-900`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold opacity-70 mb-1">{label}</p>
        <h3 className="text-2xl font-bold tracking-wide">
          ৳{value?.toLocaleString()}
        </h3>
      </div>
      <Icon className={`text-4xl opacity-30 group-hover:scale-110 transition-transform`} />
    </div>
    {/* Neon glow ring effect */}
    <div
      className={`absolute -bottom-4 -right-4 w-20 h-20 blur-xl opacity-30 rounded-full ${glow}`}
    ></div>
  </div>
);

const FinancialStats = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatCard
        label="Total Revenue"
        value={summary.totalRevenue}
        Icon={FaMoneyBill}
        color={{ bg: "bg-white dark:bg-[#1e1e1e]", border: "border-green-500" }}
        glow="bg-green-400"
      />
      <StatCard
        label="Total Expenses"
        value={summary.totalExpenses}
        Icon={FaWallet}
        color={{ bg: "bg-white dark:bg-[#1e1e1e]", border: "border-red-500" }}
        glow="bg-red-400"
      />
      <StatCard
        label="Net Profit"
        value={summary.netProfit}
        Icon={FaPiggyBank}
        color={{ bg: "bg-white dark:bg-[#1e1e1e]", border: "border-blue-500" }}
        glow="bg-blue-400"
      />
    </div>
  );
};

export default FinancialStats;
