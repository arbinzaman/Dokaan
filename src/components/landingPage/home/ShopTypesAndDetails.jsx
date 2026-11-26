import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Coffee,
  Cpu,
  HeartPulse,
  Play,
  Shield,
  Shirt,
  ShoppingBasket,
  Smartphone,
  Sparkles,
  Store,
  UserCheck,
  Wrench,
} from "lucide-react";
import { useUser } from "../../../contexts/AuthContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import { activateDemoSession } from "../../../demo/mockServer";

const INDUSTRIES = [
  {
    icon: ShoppingBasket,
    title: "Grocery & Super Shops",
    bn: "মুদি ও সুপার শপ",
    detail: "Fast barcode checkout for high-volume daily essentials, bulk stock alerts, and walk-in billing.",
  },
  {
    icon: Cpu,
    title: "Electronics & Gadgets",
    bn: "ইলেকট্রনিক্স ও গ্যাজেট",
    detail: "Track high-value SKUs, serial codes, purchase vs. sale margins, and detailed A4 warranty invoices.",
  },
  {
    icon: HeartPulse,
    title: "Pharmacies & Healthcare",
    bn: "ফার্মেসি ও হেলথকেয়ার",
    detail: "Quick product search by name or code, low-stock alerts before critical items run out.",
  },
  {
    icon: Shirt,
    title: "Clothing & Boutiques",
    bn: "পোশাক ও বুটিক",
    detail: "Organize seasonal collections by category, apply item-level discounts, and track loyal VIP shoppers.",
  },
  {
    icon: Smartphone,
    title: "Mobile & Accessories",
    bn: "মোবাইল ও এক্সেসরিজ",
    detail: "Manage phones, chargers, and cables with instant margin visibility and printed customer receipts.",
  },
  {
    icon: Coffee,
    title: "Bakery & Mini Cafes",
    bn: "বেকারি ও ক্যাফে",
    detail: "One-tap counter checkout with thermal 92mm receipts, daily cashflow, and ingredient expense tracking.",
  },
  {
    icon: Wrench,
    title: "Hardware & Auto Parts",
    bn: "হার্ডওয়্যার ও পার্টস",
    detail: "Search thousands of small parts effortlessly and keep accurate warehouse vs. counter stock counts.",
  },
  {
    icon: Sparkles,
    title: "Cosmetics & Stationery",
    bn: "কসমেটিক্স ও স্টেশনারি",
    detail: "Categorize multi-brand catalogs, run festival discounts, and track best-selling products every week.",
  },
];

const ROLE_CARDS = [
  {
    role: "shop-owner",
    email: "owner@dokaan.demo",
    landing: "/dashboard",
    icon: Store,
    badge: "Complete Control",
    title: "Shop Owner",
    bn: "দোকান মালিক",
    summary:
      "Full visibility across one or multiple branches — revenue, inventory, expenses, staff, and profit statements.",
    capabilities: [
      "Switch between multiple store branches in 1 click",
      "View live Income Statements (Day / Week / Month / Year)",
      "Manage Fixed Costs (rent, bills) & Variable Expenses",
      "Add staff accounts, set salaries, and monitor sales",
    ],
    cta: "Preview Owner Dashboard",
    highlight: true,
  },
  {
    role: "employee",
    email: "cashier@dokaan.demo",
    landing: "/dashboard",
    icon: UserCheck,
    badge: "Counter Speed",
    title: "Cashier / Staff",
    bn: "ক্যাশিয়ার ও কর্মচারী",
    summary:
      "Distraction-free daily operations interface focused on fast billing, barcode lookup, and customer service.",
    capabilities: [
      "Scan barcodes or quick-tap products at POS counter",
      "Apply discounts & print 92mm POS or A4 invoices",
      "Search existing customers or bill walk-in shoppers",
      "Sensitive owner financial & branch settings stay hidden",
    ],
    cta: "Preview Cashier View",
    highlight: false,
  },
  {
    role: "admin",
    email: "admin@dokaan.demo",
    landing: "/dashboard/users",
    icon: Shield,
    badge: "Platform Oversight",
    title: "Platform Admin",
    bn: "অ্যাডমিন প্যানেল",
    summary:
      "Centralized administration for monitoring all registered shop owners, active subscriptions, and platform growth.",
    capabilities: [
      "Monitor total users, new signups today & churn metrics",
      "Inspect subscription statuses across all accounts",
      "Analyze user growth trends & activity heatmaps",
      "Moderate and manage platform user directory",
    ],
    cta: "Preview Admin Panel",
    highlight: false,
  },
];

