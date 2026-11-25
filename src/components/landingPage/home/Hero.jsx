import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  CheckCircle2,
  Play,
  Printer,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
} from "lucide-react";
import { useUser } from "../../../contexts/AuthContext";
import { activateDemoSession } from "../../../demo/mockServer";

const PREVIEW_TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "pos", label: "POS & Billing", icon: ScanLine },
  { id: "inventory", label: "Inventory", icon: Boxes },
];

const MONTHLY_BARS = [
  { m: "Jun", h: 48 },
  { m: "Jul", h: 62 },
  { m: "Aug", h: 55 },
  { m: "Sep", h: 74 },
  { m: "Oct", h: 82 },
  { m: "Nov", h: 94 },
];

const Hero = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setUser, setDokaan, selectShop } = useUser();

  const handleLaunchDemo = () => {
    const session = activateDemoSession("owner@dokaan.demo");
    setUser(session.user);
    setDokaan(session.dokaan);
    selectShop(session.savedShop);
    queryClient.clear();
    toast.success("Entered Interactive Demo as Shop Owner!");
    navigate("/dashboard");
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28 border-b border-zinc-800/80"
    >
      {/* Subtle Ambient Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center overflow-hidden blur-3xl"
      >
        <div className="h-[26rem] w-[52rem] rounded-full bg-gradient-to-r from-indigo-600/20 via-violet-500/15 to-emerald-500/15" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Copy */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 text-xs font-medium text-zinc-300 mb-6">
            <Sparkles size={14} className="text-indigo-400" />
            <span>Smart Retail POS &amp; Shop ERP • Web &amp; Mobile</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
            Run your entire shop from{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-300 bg-clip-text text-transparent">
              one simple dashboard
            </span>
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-zinc-300 font-medium">
            ব্যবসার হিসাব, ইনভেন্টরি, বারকোড POS ও কাস্টমার — সব একসাথে, হাতের
            নাগালে।
          </p>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
            Track live stock, scan barcodes from your phone camera, print POS
            or A4 receipts, manage branches and staff, and monitor daily profit
            in real time.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={handleLaunchDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5"
            >
              <Play size={15} className="fill-zinc-950" />
              Try Interactive Demo
              <ArrowRight size={16} />
            </button>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-zinc-800 bg-zinc-900/70 text-zinc-200 font-medium text-sm hover:bg-zinc-900 hover:border-zinc-700 transition-colors"
            >
              Sign In / Choose Role
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" />
              No hardware lock-in
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Printer size={14} className="text-indigo-400" />
              POS 92mm &amp; A4 Invoices
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-violet-400" />
              Role-Based Access &amp; 2FA
            </span>
          </div>
        </motion.div>

        {/* Interactive Immersive Dashboard Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-14 max-w-5xl mx-auto"
        >
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-xl shadow-2xl shadow-indigo-950/30 overflow-hidden">
            {/* Window Chrome + Interactive Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-zinc-800 bg-zinc-950/70">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="ml-2 inline-flex items-center gap-1.5 text-xs text-zinc-400">
                  <Store size={13} className="text-indigo-400" />
                  Dokaan Mart — Dhanmondi Branch
                </span>
              </div>

              <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
                {PREVIEW_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      type="button"
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        active
                          ? "bg-white text-zinc-950"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <Icon size={13} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Tab Panels */}
            <div className="p-5 sm:p-7">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
                      <p className="text-xs text-zinc-400 uppercase tracking-wider">
                        Monthly Revenue
                      </p>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-white tabular-nums">
                          ৳4,82,650
                        </span>
                        <span className="text-xs font-semibold text-emerald-400 inline-flex items-center gap-0.5">
                          <TrendingUp size={13} /> +18.4%
                        </span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
                      <p className="text-xs text-zinc-400 uppercase tracking-wider">
                        Orders Completed
                      </p>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-white tabular-nums">
                          348
                        </span>
                        <span className="text-xs text-zinc-400">This month</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
                      <p className="text-xs text-zinc-400 uppercase tracking-wider">
                        Active Stock SKUs
                      </p>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-white tabular-nums">
                          1,240
                        </span>
                        <span className="text-xs text-amber-400">
                          3 low stock
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Clean Revenue Bar Visualization */}
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-semibold text-white">
                        6-Month Revenue Trajectory
                      </p>
                      <span className="text-xs text-zinc-400">BDT (৳)</span>
                    </div>
                    <div className="grid grid-cols-6 items-end gap-3 h-36 pt-4">
                      {MONTHLY_BARS.map((bar) => (
                        <div
                          key={bar.m}
                          className="flex flex-col items-center gap-2 h-full justify-end"
                        >
                          <div
                            className="w-full max-w-[44px] rounded-t-lg bg-gradient-to-t from-indigo-600/80 to-indigo-400 transition-all duration-300"
                            style={{ height: `${bar.h}%` }}
                          />
                          <span className="text-[11px] text-zinc-400">
                            {bar.m}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "pos" && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                  <div className="md:col-span-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">
                        Live Barcode Cart
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-emerald-500/15 text-emerald-400 font-medium">
                        Scanner Active
                      </span>
                    </div>
                    {[
                      { name: "Miniket Premium Rice 5kg", code: "89411001", qty: 2, price: "৳760" },
                      { name: "Rupchanda Soybean Oil 5L", code: "89411002", qty: 1, price: "৳895" },
                      { name: "Ispahani Mirzapore Tea 400g", code: "89411005", qty: 3, price: "৳720" },
                    ].map((row) => (
                      <div
                        key={row.code}
                        className="flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800/80 text-sm"
                      >
                        <div>
                          <p className="font-medium text-zinc-100">{row.name}</p>
                          <p className="text-xs text-zinc-400 font-mono">
                            {row.code} • Qty {row.qty}
                          </p>
                        </div>
                        <span className="font-semibold text-white tabular-nums">
                          {row.price}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="md:col-span-2 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 flex flex-col justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-zinc-400">
                        Receipt Summary
                      </p>
                      <p className="text-sm font-medium text-white mt-2">
                        Customer: Arif Hasan
                      </p>
                      <p className="text-xs text-zinc-400">01711-234567</p>
                      <div className="mt-4 pt-3 border-t border-zinc-800 space-y-1.5 text-sm">
                        <div className="flex justify-between text-zinc-400">
                          <span>Subtotal</span>
                          <span className="tabular-nums">৳2,375.00</span>
                        </div>
                        <div className="flex justify-between text-emerald-400">
                          <span>Discount</span>
                          <span className="tabular-nums">-৳75.00</span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-zinc-800">
                          <span>Grand Total</span>
                          <span className="tabular-nums">৳2,300.00</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 flex gap-2">
                      <span className="flex-1 text-center py-2 rounded-lg bg-white text-zinc-950 text-xs font-semibold">
                        Print POS Receipt
                      </span>
                      <span className="px-3 py-2 rounded-lg border border-zinc-700 text-zinc-300 text-xs font-medium">
                        PDF
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "inventory" && (
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden">
                  <div className="grid grid-cols-4 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                    <span>Product</span>
                    <span>Category</span>
                    <span>Price</span>
                    <span className="text-right">Status</span>
                  </div>
                  {[
                    { name: "Miniket Rice 5kg", cat: "Groceries", price: "৳380", stock: "64 in stock", tone: "emerald" },
                    { name: "Anker 20W Fast Charger", cat: "Electronics", price: "৳1,450", stock: "19 in stock", tone: "emerald" },
                    { name: "Aarong Pure Ghee 400g", cat: "Dairy", price: "৳720", stock: "4 low stock", tone: "amber" },
                    { name: "Samsung Type-C Cable", cat: "Electronics", price: "৳350", stock: "Out of stock", tone: "rose" },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="grid grid-cols-4 items-center px-4 py-3 text-sm border-b border-zinc-800/60 last:border-b-0"
                    >
                      <span className="font-medium text-zinc-100 truncate pr-2">
                        {item.name}
                      </span>
                      <span className="text-zinc-400 text-xs">{item.cat}</span>
                      <span className="text-zinc-200 tabular-nums">{item.price}</span>
                      <span className="text-right">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            item.tone === "emerald"
                              ? "bg-emerald-500/15 text-emerald-400"
                              : item.tone === "amber"
                              ? "bg-amber-500/15 text-amber-400"
                              : "bg-rose-500/15 text-rose-400"
                          }`}
                        >
                          {item.stock}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
