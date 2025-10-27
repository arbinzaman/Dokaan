import { useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useUser } from "../../../contexts/AuthContext";
import CredentialModal from "./CredentialModal";
import { Loader2 } from "lucide-react";

const TwoFactorAuth = () => {
  const { user, updateTwoFactor } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "enable" or "disable"
  const [loading, setLoading] = useState(false);

  const handleEnable2FA = async () => {
    setLoading(true);
    const token = Cookies.get("XTOKEN");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/send-otp`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("OTP sent. Check your email.");
        setIsModalOpen(true);
        setModalType("enable");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Enable 2FA Error:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async ({ password }) => {
    setLoading(true);
    const token = Cookies.get("XTOKEN");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/disable-2fa`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        toast.success(responseData.message || "2FA disabled.");
        updateTwoFactor(false);
        setIsModalOpen(false);
        return { success: true };
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to disable 2FA.");
        return { success: false };
      }
    } catch (error) {
      console.error("Disable 2FA Error:", error);
      toast.error("Something went wrong!");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async ({ otp }) => {
    setLoading(true);
    const token = Cookies.get("XTOKEN");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        toast.success(responseData.message || "2FA enabled.");
        updateTwoFactor(true);
        setIsModalOpen(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to verify OTP.");
      }
    } catch (error) {
      console.error("Verify OTP Error:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (loading) return;
    if (user?.twoFactorEnabled) {
      setModalType("disable");
      setIsModalOpen(true);
    } else {
      handleEnable2FA();
    }
  };

  return (
    <div className="w-full max-w-md p-5 rounded-xl border bg-white shadow-md flex flex-col items-start gap-4 sm:flex-row sm:justify-between sm:items-center">
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
          Two-Factor Authentication
        </h3>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Protect your account by enabling 2FA.
        </p>
      </div>

      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={user?.twoFactorEnabled}
          onChange={handleToggle}
        />
        <div className="w-16 h-9 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-300 shadow-inner" />
        <div
          className={`absolute top-1 left-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white transition-transform duration-300 ${
            user?.twoFactorEnabled
              ? "translate-x-7 bg-green-600"
              : "translate-x-0 bg-gray-500"
          }`}
        >
          {loading ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : user?.twoFactorEnabled ? (
            "ON"
          ) : (
            "OFF"
          )}
        </div>
      </label>

      <CredentialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={modalType === "disable" ? handleDisable2FA : handleVerifyOtp}
        modalType={modalType}
      />
    </div>
  );
};

export default TwoFactorAuth;
