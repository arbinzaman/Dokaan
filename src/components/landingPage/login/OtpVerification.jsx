import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const token = Cookies.get("XTOKEN");
  
  const handleVerifyOtp = async () => {
    try {
      setIsVerifying(true);
    //   const token = localStorage.getItem("access_token"); // Retrieve stored token
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({ otp }),
      });
  
      if (response.status === 200) {
        toast.success("OTP verified successfully!");
        setOtp(""); // Clear OTP field
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-sm p-6 space-y-4 rounded-md shadow-md">
        <h1 className="text-xl font-bold text-center text-black">Verify OTP</h1>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none"
        />
        <button
          onClick={handleVerifyOtp}
          disabled={isVerifying}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          {isVerifying ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
};

export default OtpVerification;
