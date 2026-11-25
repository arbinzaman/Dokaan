import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/AuthContext";

const OtpVerificationModal = () => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const { user, dokaan, selectShop } = useUser();
  const token = Cookies.get("XTOKEN");

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error("Please enter the OTP code.");
      return;
    }

    try {
      setIsVerifying(true);
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({ otp: otp.trim() }),
        }
      );

      if (response.ok) {
        toast.success("OTP verified successfully!");
        setOtp("");
        const shops = Array.isArray(dokaan) ? dokaan : dokaan ? [dokaan] : [];
        if (user?.role === "shop-owner" && shops.length > 1) {
          navigate("/select-shop");
        } else {
          if (shops.length === 1) selectShop(shops[0]);
          navigate("/dashboard");
        }
      } else {
        let message = "Invalid OTP. Please try again.";
        try {
          const errData = await response.json();
          if (errData?.message) message = errData.message;
        } catch {
          // fallback message
        }
        toast.error(message);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-sm p-6 space-y-4 rounded-2xl shadow-xl bg-n-7 border border-n-6">
        <button
          type="button"
          onClick={() => navigate("/login")}
          aria-label="Close"
          className="absolute top-3 right-3 text-n-4 hover:text-n-1 text-xl leading-none px-1.5"
        >
          ×
        </button>
        <h1 className="text-xl font-bold text-center text-n-1">Verify OTP</h1>
        <p className="text-xs text-center text-n-3">
          Enter the verification code sent to your registered email.{" "}
          <span className="text-indigo-400 font-medium">(Demo code: 123456)</span>
        </p>
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP code"
            className="w-full px-4 py-3 rounded-lg bg-n-8 text-n-1 placeholder-n-4 border border-n-6 focus:outline-none focus:border-color-1"
          />
          <button
            type="submit"
            disabled={isVerifying}
            className="w-full px-4 py-2.5 font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition-colors"
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerificationModal;
