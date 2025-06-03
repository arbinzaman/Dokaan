import {
  BarChart2,
  Menu,
  ShoppingBag,
  TrendingUp,
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
import { useUser } from "../../../../../contexts/AuthContext";

const MobileSidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { savedShop, dokaan, setSavedShop, user } = useUser();
  const handleItemClick = () => setIsMobileMenuOpen(false);
  const otherDokaans = Array.isArray(dokaan)
    ? dokaan.filter((d) => d.id !== savedShop?.id)
    : [];

  const role = user?.role;

  const isAdmin = role === "admin";
  const isEmployee = role === "employee";
  const isShopOwner = role === "shop-owner";

  return (
    <>
      {/* Bottom Bar */}
      {!isAdmin && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-red-400 dark:bg-gray-900 text-white flex justify-around items-center px-4 py-1 z-50 h-14">
          <Link to="/dashboard" className="p-2 rounded-full hover:bg-gray-700">
            <BarChart2 size={26} style={{ color: "#6366f1" }} />
          </Link>
          <Link
            to="/dashboard/inventory"
            className="p-2 rounded-full hover:bg-gray-700"
          >
            <Box size={26} style={{ color: "#FF9900" }} />
          </Link>
          <Link to="/dashboard/product-sell">
            <button className="p-4 mb-3 bg-gray-300 dark:bg-gray-500 rounded-full shadow-lg">
              <ScanLine size={32} className="text-white" />
            </button>
          </Link>
          <Link
            to="/dashboard/analytics"
            className="p-2 rounded-full hover:bg-gray-700"
          >
            <TrendingUp size={26} style={{ color: "#3B82F6" }} />
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-full hover:bg-gray-700"
          >
            <Menu size={26} style={{ color: "#6EE7B7" }} />
          </button>
        </div>
      )}

      {/* Sidebar Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="fixed top-0 left-0 w-64 h-full bg-red-400 dark:bg-gray-900 text-white z-50 p-4 overflow-y-auto"
          >
            <button
              onClick={handleItemClick}
              className="self-end p-2 text-white text-xl"
            >
              ✕
            </button>

            {/* Current Shop Display & Switch Shop - Only for Shop Owner */}
            {isShopOwner && savedShop && (
              <>
                <div className="mb-4 bg-white/20 p-3 rounded-lg">
                  <p className="text-xs uppercase text-white/70 mb-1">
                    Current Shop
                  </p>
                  <p className="text-base font-bold">{savedShop.dokaan_name}</p>
                  <p className="text-sm text-white/70">
                    {savedShop.dokaan_location}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm mb-2 text-white/80">Switch Shop</h4>
                  {otherDokaans?.length > 0 ? (
                    otherDokaans.map((shop) => (
                      <button
                        key={shop.id}
                        onClick={() => {
                          setSavedShop(shop);
                          setIsMobileMenuOpen(false);
                          window.location.reload();
                        }}
                        className="w-full text-left p-2 mb-2 text-sm bg-white/10 hover:bg-white/20 rounded"
                      >
                        <div className="font-semibold">{shop.dokaan_name}</div>
                        <div className="text-xs text-white/70 truncate">
                          {shop.dokaan_location}
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-white/60">No other shops</p>
                  )}
                </div>
              </>
            )}

            {/* Navigation */}
            <nav className="space-y-2">
              {isAdmin && (
                <SidebarLink
                  to="/dashboard/users"
                  icon={UserCog}
                  label="Users"
                  color="#C084FC"
                  onClick={handleItemClick}
                />
              )}

              {isShopOwner && (
                <>
                  <SidebarLink
                    to="/dashboard/products"
                    icon={ShoppingBag}
                    label="Products"
                    color="#8B5CF6"
                    onClick={handleItemClick}
                  />
                  <SidebarLink
                    to="/dashboard/shop"
                    icon={ShoppingBag}
                    label="Shops"
                    color="#A3E635"
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
                  <SidebarLink
                    to="/dashboard/expense"
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
                  <SidebarLink
                    to="/dashboard/settings"
                    icon={UserCog}
                    label="Settings"
                    color="#FACC15"
                    onClick={handleItemClick}
                  />
                </>
              )}

              {isEmployee && (
                <>
                  <SidebarLink
                    to="/dashboard/inventory"
                    icon={Box}
                    label="Inventory"
                    color="#FF9900"
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
                  <SidebarLink
                    to="/dashboard/memos"
                    icon={FileText}
                    label="Memos"
                    color="#F97316"
                    onClick={handleItemClick}
                  />
                  <SidebarLink
                    to="/dashboard/settings"
                    icon={UserCog}
                    label="Settings"
                    color="#FACC15"
                    onClick={handleItemClick}
                  />
                </>
              )}
            </nav>

            {/* Theme Toggle - Always visible */}
            <div className="mt-6">
              <ThemeToggleButton />
            </div>
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
    className="flex items-center p-2 rounded-lg hover:bg-gray-700"
  >
    <Icon size={24} style={{ color }} />
    <span className="ml-3">{label}</span>
  </Link>
);

export default MobileSidebar;
