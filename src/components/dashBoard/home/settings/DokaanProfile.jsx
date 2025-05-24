import { useState } from "react";
import SettingSection from "./SettingSection";
import { useUser } from "../../../../contexts/AuthContext";
import { GiShop } from "react-icons/gi";
import { FiEdit } from "react-icons/fi";
import DokaanUpdateModal from "../../Profile/DokaanUpdateModal";
import { Tooltip } from "@mui/material";
import { motion } from "framer-motion";

const DokaanProfile = () => {
  const { savedShop, user } = useUser(); // include user
  const [isModalOpen, setModalOpen] = useState(false);
  // console.log("User Role:", user?.role);
  // console.log("Condition:", user?.role === "shop-owner");

  const handleEditProfile = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <>
      <SettingSection icon={GiShop} title="Dokaan Profile">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4 w-full">
            <img
              src={savedShop?.dokaan_imageUrl}
              alt="Dokaan"
              className="rounded-full w-24 h-24 object-cover border-4 border-red-500 shadow-lg"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-black dark:text-white transition-colors">
                {savedShop?.dokaan_name}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors">
                {savedShop?.dokaan_email}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors">
                {savedShop?.dokaan_phone}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors">
                Type: {savedShop?.dokaan_type}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors">
                Location: {savedShop?.dokaan_location}
              </p>
            </div>

            {/* Only show edit button if user is not an employee */}
            {user?.role === "shop-owner" && (
              <Tooltip title="Edit Dokaan Profile" arrow>
                <motion.button
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditProfile}
                  className="inline-flex sm:inline-flex p-3 rounded-full bg-gray-200 dark:bg-gray-800 text-black dark:text-white shadow transition-all duration-200"
                >
                  <FiEdit className="w-5 h-5" />
                </motion.button>
              </Tooltip>
            )}
          </div>
        </div>
      </SettingSection>

      {isModalOpen && (
        <DokaanUpdateModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          dokaan={savedShop}
        />
      )}
    </>
  );
};

export default DokaanProfile;
