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
import fullLogo from "../../../assets/Home/logos/DOKAAN_FINAL.png";
import { useUser } from "../../../contexts/AuthContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import { activateDemoSession } from "../../../demo/mockServer";

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
  const { user, setUser, setDokaan, selectShop } = useUser();
  const { pick } = useLanguage();

  const PREVIEW_TABS = [
    { id: "overview", label: pick("Overview", "ওভারভিউ"), icon: BarChart3 },
    { id: "pos", label: pick("POS & Billing", "বিক্রি ও বিল"), icon: ScanLine },
    { id: "inventory", label: pick("Inventory", "স্টক"), icon: Boxes },
  ];

  const PLATFORM_METRICS = [
    {
      value: pick("14+ Modules", "১৪+ মডিউল"),
      label: pick("Complete Retail ERP", "সম্পূর্ণ দোকান ম্যানেজমেন্ট"),
    },
    {
      value: "92mm + A4",
      label: pick("POS & PDF Invoice Print", "পস রসিদ ও এ৪ প্রিন্ট"),
    },
    {
      value: pick("EN + বাংলা", "EN + বাংলা"),
      label: pick("Whole-App Language Switch", "পুরো অ্যাপ বাংলা ও ইংরেজি"),
    },
    {
      value: pick("Mobile First", "মোবাইল বান্ধব"),
      label: pick("Phone App + Web + APK", "ফোন, পিসি ও অ্যান্ড্রয়েড"),
    },
  ];

  const handleLaunchDemo = () => {
    const session = activateDemoSession("owner@dokaan.demo");
    setUser(session.user);
    setDokaan(session.dokaan);
    selectShop(session.savedShop);
    queryClient.clear();
    toast.success(
      pick(
        "Entered Interactive Demo as Shop Owner!",
        "দোকান মালিক হিসেবে ডেমো চালু হয়েছে!"
      )
    );
    navigate("/dashboard");
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-28 border-b border-red-950/60"
    >
      {/* Signature Crimson Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-36 -z-10 flex justify-center overflow-hidden blur-3xl"
      >
        <div className="h-[30rem] w-[58rem] rounded-full bg-gradient-to-r from-red-700/25 via-rose-600/20 to-red-900/20" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.14),transparent_58%)]"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Big Iconic Dokaan Brand Showcase + Hero Copy */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Prominent Full Dokaan Logo */}
          <div className="flex justify-center mb-7">
            <div className="relative inline-flex items-center justify-center px-7 py-5 rounded-3xl bg-gradient-to-b from-red-950/45 to-zinc-950/90 border border-red-500/25 shadow-2xl shadow-red-950/40">
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-3xl bg-red-600/10 blur-xl -z-10"
              />
              <img
                src={fullLogo}
                alt="Dokaan — এখন ডিজিটাল"
                className="h-24 sm:h-32 md:h-36 w-auto object-contain drop-shadow-[0_6px_24px_rgba(225,29,72,0.35)]"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-500/30 bg-red-950/40 text-xs font-medium text-red-200 mb-5">
            <Sparkles size={14} className="text-red-400" />
            <span>
              {pick(
                "Smart Retail POS & Shop ERP • Built for Mobile & Desktop",
                "স্মার্ট রিটেইল POS ও দোকান ERP • মোবাইল ও কম্পিউটারের জন্য তৈরি"
              )}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
            {pick("Run your entire shop from ", "আপনার পুরো দোকান পরিচালনা করুন ")}
            <span className="bg-gradient-to-r from-red-400 via-rose-300 to-red-500 bg-clip-text text-transparent">
              {pick("one simple dashboard", "একটি সহজ ড্যাশবোর্ড থেকে")}
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-xl text-red-100/90 font-medium">
            {pick(
              "ব্যবসার হিসাব, ইনভেন্টরি, বারকোড POS ও কাস্টমার — সব একসাথে, হাতের নাগালে।",
              "বিক্রি, স্টক, বারকোড স্ক্যানিং, খরচ, রসিদ প্রিন্ট ও লাভ-ক্ষতি — সবকিছু একদম সহজ ভাষায়, মোবাইল থেকেই!"
            )}
          </p>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            {pick(
              "Replace messy paper ledgers with an all-in-one digital retail platform. Track live stock, scan barcodes from your phone camera, print 92mm POS or A4 PDF receipts, manage branches and staff, and monitor profit in real time.",
              "কাগজের খাতার ঝামেলা ছেড়ে ডিজিটাল হন। ফোনের ক্যামেরা দিয়ে বারকোড স্ক্যান করুন, ৯২ মিমি POS বা A4 রসিদ প্রিন্ট করুন, একাধিক শাখা ও কর্মচারী পরিচালনা করুন এবং প্রতিদিনের লাভ-ক্ষতি জানুন।"
            )}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            {user ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-500 transition-colors shadow-xl shadow-red-950/50"
              >
                {pick("Open My Dashboard", "আমার ড্যাশবোর্ডে যান")}
                <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleLaunchDemo}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-500 transition-colors shadow-xl shadow-red-950/50"
                >
                  <Play size={15} className="fill-white" />
                  {pick("Try Interactive Demo", "লাইভ ডেমো দেখুন")}
                  <ArrowRight size={16} />
                </button>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-red-900/70 bg-red-950/25 text-zinc-100 font-medium text-sm hover:bg-red-950/50 hover:border-red-700 transition-colors"
                >
                  {pick("Sign In to Account", "অ্যাকাউন্টে লগইন")}
                </Link>
                <Link
                  to="/signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-300 font-medium text-sm hover:text-white hover:border-zinc-700 transition-colors"
                >
                  {pick("Start 1-Year Free Trial", "১ বছর ফ্রি শুরু করুন")}
                </Link>
              </>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-red-400" />
              {pick("No expensive POS hardware needed", "আলাদা POS মেশিনের প্রয়োজন নেই")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Printer size={14} className="text-rose-400" />
              {pick("Thermal 92mm & A4 PDF Invoices", "৯২ মিমি POS ও A4 পিডিএফ রসিদ")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-red-400" />
              {pick("Role-Based Access & Email 2FA", "রোল নিরাপত্তা ও ইমেইল 2FA")}
            </span>
          </div>
        </motion.div>

        {/* Key Platform Highlights Strip */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mt-12 max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3.5"
        >
          {PLATFORM_METRICS.map((stat) => (
            <div
              key={stat.value}
              className="rounded-2xl border border-red-950/70 bg-zinc-950/75 px-4 py-4 text-center hover:border-red-800/70 transition-colors"
            >
              <p className="text-lg sm:text-2xl font-bold text-white tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs font-medium text-zinc-300 mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Interactive Immersive Dashboard Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-10 max-w-5xl mx-auto"
        >
          <div className="rounded-2xl border border-red-950/80 bg-[#120a0c]/90 backdrop-blur-xl shadow-2xl shadow-red-950/40 overflow-hidden">
            {/* Window Chrome + Interactive Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-red-950/70 bg-zinc-950/80">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                <span className="ml-2 inline-flex items-center gap-1.5 text-xs text-zinc-300">
                  <Store size={13} className="text-red-400" />
                  {pick("Dokaan Mart — Dhanmondi Branch", "দোকান মার্ট — ধানমন্ডি শাখা")}
                </span>
              </div>

              <div className="flex items-center gap-1 bg-zinc-900/90 border border-red-950/70 rounded-xl p-1">
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
                          ? "bg-red-600 text-white shadow-sm"
                          : "text-zinc-400 hover:text-zinc-100"
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
            <div className="p-4 sm:p-7">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-red-950/60 bg-zinc-950/70 p-4">
                      <p className="text-xs text-zinc-400 uppercase tracking-wider">
                        {pick("Monthly Revenue", "মাসিক আয়")}
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
                    <div className="rounded-xl border border-red-950/60 bg-zinc-950/70 p-4">
                      <p className="text-xs text-zinc-400 uppercase tracking-wider">
                        {pick("Orders Completed", "সম্পন্ন অর্ডার")}
                      </p>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-white tabular-nums">
                          348
                        </span>
                        <span className="text-xs text-zinc-400">
                          {pick("This month", "এই মাসে")}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-red-950/60 bg-zinc-950/70 p-4">
                      <p className="text-xs text-zinc-400 uppercase tracking-wider">
                        {pick("Active Stock SKUs", "মোট স্টক পণ্য")}
                      </p>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-white tabular-nums">
                          1,240
                        </span>
                        <span className="text-xs text-amber-400">
                          {pick("3 low stock", "৩টি কম স্টক")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Clean Crimson Revenue Bar Visualization */}
                  <div className="rounded-xl border border-red-950/60 bg-zinc-950/70 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-semibold text-white">
                        {pick("6-Month Revenue Trajectory", "৬ মাসের বিক্রয় প্রবণতা")}
                      </p>
                      <span className="text-xs text-red-300/80">BDT (৳)</span>
                    </div>
                    <div className="grid grid-cols-6 items-end gap-3 h-36 pt-4">
                      {MONTHLY_BARS.map((bar) => (
                        <div
                          key={bar.m}
                          className="flex flex-col items-center gap-2 h-full justify-end"
                        >
                          <div
                            className="w-full max-w-[44px] rounded-t-lg bg-gradient-to-t from-red-700/90 via-red-500 to-rose-400 transition-all duration-300"
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
                  <div className="md:col-span-3 rounded-xl border border-red-950/60 bg-zinc-950/70 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">
                        {pick("Live Barcode Cart", "লাইভ বারকোড কার্ট")}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-red-500/15 text-red-300 border border-red-500/25 font-medium">
                        {pick("Scanner Active", "স্ক্যানার চালু")}
                      </span>
                    </div>
                    {[
                      { name: "Miniket Premium Rice 5kg", code: "89411001", qty: 2, price: "৳760" },
                      { name: "Rupchanda Soybean Oil 5L", code: "89411002", qty: 1, price: "৳895" },
                      { name: "Ispahani Mirzapore Tea 400g", code: "89411004", qty: 3, price: "৳720" },
                    ].map((row) => (
                      <div
                        key={row.code}
                        className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/90 border border-red-950/60 text-sm"
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

                  <div className="md:col-span-2 rounded-xl border border-red-950/60 bg-zinc-950/70 p-4 flex flex-col justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-red-300/80">
                        {pick("Receipt Summary", "রসিদ সারসংক্ষেপ")}
                      </p>
                      <p className="text-sm font-medium text-white mt-2">
                        {pick("Customer: Arif Hasan", "কাস্টমার: আরিফ হাসান")}
                      </p>
                      <p className="text-xs text-zinc-400">01711-234567</p>
                      <div className="mt-4 pt-3 border-t border-red-950/60 space-y-1.5 text-sm">
                        <div className="flex justify-between text-zinc-400">
                          <span>{pick("Subtotal", "মোট")}</span>
                          <span className="tabular-nums">৳2,375.00</span>
                        </div>
                        <div className="flex justify-between text-emerald-400">
                          <span>{pick("Discount", "ছাড়")}</span>
                          <span className="tabular-nums">-৳75.00</span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-red-950/60">
                          <span>{pick("Grand Total", "সর্বমোট")}</span>
                          <span className="tabular-nums">৳2,300.00</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 flex gap-2">
                      <button
                        type="button"
                        onClick={
                          user
                            ? () => navigate("/dashboard/product-sell")
                            : handleLaunchDemo
                        }
                        className="flex-1 text-center py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors"
                      >
                        {pick("Open Live POS", "POS চালু করুন")}
                      </button>
                      <span className="px-3 py-2 rounded-lg border border-red-900/70 text-zinc-300 text-xs font-medium">
                        PDF
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "inventory" && (
                <div className="rounded-xl border border-red-950/60 bg-zinc-950/70 overflow-hidden">
                  <div className="grid grid-cols-4 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 border-b border-red-950/60">
                    <span>{pick("Product", "পণ্য")}</span>
                    <span>{pick("Category", "ক্যাটাগরি")}</span>
                    <span>{pick("Price", "দাম")}</span>
                    <span className="text-right">{pick("Status", "অবস্থা")}</span>
                  </div>
                  {[
                    { name: "Miniket Rice 5kg", cat: "Groceries", price: "৳380", stock: "64 in stock", tone: "emerald" },
                    { name: "Anker 20W Fast Charger", cat: "Electronics", price: "৳1,450", stock: "19 in stock", tone: "emerald" },
                    { name: "Aarong Pure Ghee 400g", cat: "Dairy", price: "৳720", stock: "4 low stock", tone: "amber" },
                    { name: "Radhuni Mustard Oil 1L", cat: "Groceries", price: "৳320", stock: "Out of stock", tone: "rose" },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="grid grid-cols-4 items-center px-4 py-3 text-sm border-b border-red-950/40 last:border-b-0"
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
                              : "bg-red-500/15 text-red-400"
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
