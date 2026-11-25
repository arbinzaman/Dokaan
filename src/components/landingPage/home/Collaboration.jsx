import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Cloud,
  Laptop,
  Lock,
  Smartphone,
  Store,
  Zap,
} from "lucide-react";

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Add & Scan Your Stock",
    description:
      "Register products in seconds by scanning barcodes with your phone camera or typing SKUs manually.",
  },
  {
    step: "02",
    title: "Sell Faster & Print Instantly",
    description:
      "Build customer carts, apply item discounts, update inventory automatically, and print POS or A4 invoices.",
  },
  {
    step: "03",
    title: "Know Your Exact Profit Daily",
    description:
      "Track fixed rent, daily expenses, and sales revenue in one live financial statement across every branch.",
  },
];

const HIGHLIGHTS = [
  { icon: Smartphone, label: "Mobile & Tablet Friendly", desc: "Built for counter phones" },
  { icon: Laptop, label: "Desktop Web ERP", desc: "Full keyboard POS speed" },
  { icon: Cloud, label: "Multi-Branch Sync", desc: "Switch shops in 1 click" },
  { icon: Lock, label: "2FA & Role Guards", desc: "Owner, Staff & Admin roles" },
  { icon: Zap, label: "Instant PDF Receipts", desc: "Thermal 92mm & A4 ready" },
  { icon: Store, label: "Zero Setup Complexity", desc: "Start selling today" },
];

const Collaboration = () => {
  return (
    <section
      id="workflow"
      className="py-20 sm:py-28 border-b border-zinc-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Workflow Steps */}
          <div className="lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">
              Simple 3-Step Workflow
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              ফোনে ও কম্পিউটারে সহজ দোকান ব্যবস্থাপনা
            </h2>
            <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
              No complicated accounting jargon. Every screen in Dokaan is built
              so any shop owner or cashier can learn it in minutes.
            </p>

            <div className="mt-8 space-y-5">
              {WORKFLOW_STEPS.map((item) => (
                <div
                  key={item.step}
                  className="flex items-start gap-4 p-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/40"
                >
                  <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center">
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
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-colors"
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
            <div className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/90 to-zinc-950 p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between pb-5 mb-6 border-b border-zinc-800">
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-400">
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
                      className="p-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/70 hover:border-zinc-700 transition-colors"
                    >
                      <Icon size={20} className="text-indigo-400 mb-3" />
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
      </div>
    </section>
  );
};

export default Collaboration;
