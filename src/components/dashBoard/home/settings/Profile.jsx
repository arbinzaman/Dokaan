import { useState } from "react";
import { User, Settings } from "lucide-react";
import SettingSection from "./SettingSection";
import { useUser } from "../../../../contexts/AuthContext";
import ProfileUpdateModal from "../../Profile/ProfileUpdateModal";
import { Tooltip } from "@mui/material";

const Profile = () => {
  const { user } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);

  const initials = (user?.name || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <SettingSection icon={User} title="Profile">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-4 w-full">
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={user?.name || "Profile"}
                className="rounded-full w-16 h-16 object-cover border-2 border-indigo-500 shadow-sm"
              />
            ) : (
              <div className="rounded-full w-16 h-16 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xl flex items-center justify-center border-2 border-indigo-200 dark:border-indigo-800 flex-shrink-0">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {user?.name || "Unnamed User"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                {user?.email}
              </p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 capitalize">
                {user?.role || "member"}
              </span>
            </div>
          </div>

          <Tooltip title="Edit Profile" arrow>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              aria-label="Edit Profile"
              className="self-end sm:self-auto p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>
      </SettingSection>

      {isModalOpen && (
        <ProfileUpdateModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          user={user}
        />
      )}
    </>
  );
};

export default Profile;
