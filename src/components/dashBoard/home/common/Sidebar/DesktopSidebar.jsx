import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import DokaanProfile from "../../../../dashBoard/Profile/DokaanProfile";
import dokaanLogoDark from "../../../../../assets/Home/logos/DOKAAN.png";
import dokaanLogoLight from "../../../../../assets/Home/logos/Dokaan_White.png";
import { useUser } from "../../../../../contexts/AuthContext"; // 🔁 Make sure this path is correct

const DesktopSidebar = ({ sidebarItems, isSidebarOpen, setIsSidebarOpen }) => {
  const { user } = useUser(); // 🧠 Get user info
  const iconSize = isSidebarOpen ? 20 : 28;

  return (
    <motion.div
      className={`hidden lg:flex flex-col h-full bg-red-400 dark:bg-gray-800 text-white p-4 border-r overflow-y-auto
        ${isSidebarOpen ? "w-64" : "w-16"}`}
      animate={{ width: isSidebarOpen ? 256 : 64 }}
    >
      {/* Hamburger Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="p-2 rounded-full hover:bg-gray-700 max-w-fit mb-4"
      >
        <Menu size={iconSize} />
      </motion.button>

      {/* Dokaan Profile: only visible if sidebar is open and NOT employee */}
      {isSidebarOpen && user?.role !== "employee" && <DokaanProfile />}

      {/* Navigation Links */}
      <nav className="mt-4 flex-grow">
        {sidebarItems.map((item) => (
          <Link
            key={item.id}
            to={item.href || "#"}
            className={`flex items-center p-3 rounded-lg mb-2 hover:bg-gray-700
              ${isSidebarOpen ? "justify-start" : "justify-center"}`}
          >
            <item.icon size={iconSize} color={item.color} />
            {isSidebarOpen && <span className="ml-4 text-sm">{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Bottom Logos */}
      <div className="mt-4 mb-6 flex flex-col items-center">
        <img
          src={dokaanLogoLight}
          alt="Light Logo"
          className="w-28 dark:hidden"
        />
        <img
          src={dokaanLogoDark}
          alt="Dark Logo"
          className="w-28 hidden dark:block"
        />
      </div>
    </motion.div>
  );
};

export default DesktopSidebar;
