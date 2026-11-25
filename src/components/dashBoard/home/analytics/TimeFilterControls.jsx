import { format, isValid } from "date-fns";

const options = ["day", "week", "month", "year"];

const TimeFilterControls = ({ type, setType, selectedDate, setSelectedDate }) => {
  const safeDate = isValid(selectedDate) ? selectedDate : new Date();

  const handleDateChange = (e) => {
    const val = e.target.value;
    if (!val) {
      setSelectedDate(new Date());
      return;
    }
    const [y, m, d] = val.split("-").map(Number);
    const parsed = new Date(y, (m || 1) - 1, d || 1);
    if (isValid(parsed)) {
      setSelectedDate(parsed);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              type === option
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            onClick={() => setType(option)}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      <input
        type="date"
        value={format(safeDate, "yyyy-MM-dd")}
        onChange={handleDateChange}
        className="px-3 py-2 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
};

export default TimeFilterControls;
