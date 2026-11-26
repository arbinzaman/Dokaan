import Sidebar from "../components/dashBoard/home/common/Sidebar/Sidebar";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { ArrowLeft, Plus, Store } from "lucide-react";
import { useUser } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import LanguageToggle from "../components/shared/LanguageToggle";
import DarkColorPickerPopover from "../components/shared/DarkColorPickerPopover";

const ROUTE_TITLE_KEYS = {
  "/dashboard": "nav.overview",
  "/dashboard/shop": "nav.shops",
  "/dashboard/add-shop": "nav.addShop",
  "/dashboard/inventory": "nav.inventory",
  "/dashboard/products": "nav.products",
  "/dashboard/product-add": "nav.addProduct",
  "/dashboard/product-sell": "nav.pos",
  "/dashboard/sales": "nav.sales",
  "/dashboard/orders": "nav.orders",
  "/dashboard/invoices": "nav.invoices",
  "/dashboard/preview-invoice": "nav.invoicePreview",
  "/dashboard/customers": "nav.customers",
  "/dashboard/customers-list": "nav.customerList",
  "/dashboard/expense": "nav.expenses",
  "/dashboard/add-expense": "nav.addExpense",
  "/dashboard/income": "nav.addIncome",
  "/dashboard/save-fixed-cost": "nav.addFixedCost",
  "/dashboard/analytics": "nav.analytics",
  "/dashboard/employee": "nav.employees",
  "/dashboard/add-a-employee": "nav.addEmployee",
  "/dashboard/users": "nav.users",
  "/dashboard/settings": "nav.settings",
  "/dashboard/total-products": "nav.allProducts",
  "/dashboard/products/in-stock": "nav.inStock",
  "/dashboard/products/out-of-stock": "nav.outOfStock",
};

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, savedShop } = useUser();
  const { t, pick } = useLanguage();

  const normalizedPath = location.pathname.replace(/\/+$/, "");
  const isOverview = normalizedPath === "/dashboard";
  const titleKey = ROUTE_TITLE_KEYS[normalizedPath];
  const pageTitle = titleKey
    ? t(titleKey)
    : normalizedPath.startsWith("/dashboard/product/")
    ? t("nav.productDetails")
    : t("common.dashboard");

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
    <div className="dashboard-shell flex h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Clean Mobile-First Top Bar (No Demo Mode Banner for Logged-In Users) */}
        <header className="sticky top-0 z-20 h-16 flex-shrink-0 bg-white/90 dark:bg-zinc-950/85 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800/80 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-3 no-print">
          <div className="flex items-center gap-2.5 min-w-0">
            {!isOverview && (
              <button
                type="button"
                onClick={handleBack}
                aria-label={pick("Go back", "পিছনে যান")}
                className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors flex-shrink-0"
              >
                <ArrowLeft size={17} />
              </button>
            )}
            <div className="min-w-0">
              <h2 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-zinc-100 truncate leading-tight">
                {pageTitle}
              </h2>
              {savedShop?.dokaan_name && (
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate lg:hidden">
                  {savedShop.dokaan_name}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            {savedShop?.dokaan_name && user?.role === "shop-owner" && (
              <Link
                to="/select-shop"
                title={t("common.switchShop")}
                className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-medium text-slate-700 dark:text-zinc-200 transition-colors max-w-[210px]"
              >
                <Store
                  size={14}
                  className="flex-shrink-0"
                  style={{ color: "var(--dk-accent)" }}
                />
                <span className="truncate">{savedShop.dokaan_name}</span>
              </Link>
            )}

            {user?.role !== "admin" && (
              <Link
                to="/dashboard/product-sell"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl dk-btn-accent text-xs font-semibold transition-colors shadow-xs"
              >
                <Plus size={15} />
                {t("common.newSale")}
              </Link>
            )}

            <LanguageToggle variant="dashboard" />
            <DarkColorPickerPopover />

            <Link
              to="/dashboard/settings"
              className="flex items-center gap-2 pl-0.5 pr-1 sm:pr-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
              aria-label={t("nav.settings")}
            >
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.name || "Account"}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-zinc-700"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full text-white text-xs font-semibold flex items-center justify-center"
                  style={{ backgroundColor: "var(--dk-accent)" }}
                >
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

        {/* Scrollable Content Area with generous bottom clearance for mobile app tab bar */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-6 pb-28 lg:pb-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
