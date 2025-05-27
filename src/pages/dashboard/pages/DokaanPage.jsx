import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { useUser } from "../../../contexts/AuthContext";
import StatCard from "../../../components/dashBoard/home/common/StatCard";
import DokaanTable from "../../../components/dashBoard/home/Shop/DokaanTable";
import { Link } from "react-router-dom";
import DokaanUpdateModal from "../../../components/dashBoard/Profile/DokaanUpdateModal";
import { useState } from "react";

const DokaanPage = () => {
  const { dokaan } = useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDokaan, setSelectedDokaan] = useState(null);

  const handleEditClick = (shop) => {
    setSelectedDokaan(shop);
    setIsModalOpen(true);
  };

  // Ensure dokaan is always an array
  const shopData = Array.isArray(dokaan) ? dokaan : [];

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Stat Card */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Dokaans"
            icon={Package}
            value={shopData.length}
            color="#6366F1"
          />
        </motion.div>

        {/* Add Dokaan Button */}
        <div className="mb-4">
          <Link to="/dashboard/add-shop">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              + Add Dokaan
            </button>
          </Link>
        </div>

        {/* Dokaan Table */}
        <DokaanTable
          shops={shopData}
          // loading={loading}
          onEdit={handleEditClick} // ✅ Corrected prop name
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
