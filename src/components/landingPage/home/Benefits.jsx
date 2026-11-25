import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Printer,
  ScanLine,
  Store,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";

const FEATURES = [
  {
    icon: ScanLine,
    title: "QR & Barcode POS",
    bnTitle: "কিউআর/বারকোড স্ক্যানিং",
    description:
      "Scan items directly using your phone or webcam camera, adjust discounts, and complete checkout in seconds.",
    accent: "text-indigo-400 bg-indigo-500/10",
  },
  {
    icon: Boxes,
    title: "Smart Inventory",
    bnTitle: "ইনভেন্টরি ম্যানেজমেন্ট",
    description:
      "Track live stock counts, categorize products, and catch low-stock or out-of-stock SKUs before you lose sales.",
    accent: "text-amber-400 bg-amber-500/10",
  },
  {
    icon: Printer,
    title: "POS & A4 Invoices",
    bnTitle: "রিসিপ্ট ও ইনভেন্টরি প্রিন্টিং",
    description:
      "Print 92mm thermal POS receipts or full-page A4 invoices and export clean PDF copies with one click.",
    accent: "text-emerald-400 bg-emerald-500/10",
  },
  {
    icon: UserCheck,
    title: "Customer CRM",
    bnTitle: "কাস্টমার ম্যানেজমেন্ট",
    description:
      "Save repeat buyer profiles, track purchase history, and identify VIP favorite customers effortlessly.",
    accent: "text-pink-400 bg-pink-500/10",
  },
  {
    icon: Wallet,
    title: "Expense & Fixed Costs",
    bnTitle: "খরচ ও ফিক্সড কস্ট ট্র্যাকিং",
    description:
      "Log daily variable costs alongside recurring rent and utility bills, and mark monthly payments as paid.",
    accent: "text-rose-400 bg-rose-500/10",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    bnTitle: "বিশ্লেষণ ও প্রতিবেদন",
    description:
      "Inspect income statements, net profit, and revenue vs. expense trends filtered by day, week, month, or year.",
    accent: "text-sky-400 bg-sky-500/10",
  },
  {
    icon: Users,
    title: "Staff & Permissions",
    bnTitle: "কর্মচারী ব্যবস্থাপনা",
    description:
      "Assign cashier or manager accounts, schedule work hours and salaries, and keep sensitive reports owner-only.",
    accent: "text-violet-400 bg-violet-500/10",
  },
  {
    icon: Store,
    title: "Multi-Shop Control",
    bnTitle: "মাল্টি-শপ ম্যানেজমেন্ট",
    description:
      "Operate multiple retail outlets from one owner login and switch branches seamlessly without logging out.",
    accent: "text-teal-400 bg-teal-500/10",
  },
];

const Benefits = () => {
  return (
    <section
      id="features"
      className="py-20 sm:py-28 border-b border-zinc-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
            Everything Included
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            দোকানের সব কিছু, এখন এক প্ল্যাটফর্মে
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400">
            Designed to be simple enough for first-time shopkeepers and
            powerful enough for growing multi-branch retail businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="group rounded-2xl border border-zinc-800/90 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 p-6 flex flex-col transition-all"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${item.accent}`}
                >
                  <Icon size={21} />
                </div>
                <h3 className="text-base font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5 mb-3">
                  {item.bnTitle}
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed flex-grow">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <TrendingUp size={16} />
            Create your shop account in under 2 minutes
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
