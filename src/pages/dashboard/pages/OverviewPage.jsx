import {
  FileText,
  PackagePlus,
  ScanLine,
  ShoppingBag,
  Wallet,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import StatCard from "../../../components/dashBoard/home/common/StatCard";
import CategoryDistributionChart from "../../../components/dashBoard/home/overview/CategoryDistributionChart";
import SalesChannelChart from "../../../components/dashBoard/home/overview/SalesChannelChart";
import { useUser } from "../../../contexts/AuthContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import SalesTrendChart from "../../../components/dashBoard/home/products/SalesTrendChart";

const OverviewPage = () => {
  const { savedShop } = useUser();
  const { pick } = useLanguage();
  const navigate = useNavigate();
  const shopId = savedShop?.id;

  // Fetch total sales
  const {
    data: salesTotalData,
    isLoading: salesLoading,
    isError: salesError,
  } = useQuery({
    queryKey: ["totalSales", shopId],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/sales/total`,
        {
          params: { shopId },
          headers: token ? { Authorization: token } : undefined,
        }
      );
      return response.data ?? {};
    },
    enabled: !!shopId,
  });

  // Fetch total products
  const {
    data: productData,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: ["totalProducts", shopId],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/products/total-products`,
        {
          params: { shopId },
          headers: token ? { Authorization: token } : undefined,
        }
      );
      return response.data ?? {};
    },
    enabled: !!shopId,
  });

  // Fetch total revenue
  const {
    data: revenueData = {},
    isLoading: revenueLoading,
    isError: revenueError,
  } = useQuery({
    queryKey: ["totalRevenue", shopId],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/sales/total-revenue`,
        {
          headers: {
            ...(token ? { Authorization: token } : {}),
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          params: { shopId: Number(shopId) },
        }
      );
      return response.data ?? {};
    },
    enabled: !!shopId,
  });

  const matchedShopSales =
    salesTotalData && String(salesTotalData.shopId) === String(shopId)
      ? salesTotalData
      : salesTotalData;

  const formattedSales = salesLoading
    ? "..."
    : salesError
    ? "—"
    : Number(matchedShopSales?.totalSales ?? 0).toLocaleString();

  const matchedShopProduct = Array.isArray(productData?.data)
    ? productData.data.find((item) => String(item.shopId) === String(shopId))
    : null;

  const formattedProducts = productsLoading
    ? "..."
    : productsError
    ? "—"
    : Number(matchedShopProduct?.totalProducts ?? 0).toLocaleString();

  const totalRevenue = Number(revenueData?.totalRevenue ?? 0);
  const formattedRevenue = revenueLoading
    ? "..."
    : revenueError
    ? "—"
    : `৳${totalRevenue.toLocaleString()}`;

  const quickActions = [
    {
      to: "/dashboard/product-sell",
      icon: ScanLine,
      label: pick("New Sale (POS)", "নতুন বিক্রি"),
      hint: pick("Scan & bill", "স্ক্যান ও বিল"),
      tone: "bg-red-500/12 text-red-600 dark:text-red-400",
    },
    {
      to: "/dashboard/product-add",
      icon: PackagePlus,
      label: pick("Add Product", "পণ্য যোগ"),
      hint: pick("Update stock", "স্টক আপডেট"),
      tone: "bg-amber-500/12 text-amber-600 dark:text-amber-400",
    },
    {
      to: "/dashboard/add-expense",
      icon: Wallet,
      label: pick("Add Expense", "খরচ লিখুন"),
      hint: pick("Daily costs", "দৈনিক খরচ"),
      tone: "bg-rose-500/12 text-rose-600 dark:text-rose-400",
    },
    {
      to: "/dashboard/invoices",
      icon: FileText,
      label: pick("Invoices", "রসিদ দেখুন"),
      hint: pick("Print or PDF", "প্রিন্ট ও পিডিএফ"),
      tone: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-2 sm:py-4 px-1 sm:px-4 lg:px-6">
        <div className="mb-5">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {pick("Shop Overview", "দোকানের আজকের হিসাব")}
          </h1>
          {savedShop?.dokaan_name && (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
              {savedShop.dokaan_name}
              {savedShop.dokaan_location ? ` — ${savedShop.dokaan_location}` : ""}
            </p>
          )}
        </div>

        {/* Non-Tech Friendly Big Mobile Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {quickActions.map((act) => {
            const Icon = act.icon;
            return (
              <Link
                key={act.to}
                to={act.to}
                className="group bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 rounded-2xl p-4 flex items-center gap-3 transition-all active:scale-[0.98]"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${act.tone}`}
                >
                  <Icon size={21} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {act.label}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                    {act.hint}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <StatCard
            name={pick("Total Sales", "মোট বিক্রয় সংখ্যা")}
            icon={Zap}
            value={formattedSales}
            subtext={pick("View sales history", "বিক্রির তালিকা দেখুন")}
            color="#DC2626"
            onClick={() => navigate("/dashboard/sales")}
          />
          <StatCard
            name={pick("Total Products", "মোট পণ্য")}
            icon={ShoppingBag}
            value={formattedProducts}
            subtext={pick("Check live stock", "স্টক দেখুন")}
            color="#F59E0B"
            onClick={() => navigate("/dashboard/inventory")}
          />
          <StatCard
            name={pick("Total Revenue", "মোট আয়")}
            icon={FaBangladeshiTakaSign}
            value={formattedRevenue}
            subtext={pick("Open profit report", "লাভ-ক্ষতি রিপোর্ট")}
            color="#10B981"
            onClick={() => navigate("/dashboard/analytics")}
          />
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="lg:col-span-2">
            <SalesTrendChart />
          </div>
          <CategoryDistributionChart />
          <SalesChannelChart />
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
