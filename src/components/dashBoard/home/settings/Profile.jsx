import { useState } from "react";
import { User, Settings } from "lucide-react";
import SettingSection from "./SettingSection";
import { useUser } from "../../../../contexts/AuthContext";
import ProfileUpdateModal from "../../Profile/ProfileUpdateModal";
import { Tooltip } from "@mui/material";
import { motion } from "framer-motion";

const Profile = () => {
  const { user } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleEditProfile = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <SettingSection icon={User} title="Profile">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4 w-full">
          <div className="flex items-center gap-4 w-full">
            <img
              src={user?.profileImageUrl}
              alt="Profile Picture"
              className="rounded-full w-20 h-20 object-cover border-4 border-red-500 shadow-lg"
            />
            <div>
              <h3 className="text-lg font-semibold text-black dark:text-white transition-colors">
                {user?.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Responsive button on the right for mobile and desktop */}
          <Tooltip title="Edit Profile" arrow>
            <motion.button
              onClick={handleEditProfile}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="self-end sm:self-auto p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-black dark:text-white shadow transition-colors"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </Tooltip>
        </div>
      </SettingSection>

      {isModalOpen && (
        <ProfileUpdateModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          user={user?.user}
        />
      )}
    </>
  );
};

export default Profile;
