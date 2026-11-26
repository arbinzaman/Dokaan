import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { format, isValid } from "date-fns";

import TimeFilterControls from "../../../components/dashBoard/home/analytics/TimeFilterControls";
import FinancialStats from "../../../components/dashBoard/home/analytics/FinancialStats";
import RevenueExpenseChart from "../../../components/dashBoard/home/analytics/RevenueExpenseChart";
import FinancialBreakdownTable from "../../../components/dashBoard/home/analytics/FinancialBreakdownTable";
import { useUser } from "../../../contexts/AuthContext";
import { useLanguage } from "../../../contexts/LanguageContext";

const AnalyticsPage = () => {
  const [type, setType] = useState("month");
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const { savedShop } = useUser();
  const { pick } = useLanguage();
  const shopId = savedShop?.id;
  const token = Cookies.get("XTOKEN");

  const safeDate = isValid(selectedDate) ? selectedDate : new Date();
  const dateKey = format(safeDate, "yyyy-MM-dd");

  const getCommonParams = () => {
    const params = { shopId, type };
    const year = format(safeDate, "yyyy");

    if (type === "month") {
      params.month = format(safeDate, "MMM").toLowerCase();
      params.year = year;
    } else if (type === "day") {
      params.date = dateKey;
    } else if (type === "week") {
      params.week = format(safeDate, "I");
      params.year = year;
    } else if (type === "year") {
      params.year = year;
    }

    return params;
  };

  const {
    data: incomeStatement,
    isLoading: incomeLoading,
    isError: incomeError,
  } = useQuery({
    queryKey: ["income-statement", shopId, type, dateKey],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/expenses/income-statement`,
        {
          params: getCommonParams(),
          headers: token ? { Authorization: token } : undefined,
        }
      );
      return res.data?.data ?? {};
    },
    enabled: !!shopId,
  });

  const {
    data: financialReport,
    isLoading: reportLoading,
    isError: reportError,
  } = useQuery({
    queryKey: ["financial-report", shopId, type, dateKey],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/expenses/financial-report`,
        {
          params: getCommonParams(),
          headers: token ? { Authorization: token } : undefined,
        }
      );
      return res.data?.data ?? {};
    },
    enabled: !!shopId,
  });

  const statement = incomeStatement || {};
  const { summary, revenueBreakdown, expenseBreakdown } = statement;
  const grouped = financialReport || {};

  return (
    <div className="max-w-7xl mx-auto px-1 sm:px-4 py-2 sm:py-4 text-gray-900 dark:text-white">
      <div className="mb-5">
        <h2 className="text-xl sm:text-3xl font-bold tracking-tight">
          {pick("Financial Analytics", "আয়-ব্যয় ও লাভ-ক্ষতি রিপোর্ট")}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          {pick(
            "Check your real-time revenue, expenses, and net profit by day, week, month, or year.",
            "দিন, সপ্তাহ, মাস বা বছর অনুযায়ী মোট আয়, খরচ ও নিট লাভ দেখুন।"
          )}
        </p>
      </div>

      <TimeFilterControls
        type={type}
        setType={setType}
        selectedDate={safeDate}
        setSelectedDate={setSelectedDate}
      />

      {incomeLoading || reportLoading ? (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          Loading financial reports...
        </div>
      ) : incomeError || reportError ? (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm">
          Failed to load financial analytics. Please try again.
        </div>
      ) : (
        <>
          <FinancialStats summary={summary} />
          <FinancialBreakdownTable
            revenueBreakdown={revenueBreakdown}
            expenseBreakdown={expenseBreakdown}
          />
          <RevenueExpenseChart data={grouped} />
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
