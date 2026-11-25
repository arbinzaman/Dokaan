import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-lg text-sm">
        <p className="font-semibold text-gray-900 dark:text-white mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="font-medium">
            {entry.name}: ৳{Number(entry.value ?? 0).toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const RevenueExpenseChart = ({ data }) => {
  const chartData = Object.entries(data || {}).map(([key, val]) => ({
    date: key,
    Revenue: Number(val?.totalRevenue ?? 0),
    Expense: Number(val?.totalExpense ?? val?.totalExpenses ?? 0),
    Profit: Number(val?.netProfit ?? 0),
  }));

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 mb-8 border border-gray-200 dark:border-gray-800 mt-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Revenue, Expenses &amp; Profit
      </h3>

      {chartData.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
          No chart data available for the selected timeframe.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={chartData} barCategoryGap={16}>
            <CartesianGrid strokeDasharray="3 3" stroke="#9CA3AF" strokeOpacity={0.2} />
            <XAxis dataKey="date" stroke="#6B7280" tick={{ fill: "#6B7280", fontSize: 12 }} />
            <YAxis stroke="#6B7280" tick={{ fill: "#6B7280", fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: "10px" }} />
            <Bar dataKey="Revenue" fill="#10B981" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Expense" fill="#EF4444" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Profit" fill="#6366F1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RevenueExpenseChart;
