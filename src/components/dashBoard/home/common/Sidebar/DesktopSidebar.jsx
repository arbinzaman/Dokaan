import { Menu,  } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import DokaanProfile from "../../../../dashBoard/Profile/DokaanProfile";
import dokaanLogoDark from "../../../../../assets/Home/logos/DOKAAN.png";
import dokaanLogoLight from "../../../../../assets/Home/logos/Dokaan_White.png";

const DesktopSidebar = ({ sidebarItems, isSidebarOpen, setIsSidebarOpen, dokaan }) => {
  return (
    <motion.div
      className={`hidden lg:flex flex-col h-full bg-red-400 dark:bg-gray-800 text-white p-4 border-r border-gray-300 dark:border-gray-700 overflow-y-auto ${
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

      {dokaan && (isSidebarOpen ? <DokaanProfile /> : <Link to="dokaanProfile" />)}

      <nav className="mt-4 flex-grow">
        {sidebarItems.map((item) => (
          <Link
            key={item.id}
            to={item.href || "#"}
            className={`flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2 ${
              isSidebarOpen ? "justify-start" : "justify-center"
            }`}
          >
            <item.icon size={20} style={{ color: item.color }} />
            {isSidebarOpen && <span className="ml-4">{item.name}</span>}
          </Link>
        ))}
      </nav>

      <div className="flex justify-center mt-4 mb-6">
        <img src={dokaanLogoLight} alt="Light Logo" className="w-28 object-contain block dark:hidden" />
        <img src={dokaanLogoDark} alt="Dark Logo" className="w-28 object-contain hidden dark:block" />
      </div>
    </motion.div>
  );
};

export default DesktopSidebar;
