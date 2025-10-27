const StatCard = ({ name, icon: Icon, value, subtext, color }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4">
      <div className="flex items-center space-x-4">
        <div
          style={{
            color: color,
            filter: `drop-shadow(0 0 5px ${color}) drop-shadow(0 0 10px ${color})`,
          }}
        >
          <Icon size={28} />
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: color }}>
            {name}
          </p>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {value}
          </h3>
          {subtext && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {subtext}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
