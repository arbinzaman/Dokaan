import { useState } from "react";
import { useUser } from "../../../contexts/AuthContext";
import { format, isValid } from "date-fns";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  FiCheck,
  FiCalendar,
  FiX,
  FiRotateCcw,
  FiDelete,
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import CategorySelector from "../../../components/dashBoard/home/expense/CategorySelector";

const AddAIncome = () => {
  const { user, savedShop } = useUser();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("Sales");
  const [date, setDate] = useState(() => new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const activeTab = location.pathname.includes("income") ? "Income" : "Expense";
  const safeDate = isValid(date) ? date : new Date();

  const handleNumberInput = (num) => {
    setAmount((prev) => {
      if (num === ".") {
        if (prev.includes(".")) return prev;
        return prev === "" ? "0." : `${prev}.`;
      }
      return prev === "0" ? num : prev + num;
    });
  };

  const handleDeleteLast = () => {
    setAmount((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setAmount("");
    setNote("");
    setCategory("Sales");
    setDate(new Date());
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!savedShop?.id) {
      toast.error("Please select a shop first.");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Enter a valid positive amount.");
      return;
    }

    const token = Cookies.get("XTOKEN");
    const incomeData = {
      title: note.trim() || category || "Income",
      notes: note.trim() || category || "",
      amount: parsedAmount,
      category,
      type: "income",
      date: format(safeDate, "yyyy-MM-dd HH:mm:ss"),
      user_id: user?.id,
      shopId: savedShop.id,
    };

    setIsSubmitting(true);
    const toastId = toast.loading("Saving income...");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/expenses?shopId=${savedShop.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: token } : {}),
          },
          body: JSON.stringify(incomeData),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Server error (${res.status})`);
      }

      toast.success("Income recorded!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["income-statement"] });
      queryClient.invalidateQueries({ queryKey: ["financial-report"] });
      handleClear();
      navigate("/dashboard/expense");
    } catch (error) {
      toast.error(`Failed to add income: ${error.message}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"];

  return (
    <div className="w-full flex items-center justify-center py-4 px-2">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 text-gray-900 dark:text-white">
        <div className="flex justify-between items-center mb-8">
          <button
            type="button"
            aria-label="Close"
            onClick={() => navigate("/dashboard/expense")}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
          >
            <FiX className="text-xl" />
          </button>

          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
            {["Expense", "Income"].map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() =>
                  navigate(
                    tab === "Income"
                      ? "/dashboard/income"
                      : "/dashboard/add-expense"
                  )
                }
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label="Reset form"
            onClick={handleClear}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
          >
            <FiRotateCcw className="text-xl" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-1">
            <span className="text-3xl font-bold text-gray-400">৳</span>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^0-9.]/g, "");
                if ((cleaned.match(/\./g) || []).length <= 1) {
                  setAmount(cleaned);
                }
              }}
              placeholder="0"
              className="w-48 text-center text-4xl font-bold bg-transparent text-gray-900 dark:text-white focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={handleDeleteLast}
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-rose-500"
          >
            <FiDelete /> Backspace
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note (e.g., Wholesale commission)..."
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 text-sm mb-5">
          <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <FiCalendar className="text-gray-500 flex-shrink-0" />
            <input
              type="datetime-local"
              value={format(safeDate, "yyyy-MM-dd'T'HH:mm")}
              onChange={(e) => {
                const parsed = new Date(e.target.value);
                if (isValid(parsed)) setDate(parsed);
              }}
              className="bg-transparent text-gray-900 dark:text-white text-xs outline-none w-full"
            />
          </label>

          {savedShop?.id && (
            <CategorySelector
              shopId={savedShop.id}
              selectedCategory={category}
              onSelectCategory={setCategory}
            />
          )}
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {keypad.map((num) => (
            <button
              type="button"
              key={num}
              onClick={() => handleNumberInput(num)}
              className="text-xl font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl py-3.5 transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            aria-label="Save income"
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl py-3.5 flex items-center justify-center transition-colors"
          >
            <FiCheck className="text-2xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAIncome;
