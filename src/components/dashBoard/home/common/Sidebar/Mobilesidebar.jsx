import { useEffect } from "react";
import {
  Home,
  Menu,
  ScanLine,
  Box,
  Wallet,
  FileText,
  X,
  UserCog,
  Settings,
  Store,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../../../../../contexts/AuthContext";
import { useLanguage } from "../../../../../contexts/LanguageContext";
import { useQueryClient } from "@tanstack/react-query";
import LanguageToggle from "../../../../shared/LanguageToggle";
import ThemeToggleButton from "../../../../shared/Theme/ThemeToggleButton";
import fullLogo from "../../../../../assets/Home/logos/DOKAAN_FINAL.png";

const MobileSidebar = ({
  sidebarItems = [],
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const { savedShop, dokaan, selectShop, user } = useUser();
  const { t, pick } = useLanguage();
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

  const tabClass = (active) =>
    `flex flex-col items-center justify-center gap-0.5 min-w-[54px] py-1.5 px-1.5 rounded-xl transition-colors ${
      active
        ? "font-semibold"
        : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
    }`;

  return (
    <>
      {/* Native-App Style Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-lg border-t border-slate-200 dark:border-zinc-800 flex justify-around items-center px-2 pt-1 pb-safe z-40 shadow-[0_-6px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_-6px_24px_rgba(0,0,0,0.45)] no-print"
      >
        {isAdmin ? (
          <>
            <Link
              to="/dashboard/users"
              className={tabClass(normalizedPath === "/dashboard/users")}
              style={
                normalizedPath === "/dashboard/users"
                  ? { color: "var(--dk-accent)" }
                  : undefined
              }
            >
              <UserCog size={21} />
              <span className="text-[11px] leading-none">{t("nav.users")}</span>
            </Link>
            <Link
              to="/dashboard/settings"
              className={tabClass(normalizedPath === "/dashboard/settings")}
              style={
                normalizedPath === "/dashboard/settings"
                  ? { color: "var(--dk-accent)" }
                  : undefined
              }
            >
              <Settings size={21} />
              <span className="text-[11px] leading-none">{t("nav.settings")}</span>
            </Link>
          </>
        ) : (
          <>
            <Link
              to={isShopOwner ? "/dashboard" : "/dashboard/sales"}
              className={tabClass(
                isShopOwner
                  ? normalizedPath === "/dashboard"
                  : normalizedPath === "/dashboard/sales"
              )}
              style={
                (isShopOwner
                  ? normalizedPath === "/dashboard"
                  : normalizedPath === "/dashboard/sales")
                  ? { color: "var(--dk-accent)" }
                  : undefined
              }
            >
              <Home size={21} />
              <span className="text-[11px] leading-none">{t("nav.home")}</span>
            </Link>

            <Link
              to="/dashboard/inventory"
              className={tabClass(normalizedPath === "/dashboard/inventory")}
              style={
                normalizedPath === "/dashboard/inventory"
                  ? { color: "var(--dk-accent)" }
                  : undefined
              }
            >
              <Box size={21} />
              <span className="text-[11px] leading-none">{t("nav.stock")}</span>
            </Link>

            {/* Raised Center Primary POS Sell Button */}
            <Link
              to="/dashboard/product-sell"
              aria-label={t("nav.pos")}
              className="flex flex-col items-center -mt-5"
            >
              <span className="w-13 h-13 p-3.5 dk-btn-accent rounded-2xl shadow-lg flex items-center justify-center ring-4 ring-white dark:ring-zinc-950 transition-transform active:scale-95">
                <ScanLine size={23} />
              </span>
              <span
                className="text-[11px] font-semibold mt-1 leading-none"
                style={{ color: "var(--dk-accent)" }}
              >
                {t("nav.sell")}
              </span>
            </Link>

            <Link
              to={isShopOwner ? "/dashboard/expense" : "/dashboard/invoices"}
              className={tabClass(
                isShopOwner
                  ? normalizedPath === "/dashboard/expense"
                  : normalizedPath === "/dashboard/invoices"
              )}
              style={
                (isShopOwner
                  ? normalizedPath === "/dashboard/expense"
                  : normalizedPath === "/dashboard/invoices")
                  ? { color: "var(--dk-accent)" }
                  : undefined
              }
            >
              {isShopOwner ? <Wallet size={21} /> : <FileText size={21} />}
              <span className="text-[11px] leading-none">
                {isShopOwner ? t("nav.bills") : t("nav.invoices")}
              </span>
            </Link>
          </>
        )}

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={t("nav.more")}
          className={tabClass(isMobileMenuOpen)}
          style={isMobileMenuOpen ? { color: "var(--dk-accent)" } : undefined}
        >
          <Menu size={21} />
          <span className="text-[11px] leading-none">{t("nav.more")}</span>
        </button>
      </nav>

      {/* Slide-out Mobile App Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleItemClick}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-40"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.22 }}
              className="lg:hidden fixed top-0 left-0 w-[82vw] max-w-xs h-full bg-white dark:bg-zinc-950 text-slate-900 dark:text-white border-r border-slate-200 dark:border-zinc-800 z-50 p-4 overflow-y-auto flex flex-col"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-zinc-800">
                <img
                  src={fullLogo}
                  alt="Dokaan"
                  className="h-9 w-auto object-contain"
                />
                <button
                  type="button"
                  onClick={handleItemClick}
                  aria-label={pick("Close menu", "মেনু বন্ধ করুন")}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-900"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Active Shop Card & Quick Shop Switcher */}
              {isShopOwner && savedShop && (
                <div className="mb-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
                  <div className="mb-2.5 bg-slate-100 dark:bg-zinc-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-zinc-800">
                    <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">
                      <Store size={12} style={{ color: "var(--dk-accent)" }} />
                      {t("common.currentShop")}
                    </div>
                    <p className="text-sm font-bold truncate">
                      {savedShop.dokaan_name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                      {savedShop.dokaan_location}
                    </p>
                  </div>

                  {otherDokaans.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-2">
                        {t("common.switchShop")}
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
                            className="w-full text-left p-3 text-sm bg-slate-50 dark:bg-zinc-900/70 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-800"
                          >
                            <div className="font-semibold truncate">
                              {shop.dokaan_name}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-zinc-400 truncate">
                              {shop.dokaan_location}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Big Thumb-Friendly Navigation Links */}
              <nav className="space-y-1 flex-grow">
                {sidebarItems.map((item) => {
                  const isActive = normalizedPath === item.href;
                  return (
                    <Link
                      key={item.id}
                      to={item.href}
                      onClick={handleItemClick}
                      className={`flex items-center px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? "dk-btn-accent shadow-xs"
                          : "text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900"
                      }`}
                    >
                      <item.icon size={20} className="flex-shrink-0" />
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Quick Language + Theme Controls inside Mobile Menu */}
              <div className="mt-5 pt-4 border-t border-slate-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400">
                    {t("common.language")}
                  </span>
                  <LanguageToggle variant="dashboard" />
                </div>
                <div className="flex justify-center">
                  <ThemeToggleButton />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileSidebar;
