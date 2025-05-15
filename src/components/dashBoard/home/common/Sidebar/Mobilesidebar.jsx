import {
  BarChart2,
  DollarSign,
  Menu,
  ShoppingBag,
  TrendingUp,
  Users,
  ShoppingCart,
  ScanLine,
  User,
  Box, // Inventory icon
} from "lucide-react";
import ThemeToggleButton from "../../../../shared/Theme/ThemeToggleButton";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const MobileSidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const handleItemClick = () => {
    setIsMobileMenuOpen(false); // Close drawer on item click
  };

  return (
    <>
      {/* Mobile Sticky Bottom Bar (Height Reduced) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-red-400 dark:bg-gray-900 text-white flex justify-around items-center px-4 py-1 z-50 h-14">
        {/* Overview Button */}
        <Link
          to="/dashboard"
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <BarChart2 size={26} style={{ color: "#6366f1" }} />
        </Link>

        {/* Inventory Button (Newly Added) */}
        <Link
          to="/dashboard/inventory"
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <Box size={26} style={{ color: "#FF9900" }} />
        </Link>

        {/* Scan Button (Updated Background) */}
        <Link to="/dashboard/product-sell">
          <button className="p-4 mb-3 bg-gray-300 dark:bg-gray-500 rounded-full shadow-lg hover:bg-blue-600 dark:hover:bg-blue-800 transition-colors">
            <ScanLine size={32} className="text-white" />
          </button>
        </Link>

        {/* Analytics Button */}
        <Link
          to="/dashboard/analytics"
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <TrendingUp size={26} style={{ color: "#3B82F6" }} />
        </Link>

        {/* Menu Button (Opens/Closes Drawer) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <Menu size={26} style={{ color: "#6EE7B7" }} />
        </button>
      </div>

      {/* Sidebar Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-64 h-full bg-red-400 dark:bg-gray-900 text-white z-50 flex flex-col p-4 shadow-lg"
          >
            {/* Close Button (Same Menu Button) */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="self-end p-2 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>

            {/* Profile Section */}
            <div className="flex items-center space-x-4 p-4 border-b border-gray-700">
              <User size={28} className="text-white" />
              <Link
                to="/dashboard/settings"
                className="text-white text-sm font-medium hover:underline"
                onClick={handleItemClick}
              >
                Profile
              </Link>
            </div>

            {/* Navigation Items (Drawer) */}
            <nav className="mt-4 flex-1">
              <Link
                to="/dashboard/users"
                className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                onClick={handleItemClick}
              >
                <Users
                  size={24}
                  style={{ color: "#EC4899" }}
                  className="min-w-[24px]"
                />
                <span className="ml-4">Users</span>
              </Link>

              <Link
                to="/dashboard/products"
                className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                onClick={handleItemClick}
              >
                <ShoppingBag
                  size={24}
                  style={{ color: "#8B5CF6" }}
                  className="min-w-[24px]"
                />
                <span className="ml-4">Products</span>
              </Link>
              <Link
                to="/dashboard/customers"
                className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                onClick={handleItemClick}
              >
                <Users
                  size={24}
                  style={{ color: "#8B5CF6" }}
                  className="min-w-[24px]"
                />
                <span className="ml-4">Customers</span>
              </Link>


              <Link
                to="/dashboard/sales"
                className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                onClick={handleItemClick}
              >
                <DollarSign
                  size={24}
                  style={{ color: "#10B981" }}
                  className="min-w-[24px]"
                />
                <span className="ml-4">Sales</span>
              </Link>

              <Link
                to="/dashboard/orders"
                className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                onClick={handleItemClick}
              >
                <ShoppingCart
                  size={24}
                  style={{ color: "#F59E0B" }}
                  className="min-w-[24px]"
                />
                <span className="ml-4">Orders</span>
              </Link>
            </nav>

            {/* Theme Toggle Button */}
            <ThemeToggleButton />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileSidebar;
