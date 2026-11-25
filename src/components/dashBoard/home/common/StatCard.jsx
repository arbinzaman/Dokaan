const StatCard = ({ name, icon: Icon, value, subtext, color, onClick }) => {
  const safeColor = color || "#6366F1";
  const interactiveProps = onClick
    ? {
        role: "button",
        tabIndex: 0,
        onClick,
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick(e);
          }
        },
      }
    : {};

  return (
    <div
      {...interactiveProps}
      className={`bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 p-4 transition-all ${
        onClick
          ? "cursor-pointer hover:shadow-lg hover:border-indigo-400 dark:hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          : ""
      }`}
    >
      <div className="flex items-center space-x-4">
        {Icon && (
          <div
            className="flex-shrink-0 p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800"
            style={{ color: safeColor }}
          >
            <Icon size={24} />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
            {name}
          </p>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white truncate">
            {value}
          </h3>
          {subtext && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {subtext}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
