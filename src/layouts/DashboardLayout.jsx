import Sidebar from "../components/dashBoard/home/common/Sidebar/Sidebar";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { ArrowLeft, Moon, Plus, Store, Sun } from "lucide-react";
import { useUser } from "../contexts/AuthContext";
import { useThemeMode } from "../contexts/ThemeContext";

const ROUTE_TITLES = {
  "/dashboard": "Overview",
  "/dashboard/shop": "Shops",
  "/dashboard/add-shop": "Add Shop",
  "/dashboard/inventory": "Inventory",
  "/dashboard/products": "Products",
  "/dashboard/product-add": "Add / Edit Product",
  "/dashboard/product-sell": "Point of Sale",
  "/dashboard/sales": "Sales",
  "/dashboard/orders": "Orders",
  "/dashboard/invoices": "Invoices",
  "/dashboard/preview-invoice": "Invoice Preview",
  "/dashboard/customers": "Customers",
  "/dashboard/customers-list": "Customer Directory",
  "/dashboard/expense": "Expenses",
  "/dashboard/add-expense": "Add Expense",
  "/dashboard/income": "Record Income",
  "/dashboard/save-fixed-cost": "Add Fixed Cost",
  "/dashboard/analytics": "Financial Analytics",
  "/dashboard/employee": "Employees",
  "/dashboard/add-a-employee": "Add Employee",
  "/dashboard/users": "Platform Users",
  "/dashboard/settings": "Settings",
  "/dashboard/total-products": "All Products",
  "/dashboard/products/in-stock": "In Stock Products",
  "/dashboard/products/out-of-stock": "Out of Stock Products",
};

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, savedShop } = useUser();
  const { mode, toggleTheme } = useThemeMode();

  const normalizedPath = location.pathname.replace(/\/+$/, "");
  const isOverview = normalizedPath === "/dashboard";
  const pageTitle =
    ROUTE_TITLES[normalizedPath] ||
    (normalizedPath.startsWith("/dashboard/product/")
      ? "Product Details"
      : "Dashboard");

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/dashboard");
    }
  };

  const initials = (user?.name || "U")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Clean Minimalist Top Header */}
        <header className="sticky top-0 z-20 h-16 flex-shrink-0 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800/80 px-4 sm:px-6 flex items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-3 min-w-0">
            {!isOverview && (
              <button
                type="button"
                onClick={handleBack}
                aria-label="Go back"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors flex-shrink-0"
              >
                <ArrowLeft size={17} />
              </button>
            )}
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-zinc-100 truncate">
                {pageTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {savedShop?.dokaan_name && user?.role === "shop-owner" && (
              <Link
                to="/select-shop"
                title="Switch active shop"
                className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-medium text-slate-700 dark:text-zinc-200 transition-colors max-w-[200px]"
              >
                <Store size={14} className="text-indigo-500 flex-shrink-0" />
                <span className="truncate">{savedShop.dokaan_name}</span>
              </Link>
            )}

            {user?.role !== "admin" && (
              <Link
                to="/dashboard/product-sell"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-slate-800 dark:hover:bg-white text-xs font-semibold transition-colors"
              >
                <Plus size={15} />
                New Sale
              </Link>
            )}

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
            >
              {mode === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <Link
              to="/dashboard/settings"
              className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
            >
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.name || "Account"}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-zinc-700"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center">
                  {initials}
                </div>
              )}
              <div className="hidden md:block text-left leading-tight">
                <p className="text-xs font-semibold text-slate-900 dark:text-zinc-100 max-w-[110px] truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 capitalize">
                  {user?.role || "member"}
                </p>
              </div>
            </Link>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 pb-24 lg:pb-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
