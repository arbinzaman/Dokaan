import {
  BarChart2,
  Menu,
  ShoppingBag,
  TrendingUp,
  // ShoppingCart,
  ScanLine,
  User,
  Box,
  FileText,
  UserCheck,
  UserCog,
  Receipt,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import ThemeToggleButton from "../../../../shared/Theme/ThemeToggleButton";

const MobileSidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const handleItemClick = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-red-400 dark:bg-gray-900 text-white flex justify-around items-center px-4 py-1 z-50 h-14">
        <Link
          to="/dashboard"
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <BarChart2 size={26} style={{ color: "#6366f1" }} />
        </Link>
        <Link
          to="/dashboard/inventory"
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <Box size={26} style={{ color: "#FF9900" }} />
        </Link>
        <Link to="/dashboard/product-sell">
          <button className="p-4 mb-3 bg-gray-300 dark:bg-gray-500 rounded-full shadow-lg hover:bg-blue-600 dark:hover:bg-blue-800 transition-colors">
            <ScanLine size={32} className="text-white" />
          </button>
        </Link>
        <Link
          to="/dashboard/analytics"
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <TrendingUp size={26} style={{ color: "#3B82F6" }} />
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <Menu size={26} style={{ color: "#6EE7B7" }} />
        </button>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-64 h-full bg-red-400 dark:bg-gray-900 text-white z-50 flex flex-col p-4 shadow-lg overflow-y-auto"
          >
            <button
              onClick={handleItemClick}
              className="self-end p-2 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>

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

            <nav className="mt-4 flex-1">
              <SidebarLink
                to="/dashboard/users"
                icon={UserCog}
                label="Users"
                color="#C084FC"
                onClick={handleItemClick}
              />
              <SidebarLink
                to="/dashboard/products"
                icon={ShoppingBag}
                label="Products"
                color="#8B5CF6"
                onClick={handleItemClick}
              />
              <SidebarLink
                to="/dashboard/customers"
                icon={UserCheck}
                label="Customers"
                color="#EC4899"
                onClick={handleItemClick}
              />
              <SidebarLink
                to="/dashboard/sales"
                icon={Receipt}
                label="Sales"
                color="#10B981"
                onClick={handleItemClick}
              />
              {/* <SidebarLink
                to="/dashboard/orders"
                icon={ShoppingCart}
                label="Orders"
                color="#F59E0B"
                onClick={handleItemClick}
              /> */}
              <SidebarLink
                to="/dashboard/expenses"
                icon={FileText}
                label="Expenses"
                color="#EF4444"
                onClick={handleItemClick}
              />
              <SidebarLink
                to="/dashboard/employee"
                icon={User}
                label="Employees"
                color="#3B82F6"
                onClick={handleItemClick}
              />
              <SidebarLink
                to="/dashboard/memos"
                icon={FileText}
                label="Memos"
                color="#F97316"
                onClick={handleItemClick}
              />
            </nav>

            <ThemeToggleButton />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const SidebarLink = ({ to, icon: Icon, label, color, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
  >
    <Icon size={24} style={{ color }} className="min-w-[24px]" />
    <span className="ml-4">{label}</span>
  </Link>
);

export default MobileSidebar;
