import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Check,
  ClipboardList,
  Globe,
  Palette,
  Printer,
  Receipt,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Store,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";
import { useLanguage } from "../../../contexts/LanguageContext";

const ALL_FEATURES = [
  {
    category: "pos",
    icon: ScanLine,
    title: "Camera & USB Barcode POS",
    bnTitle: "ক্যামেরা ও ইউএসবি বারকোড POS",
    description:
      "Scan items from your smartphone camera, connect USB barcode scanners, or tap quick shelf buttons to build carts in seconds.",
    bnDescription:
      "ফোনের ক্যামেরা, ইউএসবি বারকোড স্ক্যানার বা কুইক বাটনে ট্যাপ করে কয়েক সেকেন্ডেই বিল তৈরি করুন।",
    points: ["Instant cart & line discounts", "Walk-in & registered customer billing"],
  },
  {
    category: "pos",
    icon: Printer,
    title: "92mm POS & A4 PDF Invoices",
    bnTitle: "৯২ মিমি POS ও A4 পিডিএফ রসিদ",
    description:
      "Preview, print thermal POS receipts or full-page A4 invoices, download clean PDF copies, and track returned invoices.",
    bnDescription:
      "থার্মাল ৯২ মিমি রসিদ বা A4 ইনভয়েস প্রিন্ট করুন, এক ক্লিকে PDF ডাউনলোড এবং রিটার্ন মার্ক করুন।",
    points: ["Switch POS / A4 layout live", "Instant PDF export & archive"],
  },
  {
    category: "pos",
    icon: TrendingUp,
    title: "Sales History & Live Trends",
    bnTitle: "বিক্রয় ইতিহাস ও গ্রোথ চার্ট",
    description:
      "Filter every transaction by year, month, day, or seller, and visualize daily, monthly, and category-wise sales trends.",
    bnDescription:
      "বছর, মাস, দিন বা বিক্রেতা অনুযায়ী বিক্রি খুঁজুন এবং দৈনিক ও মাসিক গ্রোথ চার্ট দেখুন।",
    points: ["Daily & 6-month sales charts", "Category breakdown analytics"],
  },
  {
    category: "inventory",
    icon: Boxes,
    title: "Real-Time Stock & Inventory",
    bnTitle: "লাইভ স্টক ও ইনভেন্টরি কন্ট্রোল",
    description:
      "Automatic stock deduction on every checkout with instant filters for All Items, In Stock, Low Stock (<10), and Out of Stock.",
    bnDescription:
      "প্রতিটি বিক্রির সাথে সাথে স্টক অটো কমে যাবে এবং কম বা শেষ হয়ে যাওয়া পণ্যের সতর্কতা পাবেন।",
    points: ["Low-stock & out-of-stock alerts", "1-click barcode product restock"],
  },
  {
    category: "inventory",
    icon: ClipboardList,
    title: "Order Fulfillment Tracking",
    bnTitle: "অর্ডার ট্র্যাকিং ও স্ট্যাটাস আপডেট",
    description:
      "Manage Pending, Processing, Shipped, and Delivered orders with live status dropdowns and status distribution charts.",
    bnDescription:
      "পেন্ডিং, প্রসেসিং, শিপড ও ডেলিভারড অর্ডার সহজে পরিচালনা ও স্ট্যাটাস আপডেট করুন।",
    points: ["Live order status switcher", "Order value & distribution stats"],
  },
  {
    category: "finance",
    icon: Wallet,
    title: "Fixed Monthly Bills Tracking",
    bnTitle: "মাসিক ফিক্সড বিল ম্যানেজমেন্ট",
    description:
      "Record recurring monthly shop rent, electricity, internet, and maintenance bills, then mark each one Paid in one tap.",
    bnDescription:
      "দোকান ভাড়া, বিদ্যুৎ ও ইন্টারনেট বিল আলাদাভাবে রাখুন এবং পরিশোধ হলে এক ট্যাপে পেইড মার্ক করুন।",
    points: ["Rent, utilities & salaries", "1-tap 'Mark as Paid' status"],
  },
  {
    category: "finance",
    icon: Receipt,
    title: "Daily Expenses & Extra Income",
    bnTitle: "দৈনিক খরচ ও অতিরিক্ত আয়",
    description:
      "Mobile calculator-style keypad for logging transport, packaging, and snacks expenses or extra commissions with custom categories.",
    bnDescription:
      "ক্যালকুলেটর কিপ্যাডে সহজে প্রতিদিনের খরচ ও অতিরিক্ত আয় ক্যাটাগরিসহ সংরক্ষণ করুন।",
    points: ["Touch-friendly number keypad", "Custom category creator"],
  },
  {
    category: "finance",
    icon: BarChart3,
    title: "Income Statement & Profit Analytics",
    bnTitle: "আয়-ব্যয় ও নিট লাভ রিপোর্ট",
    description:
      "Automatic Revenue, Total Expenses, and Net Profit statements broken down by Day, Week, Month, or Year.",
    bnDescription:
      "দিন, সপ্তাহ, মাস ও বছর অনুযায়ী মোট আয়, খরচ ও নিট লাভের পূর্ণাঙ্গ রিপোর্ট দেখুন।",
    points: ["Day / Week / Month / Year views", "Revenue vs. Expense bar charts"],
  },
  {
    category: "finance",
    icon: UserCheck,
    title: "Customer CRM & VIP Buyers",
    bnTitle: "কাস্টমার ডাটাবেস ও প্রিয় ক্রেতা",
    description:
      "Search buyers directly during POS checkout, count repeat purchases across shops, and highlight favorite VIP customers.",
    bnDescription:
      "বিক্রির সময় কাস্টমার খুঁজুন, মোট কেনাকাটা গুনুন এবং নিয়মিত প্রিয় ক্রেতাদের তালিকা রাখুন।",
    points: ["Instant phone/name lookup", "Customer growth & VIP filter"],
  },
  {
    category: "team",
    icon: Store,
    title: "Multi-Shop Branch Switching",
    bnTitle: "মাল্টি-শপ শাখা পরিচালনা",
    description:
      "Add multiple shops under a single owner account and switch branches anytime without signing out.",
    bnDescription:
      "একটি অ্যাকাউন্ট থেকেই একাধিক দোকান পরিচালনা করুন এবং লগআউট ছাড়াই শাখা বদলান।",
    points: ["Separate stock & sales per shop", "Branch TIN & profile editor"],
  },
  {
    category: "team",
    icon: Users,
    title: "Employee Shifts & Payroll",
    bnTitle: "কর্মচারী, শিফট ও বেতন",
    description:
      "Create cashier accounts with shift schedules, work days, salaries, active/inactive status, and protected access.",
    bnDescription:
      "ক্যাশিয়ার ও স্টাফদের কাজের সময়, বেতন ও অ্যাক্টিভ স্ট্যাটাস এক জায়গা থেকে পরিচালনা করুন।",
    points: ["Dedicated Cashier login view", "Owner financials stay hidden"],
  },
  {
    category: "team",
    icon: ShieldCheck,
    title: "Email OTP 2FA & Security",
    bnTitle: "ইমেইল ওটিপি 2FA ও নিরাপত্তা",
    description:
      "Protect owner accounts with Email OTP Two-Factor Authentication, password management, and role-based route guards.",
    bnDescription:
      "ইমেইল ওটিপি টু-ফ্যাক্টর সিকিউরিটি, পাসওয়ার্ড পরিবর্তন ও রোল-ভিত্তিক সুরক্ষা ব্যবস্থা।",
    points: ["Toggle 2FA anytime in Settings", "Owner, Cashier & Admin roles"],
  },
  {
    category: "controls",
    icon: Globe,
    title: "Whole-App English & বাংলা Switch",
    bnTitle: "পুরো অ্যাপে ইংরেজি ও বাংলা ভাষা",
    description:
      "Switch the entire landing page, navigation, POS, and dashboard between English and Bangla in one tap.",
    bnDescription:
      "এক ক্লিকে পুরো ওয়েবসাইট, মেনু ও ড্যাশবোর্ড ইংরেজি থেকে বাংলায় পরিবর্তন করুন।",
    points: ["Built for non-tech shopkeepers", "Saved automatically on device"],
  },
  {
    category: "controls",
    icon: Palette,
    title: "Black Mode & Custom Color Controls",
    bnTitle: "ব্ল্যাক মোড ও কালার কন্ট্রোল",
    description:
      "Switch between Light Mode, Obsidian Dark, Pure OLED Black, Midnight Navy, or Crimson Dark plus 5 custom accent colors.",
    bnDescription:
      "লাইট মোড, পিওর ব্ল্যাক (OLED), অবসিডিয়ান, নেভি ও ক্রিমসন ডার্ক এবং ৫টি অ্যাকসেন্ট কালার।",
    points: ["AMOLED battery-friendly Black Mode", "Mobile-first bottom app bar"],
  },
];

