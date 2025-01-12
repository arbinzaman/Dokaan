import { useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const TwoFactorAuth = ({ isEnabled, onToggle }) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const handleToggle = async () => {
    try {
      const token = Cookies.get("XTOKEN");
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/two-factor-auth`,
        {
          method: "PUT",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ enable: !isEnabled }),
        }
      );

      if (response.status === 200) {
        toast.success(`Two-Factor Authentication ${!isEnabled ? "enabled" : "disabled"} successfully`);
        onToggle(!isEnabled);

        // Optionally trigger OTP send when enabling 2FA
        if (!isEnabled) {
          await handleSendOtp();
        }
      } else {
        toast.error("Failed to update Two-Factor Authentication");
      }
    } catch (error) {
      console.error("Error toggling 2FA:", error);
      toast.error("Something went wrong!");
    }
  };

  const handleSendOtp = async () => {
    try {
      setIsSendingOtp(true);
      const token = Cookies.get("XTOKEN");
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

      if (response.status === 200) {
        toast.success("OTP sent successfully! Please check your email.");
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setIsVerifying(true);
      const token = Cookies.get("XTOKEN");
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

      if (response.status === 200) {
        toast.success("OTP verified successfully!");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        className={`bg-${isEnabled ? "red" : "green"}-600 text-white py-2 px-4 rounded`}
        onClick={handleToggle}
      >
        {isEnabled ? "Disable" : "Enable"} Two-Factor Authentication
      </button>

      {isEnabled && (
        <div className="flex flex-col gap-2">
          <button
            className="bg-purple-600 text-white py-2 px-4 rounded"
            onClick={handleSendOtp}
            disabled={isSendingOtp}
          >
            {isSendingOtp ? "Sending OTP..." : "Send OTP"}
          </button>

          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="border p-2 rounded"
          />
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded"
            onClick={handleVerifyOtp}
            disabled={isVerifying}
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      )}
    </div>
  );
};

export default TwoFactorAuth;
