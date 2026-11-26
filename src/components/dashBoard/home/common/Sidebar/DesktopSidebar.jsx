import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import DokaanProfile from "../../../../dashBoard/Profile/DokaanProfile";
import fullLogo from "../../../../../assets/Home/logos/DOKAAN_FINAL.png";
import { useUser } from "../../../../../contexts/AuthContext";
import { useLanguage } from "../../../../../contexts/LanguageContext";

const DesktopSidebar = ({ sidebarItems, isSidebarOpen, setIsSidebarOpen }) => {
  const { user } = useUser();
  const { pick } = useLanguage();
  const location = useLocation();
  const normalizedPath = location.pathname.replace(/\/+$/, "");

  return (
    <motion.aside
      className={`hidden lg:flex flex-col h-full bg-white dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 border-r border-slate-200/80 dark:border-zinc-800/80 overflow-y-auto flex-shrink-0 no-print ${
        isSidebarOpen ? "w-64 px-3.5 py-4" : "w-[74px] px-2.5 py-4"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 74 }}
      transition={{ duration: 0.18 }}
    >
      {/* Brand + Collapse Control */}
      <div
        className={`flex items-center mb-5 px-1 ${
          isSidebarOpen ? "justify-between" : "justify-center"
        }`}
      >
        {isSidebarOpen && (
          <Link to="/dashboard" className="flex items-center">
            <img
              src={fullLogo}
              alt="Dokaan — এখন ডিজিটাল"
              className="h-9 w-auto object-contain"
            />
          </Link>
        )}
        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors"
        >
          {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Shop Switcher for shop-owner */}
      {isSidebarOpen && user?.role === "shop-owner" && (
        <div className="mb-4">
          <DokaanProfile />
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-grow space-y-1">
        {sidebarItems.map((item) => {
          const isActive = normalizedPath === item.href;
          return (
            <Link
              key={item.id}
              to={item.href}
              title={!isSidebarOpen ? item.name : undefined}
              className={`group relative flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isSidebarOpen ? "justify-start" : "justify-center"
              } ${
                isActive
                  ? "dk-btn-accent shadow-xs"
                  : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-100"
              }`}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {isSidebarOpen && (
                <span className="ml-3 truncate">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Subtle Footer Caption */}
      {isSidebarOpen && (
        <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-zinc-800/70 px-2">
          <p className="text-[11px] text-slate-400 dark:text-zinc-500">
            {pick("Dokaan Smart Retail ERP", "দোকান স্মার্ট রিটেইল ইআরপি")}
          </p>
        </div>
      )}
    </motion.aside>
  );
};

export default DesktopSidebar;
