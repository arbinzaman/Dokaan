import SettingSection from "./SettingSection";
import TwoFactorAuth from "../../Profile/TwofactorAuth";
import ChangePasswordModal from "../../Profile/ChangePasswordModal";
import { useState } from "react";
import { Lock } from "lucide-react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const Security = () => {
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);

  const handleChangePassword = async ({ oldPassword, newPassword }) => {
    const token = Cookies.get("XTOKEN");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: token } : {}),
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        }
      );

      let data = {};
      try {
        data = await response.json();
      } catch {
        // non-json response
      }

      if (response.ok) {
        toast.success(data.message || "Password updated successfully!");
        setIsChangePasswordModalOpen(false);
        return true;
      } else {
        toast.error(data.message || "Failed to update password.");
        return false;
      }
    } catch {
      toast.error("Something went wrong while updating password.");
      return false;
    }
  };

  return (
    <>
      <SettingSection icon={Lock} title="Security">
        <TwoFactorAuth />

        <div className="mt-4">
          <button
            type="button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
            onClick={() => setIsChangePasswordModalOpen(true)}
          >
            Change Password
          </button>
        </div>
      </SettingSection>

      {isChangePasswordModalOpen && (
        <ChangePasswordModal
          isOpen={isChangePasswordModalOpen}
          onClose={() => setIsChangePasswordModalOpen(false)}
          onSubmit={handleChangePassword}
        />
      )}
    </>
  );
};

export default Security;
