const options = ["day", "week", "month", "year"];
import { format } from "date-fns";

const TimeFilterControls = ({ type, setType, selectedDate, setSelectedDate }) => {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              type === option ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setType(option)}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      <input
        type="date"
        value={format(selectedDate, "yyyy-MM-dd")}
        onChange={(e) => setSelectedDate(new Date(e.target.value))}
        className="px-3 py-2 rounded bg-gray-100 dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-600"
      />
    </div>
  );
};

export default TimeFilterControls;
