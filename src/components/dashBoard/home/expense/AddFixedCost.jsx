import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../../../../contexts/AuthContext";
import { useThemeMode } from "../../../../contexts/ThemeContext";
import CreatableSelect from "react-select/creatable";

const AddFixedCost = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categoryOptions, setCategoryOptions] = useState([
    { value: "rent", label: "Rent" },
    { value: "utilities", label: "Utilities" },
    { value: "maintenance", label: "Maintenance" },
    { value: "salary", label: "Staff Salary" },
    { value: "miscellaneous", label: "Miscellaneous" },
  ]);
  const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0]);

  const { user, savedShop } = useUser();
  const { mode } = useThemeMode();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const savedShopId = savedShop?.id;
  const userId = user?.id;
  const token = Cookies.get("XTOKEN") || user?.token;

  const handleCreateCategory = (inputValue) => {
    const clean = inputValue.trim();
    if (!clean) return;
    const newOption = { value: clean.toLowerCase(), label: clean };
    setCategoryOptions((prev) => [...prev, newOption]);
    setSelectedCategory(newOption);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!savedShopId) {
      toast.error("Please select a shop first.");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (!title.trim() || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Valid title and positive amount are required.");
      return;
    }

    const payload = {
      title: title.trim(),
      amount: parsedAmount,
      notes: notes.trim(),
      category: selectedCategory?.value || "miscellaneous",
      type: "fixed",
      date: new Date().toISOString(),
      user_id: userId,
      shopId: savedShopId,
    };

    setIsSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/expenses?shopId=${savedShopId}`,
        payload,
        {
          headers: token ? { Authorization: token } : undefined,
        }
      );

      toast.success("Fixed cost added!");
      queryClient.invalidateQueries({ queryKey: ["fixed-costs", savedShopId] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setTitle("");
      setAmount("");
      setNotes("");
      setSelectedCategory(categoryOptions[0]);
      if (onAdd) {
        onAdd();
      } else {
        navigate("/dashboard/expense");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add fixed cost.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDark = mode === "dark";

  return (
    <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 max-w-xl mx-auto mt-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Add Fixed Cost
      </h2>

      <form onSubmit={handleAdd} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Title
          </label>
          <input
            type="text"
            placeholder="e.g., Monthly Shop Rent"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Amount (৳)
          </label>
          <input
            type="number"
            min="0.01"
            step="any"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Category
          </label>
          <CreatableSelect
            isClearable={false}
            onCreateOption={handleCreateCategory}
            options={categoryOptions}
            value={selectedCategory}
            onChange={(newValue) => setSelectedCategory(newValue)}
            placeholder="Select or create category"
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: isDark ? "#1f2937" : "#ffffff",
                borderColor: isDark ? "#374151" : "#d1d5db",
                borderRadius: "0.75rem",
                minHeight: "42px",
              }),
              singleValue: (base) => ({
                ...base,
                color: isDark ? "#f9fafb" : "#111827",
              }),
              input: (base) => ({
                ...base,
                color: isDark ? "#f9fafb" : "#111827",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: isDark ? "#1f2937" : "#ffffff",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused
                  ? isDark
                    ? "#374151"
                    : "#eef2ff"
                  : "transparent",
                color: isDark ? "#f9fafb" : "#111827",
              }),
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Notes (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="Optional details..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/dashboard/expense")}
            className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            {isSubmitting ? "Saving..." : "Save Fixed Cost"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFixedCost;
