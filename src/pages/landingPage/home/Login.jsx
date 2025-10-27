import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // Error message state
  const navigate = useNavigate();
  const { login } = useUser();

  const handleLogin = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    setError("");

    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    if (!email || !password) {
      setError("Email and password are required! ❌");
      setIsLoading(false);
      return;
    }

    try {
      // Call login and await response
      const res = await login(email, password);

      if (res && res.data && res.data.status === 200) {
        const { data } = res;

        if (data.user.twoFactorEnabled) {
          toast.loading("Sending OTP...");

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

            if (!otpRes.ok) throw new Error();

            toast.dismiss(); // remove loading
            toast.success("OTP sent successfully! 📩");
            navigate("/verify-otp");
          } catch (err) {
            toast.dismiss();
            setError("Failed to send OTP.");
          }
        } else {
          const userRole = data.user.role; // Assuming 'role' field exists
          if (userRole === "employee") {
            navigate("/dashboard");
          } else if (userRole === "shop-owner") {
            const shops = data.user.shops || []; // Adjust according to your actual user object

            if (shops.length === 1) {
              // Only one shop, go directly to dashboard
              navigate("/dashboard");
            } else {
              // Multiple shops, let user select
              navigate("/select-shop");
            }
          } else {
            navigate("/dashboard");
          }
        }
      } else {
        setError("Invalid email or password! ❌");
      }
    } catch (err) {
      setError("Something went wrong. ❌");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center text-white">Login</h1>
        <form onSubmit={handleLogin} noValidate className="space-y-6">
          <div className="space-y-1 text-sm">
            <label htmlFor="email" className="block text-white">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none"
            />
          </div>
          <div className="relative space-y-1 text-sm">
            <label htmlFor="password" className="block text-white">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none"
            />
            <p
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 cursor-pointer"
            >
              {showPassword ? (
                <FaEyeSlash className="text-gray-500" />
              ) : (
                <FaEye className="text-gray-500" />
              )}
            </p>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}{" "}
            {/* Show error below password */}
          </div>
          {!isLoading ? (
            <button
              type="submit"
              className="w-full p-3 text-center rounded-sm text-black bg-white hover:bg-gray-300"
            >
              Sign In
            </button>
          ) : (
            <button className="flex justify-center items-center w-full p-3 rounded-sm bg-gray-200">
              <ThreeDots visible height="30" width="30" color="#0d72b9" />
            </button>
          )}
        </form>
        <p className="text-center text-white text-sm mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-400 ">
            Register at Dokaan
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
