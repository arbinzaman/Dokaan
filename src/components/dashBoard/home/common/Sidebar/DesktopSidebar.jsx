// DesktopSidebar component
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import DokaanProfile from "../../../../dashBoard/Profile/DokaanProfile";
import ThemeToggleButton from "../../../../shared/Theme/ThemeToggleButton";
import dokaanLogo from "../../../../../assets/Home/logos/DOKAAN.png"; // Ensure this path is correct

const DesktopSidebar = ({
  sidebarItems,
  isSidebarOpen,
  setIsSidebarOpen,
  dokaan,
}) => {
  return (
    <motion.div
      className={`hidden lg:flex flex-col h-full bg-red-400 dark:bg-gray-800 text-white dark:text-white p-4 border-r border-gray-300 dark:border-gray-700 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
      >
        <Menu size={24} />
      </motion.button>

      {dokaan &&
        (isSidebarOpen ? <DokaanProfile /> : <Link to="dokaanProfile" />)}

      <nav className="mt-4 flex-grow">
        {sidebarItems.map((item) => (
          <Link
            key={item.id}
            to={item.href || "#"}
            className={`flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2 ${
              isSidebarOpen ? "justify-start" : "justify-center"
            }`}
          >
            <item.icon
              size={20}
              style={{ color: item.color, minWidth: "20px" }}
            />
            {isSidebarOpen && <span className="ml-4">{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Logo Section */}
      <div className="flex justify-center mt-4 mb-6">
        <img
          src={dokaanLogo}
          alt="Logo"
          className="h-16 w-16 object-contain" // Adjust the size or use other properties like object-contain to fit
        />
      </div>

      <ThemeToggleButton />
    </motion.div>
  );
};

export default DesktopSidebar;
