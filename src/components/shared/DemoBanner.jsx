import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { RotateCcw, Shield, Store, UserCheck } from "lucide-react";
import { useUser } from "../../contexts/AuthContext";
import { activateDemoSession, resetDemoDb } from "../../demo/mockServer";

const ROLE_SWITCHERS = [
  {
    key: "shop-owner",
    label: "Owner",
    email: "owner@dokaan.demo",
    icon: Store,
    landing: "/dashboard",
  },
  {
    key: "employee",
    label: "Cashier",
    email: "cashier@dokaan.demo",
    icon: UserCheck,
    landing: "/dashboard",
  },
  {
    key: "admin",
    label: "Admin",
    email: "admin@dokaan.demo",
    icon: Shield,
    landing: "/dashboard/users",
  },
];

const DemoBanner = () => {
  const { user, setUser, setDokaan, selectShop } = useUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleSwitchRole = (target) => {
    if (user?.role === target.key && user?.email === target.email) return;
    const session = activateDemoSession(target.email);
    setUser(session.user);
    setDokaan(session.dokaan);
    selectShop(session.savedShop);
    queryClient.clear();
    toast.success(`Switched to ${target.label} demo account`);
    navigate(target.landing);
  };

  const handleReset = () => {
    resetDemoDb();
    const activeEmail = user?.email || "owner@dokaan.demo";
    const session = activateDemoSession(activeEmail);
    setUser(session.user);
    setDokaan(session.dokaan);
    selectShop(session.savedShop);
    queryClient.clear();
    toast.success("Demo data restored to default!");
  };

  return (
    <div className="no-print bg-indigo-600/[0.08] dark:bg-indigo-500/10 border-b border-indigo-200/70 dark:border-indigo-500/20 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-200">
        <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        <span className="font-semibold text-indigo-700 dark:text-indigo-300">
          Interactive Demo
        </span>
        <span className="hidden sm:inline text-slate-500 dark:text-zinc-400">
          • Runs 100% offline with local browser storage
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-slate-500 dark:text-zinc-400 mr-1 hidden md:inline">
          Switch role:
        </span>
        <div className="inline-flex items-center rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-0.5">
          {ROLE_SWITCHERS.map((item) => {
            const Icon = item.icon;
            const active = user?.role === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleSwitchRole(item)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors ${
                  active
                    ? "bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-950"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
                }`}
              >
                <Icon size={12} />
                {item.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleReset}
          title="Reset demo data back to defaults"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 font-medium transition-colors"
        >
          <RotateCcw size={12} />
          <span>Reset Data</span>
        </button>
      </div>
    </div>
  );
};

export default DemoBanner;
