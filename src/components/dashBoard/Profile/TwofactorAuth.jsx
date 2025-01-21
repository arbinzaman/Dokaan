import { useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useUser } from "../../../contexts/AuthContext";
import CredentialModal from "./CredentialModal";

const TwoFactorAuth = () => {
  const { user, updateTwoFactor } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "enable" or "disable"

  const handleEnable2FA = async () => {
    const token = Cookies.get("XTOKEN");

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("OTP sent successfully. Check your email to complete the process.");
        setIsModalOpen(true);
        setModalType("enable");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error enabling Two-Factor Authentication:", error);
      toast.error("Something went wrong!");
    }
  };

  const handleDisable2FA = async ({ password }) => {
    const token = Cookies.get("XTOKEN");

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/disable-2fa`, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const responseData = await response.json();
        toast.success(responseData.message || "Two-Factor Authentication disabled successfully!");
        updateTwoFactor(false); // Update context API
        setIsModalOpen(false); // Close modal
        return { success: true };
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to disable Two-Factor Authentication.");
        return { success: false, message: errorData.message };
      }
    } catch (error) {
      console.error("Error disabling Two-Factor Authentication:", error);
      toast.error("Something went wrong!");
      return { success: false };
    }
  };

  const handleVerifyOtp = async ({ otp }) => {
    const token = Cookies.get("XTOKEN");

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp }),
      });

      if (response.ok) {
        const responseData = await response.json();
        toast.success(responseData.message || "Two-Factor Authentication enabled successfully!");
        updateTwoFactor(true); // Update context API
        setIsModalOpen(false); // Close modal
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to verify OTP.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div>
      {user?.twoFactorEnabled ? (
        <button
          className="bg-red-600 text-white py-2 px-4 rounded"
          onClick={() => {
            setIsModalOpen(true);
            setModalType("disable");
          }}
        >
          Disable Two-Factor Authentication
        </button>
      ) : (
        <button
          className="bg-green-600 text-white py-2 px-4 rounded"
          onClick={handleEnable2FA}
        >
          Enable Two-Factor Authentication
        </button>
      )}

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
