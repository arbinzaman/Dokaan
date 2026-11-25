import { useEffect } from "react";
import { BarChart2, Menu, ScanLine, Box, Diff, X, UserCog } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import ThemeToggleButton from "../../../../shared/Theme/ThemeToggleButton";
import { useUser } from "../../../../../contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

const MobileSidebar = ({
  sidebarItems = [],
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const { savedShop, dokaan, selectShop, user } = useUser();
  const location = useLocation();
  const queryClient = useQueryClient();
  const normalizedPath = location.pathname.replace(/\/+$/, "");

  const handleItemClick = () => setIsMobileMenuOpen(false);
  const otherDokaans = Array.isArray(dokaan)
    ? dokaan.filter((d) => d?.id !== savedShop?.id)
    : [];

  const role = user?.role;
  const isAdmin = role === "admin";
  const isShopOwner = role === "shop-owner";

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    if (isMobileMenuOpen) {
      window.addEventListener("keydown", onKeyDown);
    }
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  return (
    <>
      {/* Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 flex justify-around items-center px-3 py-1 z-40 h-16 no-print">
        {isAdmin ? (
          <Link
            to="/dashboard/users"
            aria-label="Users"
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <UserCog size={24} className="text-purple-500" />
          </Link>
        ) : (
          <>
            {isShopOwner && (
              <Link
                to="/dashboard"
                aria-label="Overview"
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <BarChart2 size={24} className="text-indigo-500" />
              </Link>
            )}
            <Link
              to="/dashboard/inventory"
              aria-label="Inventory"
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Box size={24} className="text-amber-500" />
            </Link>
            <Link
              to="/dashboard/product-sell"
              aria-label="POS Sale"
              className="p-3.5 -mt-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transition-colors"
            >
              <ScanLine size={24} />
            </Link>
            {isShopOwner && (
              <Link
                to="/dashboard/add-expense"
                aria-label="Add Expense"
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Diff size={24} className="text-rose-500" />
              </Link>
            )}
          </>
        )}

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu size={24} className="text-gray-700 dark:text-gray-200" />
        </button>
      </div>

      {/* Drawer Backdrop + Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleItemClick}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-xs z-40"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.2 }}
              className="lg:hidden fixed top-0 left-0 w-72 h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-800 z-50 p-4 overflow-y-auto flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-lg">Menu</span>
                <button
                  type="button"
                  onClick={handleItemClick}
                  aria-label="Close navigation menu"
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Current Shop Display & Switch Shop - Only for Shop Owner */}
              {isShopOwner && savedShop && (
                <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                  <div className="mb-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-xl">
                    <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-0.5">
                      Current Shop
                    </p>
                    <p className="text-sm font-semibold truncate">
                      {savedShop.dokaan_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {savedShop.dokaan_location}
                    </p>
                  </div>

                  {otherDokaans.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Switch Shop
                      </h4>
                      <div className="space-y-1.5">
                        {otherDokaans.map((shop) => (
                          <button
                            type="button"
                            key={shop.id}
                            onClick={() => {
                              selectShop(shop);
                              queryClient.invalidateQueries();
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full text-left p-2.5 text-sm bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                          >
                            <div className="font-medium truncate">
                              {shop.dokaan_name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {shop.dokaan_location}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Unified Role-Based Navigation */}
              <nav className="space-y-1 flex-grow">
                {sidebarItems.map((item) => {
                  const isActive = normalizedPath === item.href;
                  return (
                    <Link
                      key={item.id}
                      to={item.href}
                      onClick={handleItemClick}
                      className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <item.icon
                        size={20}
                        style={{ color: isActive ? undefined : item.color }}
                      />
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Theme Toggle */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-center">
                <ThemeToggleButton />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileSidebar;
