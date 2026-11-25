import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useThemeMode } from "../../../contexts/ThemeContext";

const ThemeToggleButton = () => {
  const { mode, toggleTheme } = useThemeMode();

  const bgGradient =
    mode === "light"
      ? "bg-amber-100 border border-amber-300 text-amber-900"
      : "bg-slate-800 border border-slate-700 text-slate-200";

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileTap={{ scale: 0.96 }}
      aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
      className={`relative w-24 h-9 rounded-full p-1 transition-colors ${bgGradient}`}
    >
      <motion.div
        className="absolute top-1 left-1 w-10 h-7 rounded-full bg-white dark:bg-indigo-600 flex items-center justify-center shadow-sm"
        animate={{ x: mode === "light" ? 0 : 46 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      >
        {mode === "light" ? (
          <Sun className="text-amber-500" size={16} />
        ) : (
          <Moon className="text-white" size={16} />
        )}
      </motion.div>

      <div className="relative z-10 flex justify-between items-center h-full px-2.5 text-[11px] font-semibold pointer-events-none">
        <span className={mode === "light" ? "opacity-0" : "opacity-80"}>
          Light
        </span>
        <span className={mode === "dark" ? "opacity-0" : "opacity-80"}>
          Dark
        </span>
      </div>
    </motion.button>
  );
};

export default ThemeToggleButton;
