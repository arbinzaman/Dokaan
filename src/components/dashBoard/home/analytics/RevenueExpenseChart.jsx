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
      <div className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md p-3 shadow-lg text-sm">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className="text-gray-700 dark:text-gray-200"
            style={{ color: entry.color }}
          >
            {entry.name}: ৳{entry.value.toLocaleString()}
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
    Revenue: val.totalRevenue,
    Expense: val.totalExpense,
    Profit: val.netProfit,
  }));

  console.log(data, chartData);
  return (
    <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-xl p-6 mb-8 border border-gray-200 dark:border-zinc-700 mt-10">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white tracking-tight">
        📊 Revenue, Expenses & Profit
      </h3>

      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={chartData} barCategoryGap={16}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
          <XAxis dataKey="date" stroke="#888" tick={{ fill: "#888" }} />
          <YAxis stroke="#888" tick={{ fill: "#888" }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: "10px",
              color: "#333",
            }}
          />
          <Bar
            dataKey="Revenue"
            fill="#22C55E"
            radius={[8, 8, 0, 0]}
            stroke="#16A34A"
            strokeWidth={1.5}
          />
          <Bar
            dataKey="Expense"
            fill="#EF4444"
            radius={[8, 8, 0, 0]}
            stroke="#DC2626"
            strokeWidth={1.5}
          />
          <Bar
            dataKey="Profit"
            fill="#3B82F6"
            radius={[8, 8, 0, 0]}
            stroke="#2563EB"
            strokeWidth={1.5}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueExpenseChart;