const Benefits = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { isBn, pick } = useLanguage();

  const FILTER_TABS = [
    { id: "all", label: pick("All 14 Features", "সব ১৪টি ফিচার") },
    { id: "pos", label: pick("POS & Sales", "বিক্রি ও POS") },
    { id: "inventory", label: pick("Inventory & Orders", "স্টক ও অর্ডার") },
    { id: "finance", label: pick("Finance & CRM", "হিসাব ও কাস্টমার") },
    { id: "team", label: pick("Branches & Team", "শাখা ও টিম") },
    { id: "controls", label: pick("Mobile & Controls", "মোবাইল ও কন্ট্রোল") },
  ];

  const visibleFeatures =
    selectedCategory === "all"
      ? ALL_FEATURES
      : ALL_FEATURES.filter((f) => f.category === selectedCategory);

  return (
    <section
      id="features"
      className="py-20 sm:py-28 border-b border-red-950/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-3">
            {pick("Complete Feature Suite", "সম্পূর্ণ ফিচার তালিকা")}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {pick(
              "Everything your shop needs — all in one platform",
              "দোকানের সব কিছু, এখন এক প্ল্যাটফর্মে"
            )}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400">
            {pick(
              "Every tool inside Dokaan is designed to be clear enough for first-time smartphone users and powerful enough for multi-branch retail chains.",
              "সাধারণ দোকানদার থেকে শুরু করে একাধিক শাখার ব্যবসা — সবার ব্যবহারের জন্য একদম সহজ ও আধুনিক সব ফিচার।"
            )}
          </p>
        </div>

        {/* Interactive Feature Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {FILTER_TABS.map((tab) => {
            const active = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-colors ${
                  active
                    ? "bg-red-600 text-white border-red-600 shadow-md shadow-red-950/40"
                    : "bg-zinc-950/70 text-zinc-300 border-red-950/70 hover:border-red-700 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {visibleFeatures.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.25) }}
                className="group rounded-2xl border border-red-950/70 bg-zinc-950/75 hover:bg-red-950/20 hover:border-red-700/70 p-5 sm:p-6 flex flex-col transition-all"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-red-600/15 border border-red-500/20 text-red-400 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <Icon size={21} />
                </div>
                <h3 className="text-base font-semibold text-white">
                  {isBn ? item.bnTitle : item.title}
                </h3>
                <p className="text-xs text-red-300/80 mt-0.5 mb-2.5">
                  {isBn ? item.title : item.bnTitle}
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed flex-grow">
                  {isBn ? item.bnDescription : item.description}
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

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-center">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600/15 border border-red-500/30 text-sm font-medium text-red-300 hover:bg-red-600 hover:text-white transition-colors"
          >
            <Smartphone size={16} />
            {pick(
              "Create your shop account in under 2 minutes",
              "২ মিনিটের কম সময়ে আপনার দোকান অ্যাকাউন্ট খুলুন"
            )}
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
