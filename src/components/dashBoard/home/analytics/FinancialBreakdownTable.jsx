const FinancialBreakdownTable = ({ revenueBreakdown, expenseBreakdown }) => {
  return (
    <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-xl border border-opacity-20 p-6">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">🧾 Detailed Breakdown</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-md font-bold mb-2 text-green-500">Revenue</h4>
          <ul className="space-y-2 text-sm">
            {Object.entries(revenueBreakdown || {}).map(([key, value]) => (
              <li
                key={key}
                className="flex justify-between bg-green-100 dark:bg-green-900 bg-opacity-20 px-3 py-2 rounded-md"
              >
                <span className="capitalize">{key}</span>
                <span className="font-medium">৳{value.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-md font-bold mb-2 text-red-500">Expenses</h4>
          <ul className="space-y-2 text-sm">
            {Object.entries(expenseBreakdown || {}).map(([key, value]) => (
              <li
                key={key}
                className="flex justify-between bg-red-100 dark:bg-red-900 bg-opacity-20 px-3 py-2 rounded-md"
              >
                <span className="capitalize">{key}</span>
                <span className="font-medium">৳{value.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FinancialBreakdownTable;
