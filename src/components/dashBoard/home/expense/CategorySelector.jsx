import { useState, useEffect, useRef } from "react";
import { FiGrid } from "react-icons/fi";
import toast from "react-hot-toast";

const CategorySelector = ({ shopId, selectedCategory, onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    if (!shopId) return;

    fetch(`${import.meta.env.VITE_BASE_URL}/expenses?shopId=${shopId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch expenses");
        return res.json();
      })
      .then((data) => {
        const allExpenses = data.data || [];

        // Extract unique category names
        const uniqueCategories = Array.from(
          new Set(allExpenses.map((item) => item.category).filter(Boolean))
        ).map((name, index) => ({ id: index, name }));

        setCategories(uniqueCategories);
      })
      .catch(() => toast.error("Failed to load categories"));
  }, [shopId]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setExpanded(false);
      }
    }
    if (expanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expanded]);

  const addNewCategory = async () => {
    const newCat = prompt("Enter new category:");
    if (!newCat || newCat.trim() === "") return;

    // Add locally only (since you're pulling categories from expenses)
    const newCategory = newCat.trim();

    // Check if category already exists
    const exists = categories.some((c) => c.name === newCategory);
    if (exists) {
      toast.error("Category already exists");
      return;
    }

    // Add to local list
    setCategories((prev) => [...prev, { id: Date.now(), name: newCategory }]);
    onSelectCategory(newCategory);
    setExpanded(false);
    toast.success("Category added (locally)");
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="flex items-center gap-2 bg-zinc-800 dark:bg-zinc-800 px-4 py-2 rounded text-black dark:text-white focus:outline-none"
        aria-expanded={expanded}
      >
        <FiGrid />
        {selectedCategory || "Select Category"}
        <span className="ml-2 rounded-xl">{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <ul
          className="absolute bottom-full mb-1 w-48 max-h-48 overflow-auto rounded bg-white dark:bg-zinc-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white z-50"
          style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.3)" }}
        >
          {categories.map((cat) => (
            <li
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.name);
                setExpanded(false);
              }}
              className={`cursor-pointer px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-600 ${
                cat.name === selectedCategory ? "bg-blue-200 dark:bg-blue-700" : ""
              }`}
            >
              {cat.name}
            </li>
          ))}

          <li
            onClick={addNewCategory}
            className="cursor-pointer px-4 py-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-700 border-t border-gray-300 dark:border-gray-700"
          >
            + Add New Category
          </li>
        </ul>
      )}
    </div>
  );
};

export default CategorySelector;
