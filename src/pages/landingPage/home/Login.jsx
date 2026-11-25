import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../../../contexts/AuthContext";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Shield,
  Sparkles,
  Store,
  UserCheck,
} from "lucide-react";
import dokaanIcon from "../../../assets/Home/logos/DOKAAN Only D.png";
import { DEMO_ACCOUNTS } from "../../../demo/demoData";
import { activateDemoSession } from "../../../demo/mockServer";

const ROLE_ICONS = {
  "shop-owner": Store,
  employee: UserCheck,
  admin: Shield,
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login, setUser, setDokaan, selectShop } = useUser();

  const handleQuickDemo = (account) => {
    const session = activateDemoSession(account.email);
    setUser(session.user);
    setDokaan(session.dokaan);
    selectShop(session.savedShop);
    queryClient.clear();
    toast.success(`Signed in as ${account.label} (${account.name})`);
    navigate(account.role === "admin" ? "/dashboard/users" : "/dashboard");
  };

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
            toast.success("Demo OTP sent! Use 123456.");
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
            navigate("/dashboard/users");
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
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Instant 1-Click Demo Access */}
        <div className="lg:col-span-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 p-7 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-medium mb-4">
              <Sparkles size={13} />
              1-Click Offline Demo
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Explore every role instantly
            </h2>
            <p className="text-sm text-zinc-400 mt-1.5">
              No account or backend required. Pick a role below to jump straight
              into a pre-populated shop with live POS, inventory, invoices, and
              financial analytics.
            </p>

            <div className="mt-6 space-y-3">
              {DEMO_ACCOUNTS.map((account) => {
                const Icon = ROLE_ICONS[account.role] || Store;
                return (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => handleQuickDemo(account)}
                    className="w-full text-left p-4 rounded-2xl border border-zinc-800 bg-zinc-950/70 hover:border-red-500/60 hover:bg-zinc-900 transition-all group flex items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0">
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">
                          {account.label}
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2">
                          {account.description}
                        </p>
                        <p className="text-[11px] font-mono text-zinc-500 mt-1">
                          {account.email} / {account.password}
                        </p>
                      </div>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all flex-shrink-0"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-zinc-500 mt-6">
            All edits, sales, and new items persist locally in your browser and
            can be reset anytime from the top demo bar.
          </p>
        </div>

        {/* Right: Standard Credentials Sign In */}
        <div className="lg:col-span-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 p-7 sm:p-8 shadow-2xl flex flex-col justify-center">
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
              Sign in with demo credentials or your new registration
            </p>
            <p className="mt-3 text-xs text-red-200/90 bg-red-950/40 border border-red-900/60 rounded-xl px-3 py-2">
              Demo mode: any email + password (4+ characters) signs you in as a
              shop owner with sample shops.
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
                defaultValue="owner@dokaan.demo"
                autoComplete="email"
                placeholder="owner@dokaan.demo"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 text-white placeholder-zinc-500 border border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                defaultValue="demo123"
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 pr-11 rounded-xl bg-zinc-950 text-white placeholder-zinc-500 border border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
              className="text-red-400 hover:text-red-300 font-medium"
            >
              Register at Dokaan
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
