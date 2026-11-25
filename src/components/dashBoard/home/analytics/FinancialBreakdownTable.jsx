const FinancialBreakdownTable = ({ revenueBreakdown, expenseBreakdown }) => {
  const revenueEntries = Object.entries(revenueBreakdown || {});
  const expenseEntries = Object.entries(expenseBreakdown || {});

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Detailed Breakdown
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider mb-3 text-emerald-600 dark:text-emerald-400">
            Revenue
          </h4>
          {revenueEntries.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No revenue entries for this period.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {revenueEntries.map(([key, value]) => (
                <li
                  key={key}
                  className="flex justify-between bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/60 px-3.5 py-2.5 rounded-xl"
                >
                  <span className="capitalize text-gray-700 dark:text-gray-200">
                    {key}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ৳{Number(value ?? 0).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider mb-3 text-rose-600 dark:text-rose-400">
            Expenses
          </h4>
          {expenseEntries.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No expense entries for this period.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {expenseEntries.map(([key, value]) => (
                <li
                  key={key}
                  className="flex justify-between bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/60 px-3.5 py-2.5 rounded-xl"
                >
                  <span className="capitalize text-gray-700 dark:text-gray-200">
                    {key}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ৳{Number(value ?? 0).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialBreakdownTable;
