import { useState, useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { format } from "date-fns";
import {
  FiCheck,
  FiCalendar,
  FiGrid,
  FiX,
  FiRotateCcw,
  FiDelete,
} from "react-icons/fi";

const AddAExpense = () => {
  const { user, dokaan } = useContext(AuthContext);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [date, setDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("Expense");

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

    const expenseData = {
      title: note || "No Title",
      amount: parseFloat(amount),
      category,
      date: format(new Date(date), "yyyy-MM-dd HH:mm:ss"),
      user_id: user?.id,
      dokaanId: dokaan?.id,
    };

    try {
      await fetch("http://localhost:8000/api/v1/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      });

      handleClear();
      alert("Expense Added!");
    } catch (error) {
      console.error("Failed to add expense:", error);
      alert("Failed to add expense");
    }
  };

  const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"];

  return (
    <div className="min-h-screen w-full bg-black bg-opacity-50 backdrop-blur-sm text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 bg-opacity-80 rounded-xl p-5 shadow-2xl">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4">
          <button>
            <FiX className="text-2xl" />
          </button>
          <div className="flex gap-2 bg-zinc-800 rounded-full p-1">
            {["Expense", "Income"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
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
        <div className="text-center text-5xl font-bold mb-3 break-words">
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
          <button
            onClick={() => {
              const userCategory = prompt("Enter category:");
              if (userCategory) setCategory(userCategory);
            }}
            className="flex items-center gap-2"
          >
            <FiGrid /> {category}
          </button>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 mb-4">
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

export default AddAExpense;