const ShopTypesAndDetails = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setUser, setDokaan, selectShop } = useUser();
  const { pick } = useLanguage();

  const handlePreviewRole = (item) => {
    const session = activateDemoSession(item.email);
    setUser(session.user);
    setDokaan(session.dokaan);
    selectShop(session.savedShop);
    queryClient.clear();
    toast.success(`Opened Interactive Demo as ${item.title}`);
    navigate(item.landing);
  };

  return (
    <section
      id="industries"
      className="py-20 sm:py-28 border-b border-red-950/60 bg-gradient-to-b from-[#0a0607] via-[#11080a] to-[#0a0607]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Part 1: Built for Every Type of Retail Business */}
        <div>
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-3">
              {pick("Built For Every Shop", "যেকোনো দোকানের জন্য")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              {pick(
                "Made for every retail & wholesale store",
                "যেকোনো ধরনের খুচরা ও পাইকারি ব্যবসার জন্য উপযুক্ত"
              )}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-zinc-400">
              {pick(
                "Whether you run a neighborhood grocery store or a multi-branch electronics showroom, Dokaan adapts cleanly to your catalog and counter workflow.",
                "পাড়ার মুদি দোকান হোক বা একাধিক শাখার ইলেকট্রনিক্স শোরুম — সব ব্যবসার জন্য দোকান সমানভাবে কাজ করে।"
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INDUSTRIES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  className="rounded-2xl border border-red-950/70 bg-zinc-950/70 hover:border-red-700/70 hover:bg-red-950/15 p-5 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-600/15 border border-red-500/20 text-red-400 flex items-center justify-center mb-4">
                    <Icon size={19} />
                  </div>
                  <h3 className="text-sm font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-red-300/80 mt-0.5 mb-2.5">
                    {item.bn}
                  </p>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {item.detail}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Part 2: Role-Based Dashboards Deep Dive */}
        <div>
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-3">
              Dedicated Role Workspaces
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Right tools for every team member
            </h2>
            <p className="mt-4 text-sm sm:text-base text-zinc-400">
              Dokaan separates owner financials, cashier POS speed, and platform
              administration into tailored role workspaces. Click any role below
              to test it live.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {ROLE_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.role}
                  className={`rounded-3xl p-7 flex flex-col border transition-all ${
                    card.highlight
                      ? "border-red-600/80 bg-gradient-to-b from-red-950/35 to-zinc-950 shadow-2xl shadow-red-950/30"
                      : "border-red-950/70 bg-zinc-950/70 hover:border-red-800/70"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="w-11 h-11 rounded-2xl bg-red-600/15 border border-red-500/25 text-red-400 flex items-center justify-center">
                      <Icon size={21} />
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        card.highlight
                          ? "bg-red-600 text-white"
                          : "bg-red-950/60 text-red-300 border border-red-900/60"
                      }`}
                    >
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white">{card.title}</h3>
                  <p className="text-xs text-red-300/80 mt-0.5">{card.bn}</p>
                  <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
                    {card.summary}
                  </p>

                  <ul className="mt-6 space-y-2.5 pt-5 border-t border-red-950/70 flex-grow">
                    {card.capabilities.map((cap) => (
                      <li
                        key={cap}
                        className="flex items-start gap-2.5 text-sm text-zinc-300"
                      >
                        <Check
                          size={15}
                          className="text-red-400 flex-shrink-0 mt-0.5"
                        />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => handlePreviewRole(card)}
                    className={`mt-7 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors ${
                      card.highlight
                        ? "bg-red-600 hover:bg-red-500 text-white"
                        : "bg-zinc-900 hover:bg-red-950/60 text-zinc-100 border border-red-950/80"
                    }`}
                  >
                    <Play size={13} className="fill-current" />
                    {card.cta}
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopTypesAndDetails;
