import { useState, useEffect, useRef } from "react";
import { FiGrid } from "react-icons/fi";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const DEFAULT_CATEGORIES = [
  "Supplies",
  "Transport",
  "Utilities",
  "Packaging",
  "Maintenance",
  "Food & Refreshments",
];

const CategorySelector = ({ shopId, selectedCategory, onSelectCategory }) => {
  const [categories, setCategories] = useState(() =>
    DEFAULT_CATEGORIES.map((name, idx) => ({ id: `def-${idx}`, name }))
  );
  const [expanded, setExpanded] = useState(false);
  const [addingNew, setAddingNew] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!shopId) return;
    const token = Cookies.get("XTOKEN");

    fetch(`${import.meta.env.VITE_BASE_URL}/expenses?shopId=${shopId}`, {
      headers: token ? { Authorization: token } : undefined,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data) => {
        const allExpenses = Array.isArray(data?.data) ? data.data : [];
        const merged = Array.from(
          new Set([
            ...DEFAULT_CATEGORIES,
            ...allExpenses.map((item) => item?.category).filter(Boolean),
          ])
        ).map((name, index) => ({ id: index, name }));
        setCategories(merged);
      })
      .catch(() => {
        // Keep defaults on error
      });
  }, [shopId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setExpanded(false);
        setAddingNew(false);
      }
    };
    if (expanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expanded]);

  const handleAddCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;
    const exists = categories.some(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      toast.error("Category already exists");
      return;
    }
    setCategories((prev) => [...prev, { id: Date.now(), name: trimmed }]);
    onSelectCategory(trimmed);
    setNewCategoryInput("");
    setAddingNew(false);
    setExpanded(false);
    toast.success("Category added");
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-3.5 py-2 rounded-xl text-sm text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-expanded={expanded}
      >
        <FiGrid />
        <span>{selectedCategory || "Select Category"}</span>
        <span className="text-xs opacity-70">{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <div className="absolute right-0 bottom-full mb-2 w-56 max-h-60 overflow-auto rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white shadow-xl z-50">
          <ul>
            {categories.map((cat) => (
              <li
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.name);
                  setExpanded(false);
                }}
                className={`cursor-pointer px-4 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-950/60 ${
                  cat.name === selectedCategory
                    ? "bg-indigo-100 dark:bg-indigo-950 font-medium text-indigo-700 dark:text-indigo-300"
                    : ""
                }`}
              >
                {cat.name}
              </li>
            ))}
          </ul>

          <div className="border-t border-gray-200 dark:border-gray-700 p-2">
            {addingNew ? (
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCategory();
                    }
                  }}
                  placeholder="New category..."
                  className="flex-1 min-w-0 px-2 py-1 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-2.5 py-1 text-xs rounded-lg bg-indigo-600 text-white font-medium"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAddingNew(true)}
                className="w-full text-left px-2 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                + Add New Category
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
