import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/AuthContext";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import dokaanIcon from "../../../assets/Home/logos/DOKAAN Only D.png";

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
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16">
      <div className="w-full max-w-md rounded-3xl bg-zinc-900/80 border border-zinc-800 p-7 sm:p-9 shadow-2xl">
        <div className="text-center mb-7">
          <img
            src={dokaanIcon}
            alt="Dokaan"
            className="w-11 h-11 mx-auto mb-3 object-contain"
          />
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Welcome back
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Sign in to manage your shop dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-zinc-300 mb-1.5"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              placeholder="owner@dokaan.app"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 text-white placeholder-zinc-500 border border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-zinc-300 mb-1.5"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 pr-11 rounded-xl bg-zinc-950 text-white placeholder-zinc-500 border border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-8 p-1 text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 disabled:opacity-60 font-semibold text-sm transition-colors inline-flex items-center justify-center gap-2 mt-2"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-zinc-400 text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Register at Dokaan
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
