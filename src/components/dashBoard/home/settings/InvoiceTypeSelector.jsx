import { useState } from "react";
import { motion } from "framer-motion";
import { ReceiptLong } from "@mui/icons-material";

const InvoiceTypeSelector = () => {
  const [selectedType, setSelectedType] = useState(
    () => localStorage.getItem("invoiceType") || "POS"
  );

  const handleChange = (type) => {
    setSelectedType(type);
    localStorage.setItem("invoiceType", type);
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 shadow-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-800 mb-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center mb-3">
        <ReceiptLong className="text-indigo-500 mr-3" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Invoice Layout
        </h2>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Choose your default invoice format for printing receipts:
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => handleChange("POS")}
          className={`text-sm font-semibold px-4 py-2 rounded-xl border transition-colors ${
            selectedType === "POS"
              ? "bg-indigo-600 border-indigo-600 text-white"
              : "bg-transparent border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          POS (Thermal Receipt)
        </button>
        <button
          type="button"
          onClick={() => handleChange("A4")}
          className={`text-sm font-semibold px-4 py-2 rounded-xl border transition-colors ${
            selectedType === "A4"
              ? "bg-indigo-600 border-indigo-600 text-white"
              : "bg-transparent border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          A4 (Full Page)
        </button>
      </div>
    </motion.div>
  );
};

export default InvoiceTypeSelector;
