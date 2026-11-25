import { useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useUser } from "../../../contexts/AuthContext";
import CredentialModal from "./CredentialModal";
import { Loader2 } from "lucide-react";

const safeJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

const TwoFactorAuth = () => {
  const { user, updateTwoFactor } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [loading, setLoading] = useState(false);

  const isEnabled = Boolean(user?.twoFactorEnabled);

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
        setModalType("enable");
        setIsModalOpen(true);
      } else {
        const errorData = await safeJson(response);
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

      const data = await safeJson(response);
      if (response.ok) {
        toast.success(data.message || "2FA disabled.");
        updateTwoFactor(false);
        setIsModalOpen(false);
        return { success: true };
      } else {
        toast.error(data.message || "Failed to disable 2FA.");
        return { success: false, message: data.message };
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

      const data = await safeJson(response);
      if (response.ok) {
        toast.success(data.message || "2FA enabled.");
        updateTwoFactor(true);
        setIsModalOpen(false);
        return { success: true };
      } else {
        toast.error(data.message || "Failed to verify OTP.");
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Verify OTP Error:", error);
      toast.error("Something went wrong!");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (loading) return;
    if (isEnabled) {
      setModalType("disable");
      setIsModalOpen(true);
    } else {
      handleEnable2FA();
    }
  };

  return (
    <div className="w-full max-w-md p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 flex flex-col items-start gap-4 sm:flex-row sm:justify-between sm:items-center">
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Two-Factor Authentication
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Protect your account with email OTP verification.
        </p>
      </div>

      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isEnabled}
          onChange={handleToggle}
          disabled={loading}
        />
        <div className="w-16 h-9 bg-gray-300 dark:bg-gray-700 rounded-full peer peer-checked:bg-emerald-500 transition-colors duration-300" />
        <div
          className={`absolute top-1 left-1 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white transition-transform duration-300 ${
            isEnabled
              ? "translate-x-7 bg-emerald-600"
              : "translate-x-0 bg-gray-500"
          }`}
        >
          {loading ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : isEnabled ? (
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
