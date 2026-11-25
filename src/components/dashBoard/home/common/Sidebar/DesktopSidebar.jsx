import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import DokaanProfile from "../../../../dashBoard/Profile/DokaanProfile";
import dokaanLogoDark from "../../../../../assets/Home/logos/DOKAAN.png";
import dokaanLogoLight from "../../../../../assets/Home/logos/Dokaan_White.png";
import ThemeToggleButton from "../../../../shared/Theme/ThemeToggleButton";
import { useUser } from "../../../../../contexts/AuthContext";

const DesktopSidebar = ({ sidebarItems, isSidebarOpen, setIsSidebarOpen }) => {
  const { user } = useUser();
  const location = useLocation();
  const normalizedPath = location.pathname.replace(/\/+$/, "");

  return (
    <motion.aside
      className={`hidden lg:flex flex-col h-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 border-r border-gray-200 dark:border-gray-800 overflow-y-auto flex-shrink-0 ${
        isSidebarOpen ? "w-64 p-4" : "w-20 p-3"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
      transition={{ duration: 0.2 }}
    >
      {/* Toggle Button */}
      <div
        className={`flex items-center mb-4 ${
          isSidebarOpen ? "justify-between" : "justify-center"
        }`}
      >
        {isSidebarOpen && (
          <Link to="/dashboard" className="flex items-center">
            <img
              src={dokaanLogoDark}
              alt="Dokaan"
              className="w-24 dark:hidden"
            />
            <img
              src={dokaanLogoLight}
              alt="Dokaan"
              className="w-24 hidden dark:block"
            />
          </Link>
        )}
        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Dokaan Profile: only visible for shop-owner when sidebar is open */}
      {isSidebarOpen && user?.role === "shop-owner" && (
        <div className="mb-4">
          <DokaanProfile />
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-grow space-y-1">
        {sidebarItems.map((item) => {
          const isActive = normalizedPath === item.href;
          return (
            <Link
              key={item.id}
              to={item.href}
              title={!isSidebarOpen ? item.name : undefined}
              className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isSidebarOpen ? "justify-start" : "justify-center"
              } ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <item.icon
                size={20}
                style={{ color: isActive ? undefined : item.color }}
                className="flex-shrink-0"
              />
              {isSidebarOpen && <span className="ml-3 truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle */}
      {isSidebarOpen && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-center">
          <ThemeToggleButton />
        </div>
      )}
    </motion.aside>
  );
};

export default DesktopSidebar;
