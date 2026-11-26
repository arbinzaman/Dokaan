import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { useUser } from "../../../contexts/AuthContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import StatCard from "../../../components/dashBoard/home/common/StatCard";
import DokaanTable from "../../../components/dashBoard/home/Shop/DokaanTable";
import { Link } from "react-router-dom";
import DokaanUpdateModal from "../../../components/dashBoard/Profile/DokaanUpdateModal";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const DokaanPage = () => {
  const { dokaan, setDokaan, savedShop, selectShop } = useUser();
  const { pick } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDokaan, setSelectedDokaan] = useState(null);

  const shopData = Array.isArray(dokaan)
    ? dokaan.filter(Boolean)
    : dokaan
    ? [dokaan]
    : [];

  const handleEditClick = (shop) => {
    setSelectedDokaan(shop);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (shop) => {
    if (shopData.length <= 1) {
      toast.error("You must keep at least one active shop.");
      return;
    }
    const confirmed = window.confirm(
      `Are you sure you want to delete "${shop.dokaan_name}"?`
    );
    if (!confirmed) return;

    try {
      const token = Cookies.get("XTOKEN");
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/dokaan/${shop.id}`, {
        headers: token ? { Authorization: token } : undefined,
      });
      const updatedList = shopData.filter((s) => s.id !== shop.id);
      setDokaan(updatedList);
      if (savedShop?.id === shop.id && updatedList[0]) {
        selectShop(updatedList[0]);
      }
      toast.success("Shop deleted successfully.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete shop.");
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-4 px-2 sm:px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {pick("My Shops", "আমার দোকানসমূহ")}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {pick(
                "Manage all your shop branches, addresses, and contact info.",
                "আপনার সব দোকান ও শাখার তথ্য এখানে পরিচালনা করুন।"
              )}
            </p>
          </div>
          <Link
            to="/dashboard/add-shop"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-indigo-600 text-white px-4 py-3 sm:py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
          >
            + {pick("Add New Shop", "নতুন দোকান যোগ")}
          </Link>
        </div>

        {/* Stat Card */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <StatCard
            name={pick("Total Shops", "মোট দোকান")}
            icon={Package}
            value={shopData.length}
            color="#DC2626"
          />
        </motion.div>

        {/* Dokaan Table */}
        <DokaanTable
          shops={shopData}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
        <DokaanUpdateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          dokaan={selectedDokaan}
        />
      </main>
    </div>
  );
};

export default DokaanPage;
