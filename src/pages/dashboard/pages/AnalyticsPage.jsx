import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { format } from "date-fns";

import TimeFilterControls from "../../../components/dashBoard/home/analytics/TimeFilterControls";
import FinancialStats from "../../../components/dashBoard/home/analytics/FinancialStats";
import RevenueExpenseChart from "../../../components/dashBoard/home/analytics/RevenueExpenseChart";
import FinancialBreakdownTable from "../../../components/dashBoard/home/analytics/FinancialBreakdownTable";
import { useThemeMode } from "../../../contexts/ThemeContext";

const AnalyticsPage = () => {
  const [type, setType] = useState("month");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [shopId, setShopId] = useState(null);
  const token = Cookies.get("XTOKEN");
  const { mode } = useThemeMode();

  useEffect(() => {
    const shop = JSON.parse(localStorage.getItem("savedShop"));
    if (shop?.id) setShopId(shop.id);
  }, []);

  const getCommonParams = () => {
    const params = { shopId, type };
    const year = format(selectedDate, "yyyy");

    if (type === "month") {
      params.month = format(selectedDate, "MMM").toLowerCase();
      params.year = year;
    } else if (type === "day") {
      params.date = format(selectedDate, "yyyy-MM-dd");
    } else if (type === "week") {
      params.week = format(selectedDate, "I");
      params.year = year;
    } else if (type === "year") {
      params.year = year;
    }

    return params;
  };

  const {
    data: incomeStatement = {},
    isLoading: incomeLoading,
  } = useQuery({
    queryKey: ["income-statement", shopId, type, selectedDate],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/expenses/income-statement`,
        {
          params: getCommonParams(),
          headers: { Authorization: token },
        }
      );
      return res.data?.data;
    },
    enabled: !!shopId,
  });

  const {
    data: financialReport = {},
    isLoading: reportLoading,
  } = useQuery({
    queryKey: ["financial-report", shopId, type, selectedDate],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/expenses/financial-report`,
        {
          params: getCommonParams(),
          headers: { Authorization: token },
        }
      );
        console.log("🔁 Raw Financial Report Response:", res.data);
      return res.data?.data;
    },
    enabled: !!shopId,
  });

  const { summary, revenueBreakdown, expenseBreakdown } = incomeStatement;
  const grouped = financialReport ?? {};


  return (
    <div className={`max-w-7xl mx-auto px-4 py-8 transition-colors ${mode === "dark" ? "text-white" : "text-gray-900"}`}>
      <h2 className="text-3xl font-extrabold mb-6 tracking-tight">📊 Financial Dashboard</h2>

      <TimeFilterControls
        type={type}
        setType={setType}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      {!incomeLoading && !reportLoading && (
        <>
          <FinancialStats summary={summary} />
          <FinancialBreakdownTable
            revenueBreakdown={revenueBreakdown}
            expenseBreakdown={expenseBreakdown}
          />
          <RevenueExpenseChart data={grouped}  />
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
