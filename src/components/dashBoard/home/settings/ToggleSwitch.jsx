const ToggleSwitch = ({ label, isOn, onToggle }) => {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-gray-800 dark:text-gray-200">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={Boolean(isOn)}
        aria-label={label}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          isOn ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-700"
        }`}
        onClick={onToggle}
      >
        <span
          className={`inline-block size-4 transform transition-transform bg-white rounded-full shadow-xs ${
            isOn ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
