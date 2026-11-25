import { motion } from "framer-motion";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useThemeMode } from "../../../../contexts/ThemeContext";

const ThemeControlButton = () => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 shadow-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-800 mb-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center mb-3">
        {mode === "light" ? (
          <DarkMode className="text-indigo-500 mr-3" fontSize="medium" />
        ) : (
          <LightMode className="text-amber-400 mr-3" fontSize="medium" />
        )}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Appearance
        </h2>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Switch between light and dark modes for comfortable viewing.
      </p>
      <button
        type="button"
        onClick={toggleTheme}
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-4 rounded-xl transition-colors"
      >
        {mode === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
      </button>
    </motion.div>
  );
};

export default ThemeControlButton;
