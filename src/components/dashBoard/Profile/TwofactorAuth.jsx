import { useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useUser } from "../../../contexts/AuthContext";

const TwoFactorAuth = ({ isEnabled, onToggle }) => {
  const { user,updateTwoFactor } = useUser();
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false); // Track OTP verification
  const [password, setPassword] = useState(""); // State to hold password
  const [isPasswordRequired, setIsPasswordRequired] = useState(false); // To toggle password input

  const handleToggle = async () => {
    if (!password) {
      setIsPasswordRequired(true);
      return;
    }
  
    const token = Cookies.get("XTOKEN");
  
    toast.promise(
      fetch(`${import.meta.env.VITE_BASE_URL}/auth/two-factor-auth`, {
        method: "PUT",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enable: !isEnabled, password }),
      })
        .then(async (response) => {
          if (response.status === 200) {
            onToggle(!isEnabled);
            
            // Update the twoFactorEnabled value in context and localStorage
            updateTwoFactor(!isEnabled);
            
            if (!isEnabled) {
              await handleSendOtp(); // Send OTP when enabling
            }
          } else {
            const errorData = await response.json();
            toast.error(errorData.message || "Failed to toggle 2FA");
          }
        })
        .catch((error) => {
          console.error("Error toggling 2FA:", error);
          throw error;
        }),
      {
        loading: `${isEnabled ? "Disabling" : "Enabling"} Two-Factor Authentication...`,
        success: `Two-Factor Authentication ${!isEnabled ? "enabled" : "disabled"} successfully!`,
        error: "Failed to update Two-Factor Authentication",
      }
    );
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
        setOtpVerified(true); // Mark OTP as verified

        // Update `localStorage` to reflect 2FA status change after OTP verification
        const updatedUser = { ...user, twoFactorEnabled: true };
        localStorage.setItem("user", JSON.stringify(updatedUser)); // Save updated user data in localStorage
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
      {/* Toggle Switch */}
      <label className="inline-flex items-center cursor-pointer">
        <span className="mr-2 text-white-700">Two-Factor Authentication</span>
        <div
          className={`relative w-11 h-6  transition duration-200 ease-in-out ${
            isEnabled ? "bg-indigo-600" : "bg-gray-400"
          } rounded-full`}
          onClick={handleToggle}
        >
          <div
            className={`absolute w-4 h-4 mt-1   bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
              isEnabled ? "translate-x-6" : "translate-x-0"
            }`}
          ></div>
        </div>
      </label>

      {/* Password input for enabling/disabling 2FA */}
      {user?.twoFactorEnabled === false && isPasswordRequired && (
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="border p-2 rounded"
          />
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded mt-2"
            onClick={handleToggle}
          >
            Submit
          </button>
        </div>
      )}

      {/* Show additional actions if enabled and OTP is not verified */}
      { user?.twoFactorEnabled === true || isEnabled && !otpVerified && (
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
