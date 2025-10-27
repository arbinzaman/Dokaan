import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useUser } from "../../../../contexts/AuthContext";
import CreatableSelect from "react-select/creatable";

const AddFixedCost = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const [categoryOptions, setCategoryOptions] = useState([
    { value: "rent", label: "Rent" },
    { value: "utilities", label: "Utilities" },
    { value: "maintenance", label: "Maintenance" },
    { value: "miscellaneous", label: "Miscellaneous" },
  ]);
  const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0]);

  const { user, savedShop } = useUser();
  const savedShopId = savedShop?.id;
  const userId = user?.id;
  const token = user?.token;

  const handleCreateCategory = (inputValue) => {
    const newOption = { value: inputValue.toLowerCase(), label: inputValue };
    setCategoryOptions((prev) => [...prev, newOption]);
    setSelectedCategory(newOption);
  };

  const handleAdd = async () => {
    if (!title || !amount) {
      toast.error("Title and amount are required");
      return;
    }

    const payload = {
      title,
      amount: parseFloat(amount),
      notes,
      category: selectedCategory.value,
      type: "fixed", // fixed cost type
      date: new Date().toISOString(),
      user_id: userId,
      shopId: savedShopId,
    };

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/expenses?shopId=${savedShopId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Fixed cost added");
      setTitle("");
      setAmount("");
      setNotes("");
      setSelectedCategory(categoryOptions[0]);
      if (onAdd) onAdd(); // callback to parent to refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add cost");
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-700 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-zinc-800 dark:text-zinc-100">Add Fixed Cost</h2>

      <input
        type="text"
        placeholder="Title (e.g. Rent)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-4 px-4 py-2 border rounded-md bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full mb-4 px-4 py-2 border rounded-md bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <CreatableSelect
        isClearable={false}
        onCreateOption={handleCreateCategory}
        options={categoryOptions}
        value={selectedCategory}
        onChange={(newValue) => setSelectedCategory(newValue)}
        placeholder="Select or create category"
        className="mb-4 text-black"
      />

      <textarea
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full mb-4 px-4 py-2 border rounded-md bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <button
        onClick={handleAdd}
        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition"
      >
        Save Fixed Cost
      </button>
    </div>
  );
};

export default AddFixedCost;
