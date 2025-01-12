import { Lock } from "lucide-react";
import SettingSection from "./SettingSection";
// import ToggleSwitch from "./ToggleSwitch";
import ChangePasswordModal from "../../Profile/ChangePasswordModal";
import { useState } from "react";
import { useUser } from "../../../../contexts/AuthContext";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import TwoFactorAuth from "../../Profile/TwofactorAuth";

const Security = () => {
  const [twoFactor, setTwoFactor] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
    
  const { user, logout } = useUser();
  //   console.log(user);
  const navigate = useNavigate();

  const handlePasswordChange = async (passwordData) => {
    try {
      const token = Cookies.get("XTOKEN");
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/profile/change-password/${user?.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(passwordData),
        }
      );

      if (response.status === 200) {
        toast.success("Password changed successfully");
        logout();
        navigate("/login");
        setIsChangePasswordModalOpen(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Error changing password");
      }
    } catch (error) {
      console.error("Error while changing password:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <SettingSection icon={Lock} title={"Security"}>
        {/* <ToggleSwitch
          label={"Two-Factor Authentication"}
          isOn={twoFactor}
          onToggle={() => setTwoFactor(!twoFactor)}
        /> */}
<TwoFactorAuth isEnabled={twoFactor} onToggle={setTwoFactor} />

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
          onSubmit={handlePasswordChange}
        />
      )}
    </>
  );
};

export default Security;
