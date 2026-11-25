import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, selectShop } = useUser();

  const handleLogin = async (event) => {
    event.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError("");

    const form = event.target;
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) {
      setError("Email and password are required.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await login(email, password);
      const isOk =
        res && (res.status === 200 || res.data?.status === 200) && res.data?.user;

      if (isOk) {
        const { data } = res;

        if (data.user.twoFactorEnabled) {
          const toastId = toast.loading("Sending OTP...");

          try {
            const otpRes = await fetch(
              `${import.meta.env.VITE_BASE_URL}/auth/send-otp`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `${data.access_token}`,
                },
              }
            );

            if (!otpRes.ok) throw new Error("Failed to send OTP.");

            toast.dismiss(toastId);
            toast.success("OTP sent successfully!");
            navigate("/verify-otp");
          } catch (otpErr) {
            toast.dismiss(toastId);
            setError(otpErr?.message || "Failed to send OTP.");
          }
        } else {
          const userRole = data.user.role;
          const shops = Array.isArray(data.dokaan)
            ? data.dokaan
            : Array.isArray(data.user.shops)
            ? data.user.shops
            : data.dokaan
            ? [data.dokaan]
            : [];

          if (userRole === "employee") {
            if (shops[0]) selectShop(shops[0]);
            navigate("/dashboard");
          } else if (userRole === "shop-owner") {
            if (shops.length === 1) {
              selectShop(shops[0]);
              navigate("/dashboard");
            } else if (shops.length > 1) {
              navigate("/select-shop");
            } else {
              navigate("/dashboard");
            }
          } else {
            navigate("/dashboard");
          }
        }
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      setError(err?.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 pt-24 pb-12">
      <div className="w-full max-w-md p-8 space-y-5 rounded-2xl bg-n-7/80 border border-n-6 shadow-xl">
        <h1 className="text-2xl font-bold text-center text-n-1">Login</h1>
        <form onSubmit={handleLogin} noValidate className="space-y-5">
          <div className="space-y-1.5 text-sm">
            <label htmlFor="email" className="block text-n-2 font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg bg-n-8 text-n-1 placeholder-n-4 border border-n-6 focus:outline-none focus:border-color-1"
            />
          </div>
          <div className="relative space-y-1.5 text-sm">
            <label htmlFor="password" className="block text-n-2 font-medium">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 pr-11 rounded-lg bg-n-8 text-n-1 placeholder-n-4 border border-n-6 focus:outline-none focus:border-color-1"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-9 p-1 text-n-4 hover:text-n-1"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>
          {!isLoading ? (
            <button
              type="submit"
              className="w-full p-3 text-center font-semibold rounded-lg text-n-8 bg-n-1 hover:bg-n-2 transition-colors"
            >
              Sign In
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="flex justify-center items-center w-full p-3 rounded-lg bg-n-6 cursor-not-allowed"
            >
              <ThreeDots visible height="24" width="36" color="#ffffff" />
            </button>
          )}
        </form>
        <p className="text-center text-n-3 text-sm mt-4">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-color-1 hover:underline font-medium">
            Register at Dokaan
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
