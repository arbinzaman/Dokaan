import SettingSection from "./SettingSection";
import TwoFactorAuth from "../../Profile/TwofactorAuth";
import ChangePasswordModal from "../../Profile/ChangePasswordModal";
import { useState } from "react";
import { Lock } from "lucide-react";

const Security = () => {
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  return (
    <>
      <SettingSection icon={Lock} title={"Security"}>
        {/* Two-Factor Authentication Settings */}
        <TwoFactorAuth />

        {/* Change Password Button */}
        <div className="mt-4">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200"
            onClick={() => setIsChangePasswordModalOpen(true)}
          >
            Change Password
          </button>
        </div>
      </SettingSection>

      {/* Change Password Modal */}
      {isChangePasswordModalOpen && (
        <ChangePasswordModal
          isOpen={isChangePasswordModalOpen}
          onClose={() => setIsChangePasswordModalOpen(false)}
        />
      )}
    </>
  );
};

export default Security;
