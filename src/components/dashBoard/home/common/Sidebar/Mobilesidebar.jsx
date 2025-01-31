// import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import ThemeToggleButton from "../../../../shared/Theme/ThemeToggleButton";

const MobileSidebar = ({ sidebarItems, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const handleItemClick = (id) => {
    if (id === "settings") {
      setIsMobileMenuOpen((prev) => !prev); // ✅ Toggles the drawer on Settings click
    } else {
      setIsMobileMenuOpen(false); // ✅ Closes for other items
    }
  };

  return (
    <>
      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-red-500 dark:bg-gray-900 text-white flex justify-between items-center px-4 py-2 z-50">
        <div className="flex items-center space-x-4">
          {sidebarItems.map((item) => (
            <Link
              key={item.id}
              to={item.href || "#"}
              onClick={() => handleItemClick(item.id)}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              <item.icon size={24} style={{ color: item.color }} />
            </Link>
          ))}
        </div>

        {/* Sidebar Toggle Button */}
        {/* <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <Menu size={24} />
        </motion.button> */}
        
      </div>

      {/* Sidebar Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-64 h-full bg-red-500 dark:bg-gray-900 text-white z-50 flex flex-col p-4 shadow-lg"
            style={{
              backdropFilter: "none", // ✅ Ensures no blur
              WebkitBackdropFilter: "none",
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="self-end p-2 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>

            {/* Navigation Items */}
            <nav className="mt-4">
              {sidebarItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.href || "#"}
                  className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2"
                  onClick={() => handleItemClick(item.id)}
                >
                  <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                  <span className="ml-4">{item.name}</span>
                </Link>
              ))}
            </nav>

            <ThemeToggleButton />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileSidebar;
