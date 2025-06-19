import {  useRef, useState } from "react";
import { useUser } from "../../../contexts/AuthContext";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  FiCheck,
  FiCalendar,
  FiX,
  FiRotateCcw,
  FiDelete,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import CategorySelector from "../../../components/dashBoard/home/expense/CategorySelector";

const AddAExpense = () => {
  const { user, savedShop } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const existingExpense = location.state?.expense;

  const [amount, setAmount] = useState(
    existingExpense?.amount?.toString() || ""
  );
  const [note, setNote] = useState(existingExpense?.note || "");
  const [category, setCategory] = useState(
    existingExpense?.category || "Uncategorized"
  );
  const [date, setDate] = useState(
    existingExpense?.date
      ? new Date(existingExpense.date)
      : new Date()
  );

  const activeTab = location.pathname.includes("income")
    ? "Income"
    : "Expense";

  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

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
    if (!amount || parseFloat(amount) <= 0)
      return toast.error("Enter a valid amount");

    const expenseData = {
      title: note || category || "No Title",
      notes: note || category || "No Note",
      amount: parseFloat(amount),
      category,
      date: format(new Date(date), "yyyy-MM-dd HH:mm:ss"),
      user_id: user?.id,
      shopId: savedShop?.id,
    };

    const isEditing = !!existingExpense;
    const endpoint = isEditing
      ? `${import.meta.env.VITE_BASE_URL}/expenses/${existingExpense.id}`
      : `${import.meta.env.VITE_BASE_URL}/expenses?shopId=${savedShop.id}`;
    const method = isEditing ? "PUT" : "POST";

    toast.promise(
      fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      }).then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Server error: ${res.status} - ${errorText}`);
        }
        return res.json();
      }),
      {
        loading: isEditing ? "Updating expense..." : "Saving expense...",
        success: () => {
          handleClear();
          navigate("/dashboard/expense");
          return isEditing ? "Expense updated!" : "Expense added!";
        },
        error: (err) => `Failed: ${err.message}`,
      }
    );
  };

  const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"];

  return (
    <div className="w-full bg-opacity-50 backdrop-blur-sm text-white flex items-center justify-center">
      <div className="w-full max-w-md bg-opacity-80 rounded-xl">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-20">
          <button onClick={() => navigate(-1)}>
            <FiX className="text-2xl" />
          </button>
          <div className="flex gap-2 bg-zinc-800 rounded-full p-1">
            {["Expense", "Income"].map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  navigate(
                    tab === "Income"
                      ? "/dashboard/income"
                      : "/dashboard/expense"
                  )
                }
                className={`px-4 py-1 rounded-full text-sm ${
                  activeTab === tab ? "bg-white text-black" : "text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button onClick={handleClear}>
            <FiRotateCcw className="text-2xl" />
          </button>
        </div>

        {/* Amount Display */}
        <div className="text-center text-5xl font-bold mb-20 break-words">
          {amount || "0"}
        </div>

        {/* Note Section */}
        <div className="w-full mb-4 px-2">
          {note === "" ? (
            <div className="flex justify-center gap-3 flex-wrap">
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
          ) : (
            <>
              <button
                onMouseDown={() => {
                  timeoutRef.current = setTimeout(() => {
                    intervalRef.current = setInterval(() => {
                      setNote((prev) => prev.slice(0, -1));
                    }, 50);
                  }, 300);
                }}
                onMouseUp={() => {
                  clearTimeout(timeoutRef.current);
                  clearInterval(intervalRef.current);
                }}
                onMouseLeave={() => {
                  clearTimeout(timeoutRef.current);
                  clearInterval(intervalRef.current);
                }}
                onClick={() => setNote((prev) => prev.slice(0, -1))}
                className="ml-auto text-xs text-red-400 flex items-center gap-1 hover:underline"
              >
                <FiDelete /> Clear
              </button>

              <textarea
                rows={1}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Type a note..."
                className="w-full border border-gray-600 rounded bg-zinc-800 text-white resize-none overflow-hidden focus:outline-none focus:ring-1 focus:ring-white px-3 py-2 transition-all duration-300 ease-in-out"
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
              />
            </>
          )}
        </div>

        {note && (
          <div className="flex justify-center mb-4">
            <button
              onClick={handleDeleteLast}
              className="flex items-center text-sm text-gray-300 gap-2 border border-gray-600 px-3 py-1 rounded"
            >
              <FiDelete /> Delete Amount
            </button>
          </div>
        )}

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

          {savedShop?.id && (
            <CategorySelector
              shopId={savedShop.id}
              selectedCategory={category}
              onSelectCategory={setCategory}
            />
          )}
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

export default AddAExpense;
