import { useState, useEffect, useRef } from "react";
import { FiGrid } from "react-icons/fi";
import toast from "react-hot-toast";

const CategorySelector = ({ shopId, selectedCategory, onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    if (!shopId) return;
    fetch(`${import.meta.env.VITE_BASE_URL}/expenses/shop?shopId=${shopId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data) => {
        setCategories(data.data || []);
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

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/expenses/shop?shopId=${shopId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newCat.trim() }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to add category");
      }

      const data = await res.json();
      setCategories((prev) => [...prev, data.data]);
      onSelectCategory(data.data.name);
      setExpanded(false);
      toast.success("Category added");
    } catch (err) {
      toast.error(err.message || "Error adding category");
    }
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
        <span className="ml-2">{expanded ? "▲" : "▼"}</span>
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
