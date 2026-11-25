import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Check,
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
    points: ["Camera + USB scanner ready", "Line-item discounts & cart math"],
  },
  {
    icon: Boxes,
    title: "Smart Inventory",
    bnTitle: "ইনভেন্টরি ম্যানেজমেন্ট",
    description:
      "Track live stock counts, categorize products, and catch low-stock or out-of-stock SKUs before you lose sales.",
    points: ["Auto stock deduction on sale", "In-stock / Low / Out filters"],
  },
  {
    icon: Printer,
    title: "POS & A4 Invoices",
    bnTitle: "রিসিপ্ট ও ইনভেন্টরি প্রিন্টিং",
    description:
      "Print 92mm thermal POS receipts or full-page A4 invoices and export clean PDF copies with one click.",
    points: ["92mm thermal & A4 modes", "Instant PDF download & returns"],
  },
  {
    icon: UserCheck,
    title: "Customer CRM",
    bnTitle: "কাস্টমার ম্যানেজমেন্ট",
    description:
      "Save repeat buyer profiles, track purchase history, and identify VIP favorite customers effortlessly.",
    points: ["Auto-complete buyer lookup", "Favorite VIP buyer tagging"],
  },
  {
    icon: Wallet,
    title: "Expense & Fixed Costs",
    bnTitle: "খরচ ও ফিক্সড কস্ট ট্র্যাকিং",
    description:
      "Log daily variable costs alongside recurring rent and utility bills, and mark monthly payments as paid.",
    points: ["Fixed bills + Paid toggle", "Extra income & custom categories"],
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    bnTitle: "বিশ্লেষণ ও প্রতিবেদন",
    description:
      "Inspect income statements, net profit, and revenue vs. expense trends filtered by day, week, month, or year.",
    points: ["Live P&L breakdown tables", "Category & monthly trend charts"],
  },
  {
    icon: Users,
    title: "Staff & Permissions",
    bnTitle: "কর্মচারী ব্যবস্থাপনা",
    description:
      "Assign cashier or manager accounts, schedule work hours and salaries, and keep sensitive reports owner-only.",
    points: ["Shift & salary directory", "Role-isolated dashboards"],
  },
  {
    icon: Store,
    title: "Multi-Shop Control",
    bnTitle: "মাল্টি-শপ ম্যানেজমেন্ট",
    description:
      "Operate multiple retail outlets from one owner login and switch branches seamlessly without logging out.",
    points: ["Per-branch stock & sales", "1-click branch switcher"],
  },
];

const Benefits = () => {
  return (
    <section
      id="features"
      className="py-20 sm:py-28 border-b border-red-950/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-3">
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
                className="group rounded-2xl border border-red-950/70 bg-zinc-950/75 hover:bg-red-950/20 hover:border-red-700/70 p-6 flex flex-col transition-all"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 bg-red-600/15 border border-red-500/20 text-red-400 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <Icon size={21} />
                </div>
                <h3 className="text-base font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-red-300/80 mt-0.5 mb-3">
                  {item.bnTitle}
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed flex-grow">
                  {item.description}
                </p>
                <ul className="mt-4 pt-3.5 border-t border-red-950/60 space-y-1.5">
                  {item.points.map((pt) => (
                    <li
                      key={pt}
                      className="flex items-center gap-1.5 text-xs text-zinc-300"
                    >
                      <Check size={12} className="text-red-400 flex-shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
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
