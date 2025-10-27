import { useState } from "react";
import { useUser } from "../../../contexts/AuthContext";
import { format } from "date-fns";
import {
  FiCheck,
  FiCalendar,
  FiX,
  FiRotateCcw,
  FiDelete,
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import CategorySelector from "../../../components/dashBoard/home/expense/CategorySelector"; // ✅ Adjust path if needed

const AddAIncome = () => {
  const { user, dokaan } = useUser();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [date, setDate] = useState(new Date());
  const location = useLocation();
  const activeTab = location.pathname.includes("income") ? "Income" : "Expense";

  const navigate = useNavigate();

  const handleNumberInput = (num) => {
    setAmount((prev) => (prev === "0" ? num : prev + num));
  };

  const handleDeleteLast = () => {
    setAmount((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setAmount("");
    setNote("");
    setCategory("Uncategorized");
    setDate(new Date());
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) return alert("Enter valid amount");

    const incomeData = {
      title: note || category || "No Title",
      note: note || category || "No Note",
      amount: parseFloat(amount),
      category,
      date: format(new Date(date), "yyyy-MM-dd HH:mm:ss"),
      user_id: user?.id,
      dokaanId: dokaan?.id,
    };

    try {
      await fetch(`${import.meta.env.VITE_BASE_URL}/expense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(incomeData),
      });

      handleClear();
      alert("Income Added!");
    } catch (error) {
      console.error("Failed to add income:", error);
      alert("Failed to add income");
    }
  };

  const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"];

  return (
    <div className="w-full bg-opacity-50 backdrop-blur-sm text-white flex items-center justify-center">
      <div className="w-full max-w-md bg-opacity-80 rounded-xl">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-20">
          <button onClick={() => navigate("/dashboard/expense-details")}>
            <FiX className="text-2xl" />
          </button>
          <div className="flex gap-2 bg-zinc-800 rounded-full p-1">
            {["Expense", "Income"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  const route =
                    tab === "Income"
                      ? "/dashboard/income"
                      : "/dashboard/add-expense";
                  navigate(route);
                }}
                className={`px-4 py-1 rounded-full text-sm ${
                  activeTab === tab ? "bg-white text-black" : "text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button>
            <FiRotateCcw className="text-2xl" />
          </button>
        </div>

        {/* Amount Display */}
        <div className="text-center text-5xl font-bold mb-20 break-words">
          {amount || "0"}
        </div>

        {/* Note and Delete Buttons */}
        <div className="flex justify-center gap-3 flex-wrap mb-4">
          <button
            onClick={() => {
              const userNote = prompt("Add a note:");
              if (userNote) setNote(userNote);
            }}
            className="flex items-center text-sm text-gray-300 gap-2 border border-gray-600 px-3 py-1 rounded"
          >
            <span className="text-lg">≡</span> Add Note
          </button>
          <button
            onClick={handleDeleteLast}
            className="flex items-center text-sm text-gray-300 gap-2 border border-gray-600 px-3 py-1 rounded"
          >
            <FiDelete /> Delete
          </button>
        </div>

        {/* Date & Category */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm text-gray-400 mb-4">
          <label className="flex items-center gap-2">
            <FiCalendar />
            <input
              type="datetime-local"
              value={format(date, "yyyy-MM-dd'T'HH:mm")}
              onChange={(e) => setDate(new Date(e.target.value))}
              className="bg-transparent text-white outline-none"
            />
          </label>

          {/* ✅ Reusable Category Selector */}
          <CategorySelector
            shopId={dokaan?.id}
            selectedCategory={category}
            onSelectCategory={(cat) => setCategory(cat)}
          />
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3">
          {keypad.map((num, index) => (
            <button
              key={index}
              onClick={() => handleNumberInput(num)}
              className="text-2xl bg-zinc-800 rounded py-4 hover:bg-zinc-700 transition"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleSubmit}
            className="bg-white text-black rounded py-4 flex items-center justify-center hover:bg-gray-200 transition"
          >
            <FiCheck className="text-2xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAIncome;
