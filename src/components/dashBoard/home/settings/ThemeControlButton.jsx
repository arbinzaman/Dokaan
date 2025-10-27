import { motion } from "framer-motion";
import { DarkMode, LightMode } from "@mui/icons-material"; // Icons for light and dark modes
import { useThemeMode } from "../../../../contexts/ThemeContext";

const ThemeControlButton = () => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <motion.div
      className="bg-lime-900 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-lime-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center mb-4">
        {mode === "light" ? (
          <DarkMode className="text-blue-400 mr-3" size={24} />
        ) : (
          <LightMode className="text-blue-400 mr-3" size={24} />
        )}
        <h2 className="text-xl font-semibold text-gray-100">
          Theme Control
        </h2>
      </div>
      <p className="text-white mb-4">
        Switch between light and dark modes for a better experience.
      </p>
      <button
        onClick={toggleTheme}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
      >
        {mode === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
      </button>
    </motion.div>
  );
};

export default ThemeControlButton;
