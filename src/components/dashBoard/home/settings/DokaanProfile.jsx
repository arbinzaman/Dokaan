import { useState } from "react";
import SettingSection from "./SettingSection";
import { useUser } from "../../../../contexts/AuthContext";
import { GiShop } from "react-icons/gi";
import { FiEdit } from "react-icons/fi";
import DokaanUpdateModal from "../../Profile/DokaanUpdateModal";
import { Tooltip } from "@mui/material";
import { Store } from "lucide-react";

const DokaanProfile = () => {
  const { savedShop, user } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);

  if (!savedShop) return null;

  return (
    <>
      <SettingSection icon={GiShop} title="Dokaan Profile">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full">
            {savedShop?.dokaan_imageUrl ? (
              <img
                src={savedShop.dokaan_imageUrl}
                alt={savedShop.dokaan_name || "Dokaan"}
                className="rounded-2xl w-20 h-20 object-cover border border-gray-200 dark:border-gray-700 shadow-sm flex-shrink-0"
              />
            ) : (
              <div className="rounded-2xl w-20 h-20 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-900 flex-shrink-0">
                <Store size={32} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {savedShop.dokaan_name}
              </h3>
              {savedShop.dokaan_email && (
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  {savedShop.dokaan_email}
                </p>
              )}
              {savedShop.dokaan_phone && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {savedShop.dokaan_phone}
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {savedShop.dokaan_type ? `${savedShop.dokaan_type} • ` : ""}
                {savedShop.dokaan_location}
              </p>
            </div>

            {user?.role === "shop-owner" && (
              <Tooltip title="Edit Dokaan Profile" arrow>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  aria-label="Edit Dokaan Profile"
                  className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiEdit className="w-5 h-5" />
                </button>
              </Tooltip>
            )}
          </div>
        </div>
      </SettingSection>

      {isModalOpen && (
        <DokaanUpdateModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          dokaan={savedShop}
        />
      )}
    </>
  );
};

export default DokaanProfile;
