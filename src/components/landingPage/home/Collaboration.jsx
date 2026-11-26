import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../../../contexts/LanguageContext";
import {
  ArrowRight,
  Check,
  Cloud,
  Laptop,
  Lock,
  Smartphone,
  Store,
  X,
  Zap,
} from "lucide-react";

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Add & Scan Your Stock",
    description:
      "Register products in seconds by scanning barcodes with your phone camera, typing SKUs manually, or importing categories with purchase and sale prices.",
  },
  {
    step: "02",
    title: "Sell Faster & Print Instantly",
    description:
      "Build customer carts, apply percentage discounts, automatically deduct stock, record repeat buyers, and print 92mm POS or A4 PDF invoices.",
  },
  {
    step: "03",
    title: "Know Your Exact Profit Daily",
    description:
      "Track monthly rent, electricity bills, daily expenses, and sales revenue inside one live Income Statement across every branch.",
  },
];

const HIGHLIGHTS = [
  { icon: Smartphone, label: "Mobile & Tablet Friendly", desc: "Built for counter phones & Android APK" },
  { icon: Laptop, label: "Desktop Web ERP", desc: "Full keyboard & barcode POS speed" },
  { icon: Cloud, label: "Multi-Branch Sync", desc: "Switch shops in 1 click without logout" },
  { icon: Lock, label: "2FA & Role Guards", desc: "Protected Owner, Staff & Admin views" },
  { icon: Zap, label: "Instant PDF Receipts", desc: "Thermal 92mm & A4 invoice layouts" },
  { icon: Store, label: "Zero Setup Complexity", desc: "Start billing in under 2 minutes" },
];

const COMPARISON = [
  {
    paper: "Manual khata calculation mistakes at closing time",
    dokaan: "Automatic daily, weekly, monthly & yearly net profit calculation",
  },
  {
    paper: "No idea which items are running low until shelves are empty",
    dokaan: "Live stock deduction + instant Low Stock & Out of Stock alerts",
  },
  {
    paper: "Handwritten paper slips that fade or get lost",
    dokaan: "Searchable digital invoice archive with 92mm POS & A4 PDF print",
  },
  {
    paper: "Hard to monitor multiple branches or staff counters remotely",
    dokaan: "Owner dashboard tracks every branch, cashier, and bill in real time",
  },
];

const Collaboration = () => {
  const { pick } = useLanguage();

  return (
    <section
      id="workflow"
      className="py-20 sm:py-28 border-b border-red-950/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Workflow Steps */}
          <div className="lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-3">
              {pick("Simple 3-Step Workflow", "সহজ ৩ ধাপে শুরু করুন")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              {pick(
                "Easy shop management on phone & computer",
                "ফোনে ও কম্পিউটারে সহজ দোকান ব্যবস্থাপনা"
              )}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
              {pick(
                "No complicated accounting jargon. Every screen in Dokaan is built so any shop owner or cashier can master it in minutes.",
                "কোনো জটিল অ্যাকাউন্টিং নয়। যেকোনো দোকানদার বা ক্যাশিয়ার কয়েক মিনিটেই সব কাজ শিখে নিতে পারবেন।"
              )}
            </p>

            <div className="mt-8 space-y-4">
              {WORKFLOW_STEPS.map((item) => (
                <div
                  key={item.step}
                  className="flex items-start gap-4 p-4 rounded-2xl border border-red-950/70 bg-zinc-950/70 hover:border-red-800/70 transition-colors"
                >
                  <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-red-600/15 border border-red-500/25 text-red-400 font-mono text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-500 transition-colors shadow-lg shadow-red-950/40"
              >
                Try Dokaan Free
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Right Column: Clean Ecosystem Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-6"
          >
            <div className="rounded-3xl border border-red-950/80 bg-gradient-to-b from-red-950/30 to-zinc-950 p-6 sm:p-8 shadow-xl shadow-red-950/30">
              <div className="flex items-center justify-between pb-5 mb-6 border-b border-red-950/70">
                <div>
                  <p className="text-xs uppercase tracking-wider text-red-300/80">
                    Connected Retail Stack
                  </p>
                  <h3 className="text-lg font-semibold text-white mt-1">
                    Works Everywhere Your Team Works
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400">
                  <Check size={13} /> Ready
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {HIGHLIGHTS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="p-4 rounded-2xl border border-red-950/60 bg-zinc-950/80 hover:border-red-700/70 transition-colors"
                    >
                      <Icon size={20} className="text-red-400 mb-3" />
                      <p className="text-sm font-semibold text-white">
                        {item.label}
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Paper Khata vs Dokaan Digital Comparison */}
        <div className="rounded-3xl border border-red-950/70 bg-zinc-950/75 p-6 sm:p-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-2">
              Why Upgrade
            </p>
            <h3 className="text-2xl font-bold text-white">
              কাগজের খাতা বনাম ডিজিটাল দোকান
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/40 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">
                Traditional Paper Khata
              </p>
              <ul className="space-y-3">
                {COMPARISON.map((row) => (
                  <li
                    key={row.paper}
                    className="flex items-start gap-2.5 text-sm text-zinc-400"
                  >
                    <X
                      size={16}
                      className="text-zinc-500 flex-shrink-0 mt-0.5"
                    />
                    <span>{row.paper}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-red-600/40 bg-red-950/20 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-400 mb-4">
                Dokaan Digital Retail ERP
              </p>
              <ul className="space-y-3">
                {COMPARISON.map((row) => (
                  <li
                    key={row.dokaan}
                    className="flex items-start gap-2.5 text-sm text-zinc-100"
                  >
                    <Check
                      size={16}
                      className="text-red-400 flex-shrink-0 mt-0.5"
                    />
                    <span>{row.dokaan}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collaboration;
