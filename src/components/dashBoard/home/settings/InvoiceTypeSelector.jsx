// InvoiceTypeSelector.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {  ReceiptLong } from "@mui/icons-material";

const InvoiceTypeSelector = () => {
  const [selectedType, setSelectedType] = useState("POS");

  useEffect(() => {
    const saved = localStorage.getItem("invoiceType");
    if (saved) setSelectedType(saved);
  }, []);

  const handleChange = (type) => {
    setSelectedType(type);
    localStorage.setItem("invoiceType", type);
  };

  return (
    <motion.div
      className="bg-purple-900 bg-opacity-50 backdrop-blur-lg shadow-lg rounded-xl p-6 border border-purple-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center mb-4">
        <ReceiptLong className="text-yellow-300 mr-3" />
        <h2 className="text-xl font-semibold text-gray-100">Invoice Type</h2>
      </div>
      <p className="text-white mb-4">Select your preferred invoice layout:</p>

      <div className="flex gap-4">
        <button
          onClick={() => handleChange("POS")}
          className={`${
            selectedType === "POS"
              ? "bg-yellow-500 text-black"
              : "bg-transparent border border-yellow-400 text-yellow-300"
          } font-semibold px-4 py-2 rounded transition`}
        >
          POS (Receipt)
        </button>
        <button
          onClick={() => handleChange("A4")}
          className={`${
            selectedType === "A4"
              ? "bg-yellow-500 text-black"
              : "bg-transparent border border-yellow-400 text-yellow-300"
          } font-semibold px-4 py-2 rounded transition`}
        >
          A4 (Full Page)
        </button>
      </div>
    </motion.div>
  );
};

export default InvoiceTypeSelector;
