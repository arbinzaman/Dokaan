import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useThemeMode } from "../../../contexts/ThemeContext";

const ThemeToggleButton = () => {
  const { mode, toggleTheme } = useThemeMode();

  const bgGradient =
    mode === "light"
      ? "bg-gradient-to-r from-yellow-400 via-orange-300 to-yellow-500 shadow-[0_0_12px_#f59e0b]"
      : "bg-gradient-to-r from-indigo-700 via-purple-800 to-indigo-900 shadow-[0_0_12px_#6366f1]";

  const labelColorLight = "text-yellow-300";
  const labelColorDark = "text-indigo-300";

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.95 }}
      className={`relative w-28 h-10 rounded-full p-1 transition ${bgGradient}`}
    >
      <motion.div
        className="absolute top-1 left-1 w-12 h-8 rounded-full bg-white flex items-center justify-center shadow-md transition-colors"
        animate={{ x: mode === "light" ? 0 : 64 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {mode === "light" ? (
          <Sun className="text-yellow-500" size={20} />
        ) : (
          <Moon className="text-indigo-700" size={20} />
        )}
      </motion.div>

      <div className="flex justify-between items-center h-full px-3 text-xs font-semibold text-white">
        <span
          className={
            mode === "light" ? "opacity-100 " + labelColorLight : "opacity-60"
          }
        >
          Light
        </span>
        <span
          className={
            mode === "dark" ? "opacity-100 " + labelColorDark : "opacity-60"
          }
        >
          Dark
        </span>
      </div>
    </motion.button>
  );
};

export default ThemeToggleButton;
