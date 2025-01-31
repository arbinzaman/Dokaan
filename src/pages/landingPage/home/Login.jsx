import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleLogin = async (event) => {
    try {
      setIsLoading(true);
      event.preventDefault();
      const form = event.target;
      const email = form.email.value;
      const password = form.password.value;

      // Wrap login in toast.promise
      toast.promise(
        login(email, password),
        {
          loading: 'Logging in... ⏳',
          success: <b>Login Success! 🎉</b>,
          error: <b>Could not login. Please try again. ❌</b>,
        }
      )
        .then((res) => {
          if (res.data.status === 200) {
            if (res.data.user.twoFactorEnabled) {
              toast.promise(
                fetch(`${import.meta.env.VITE_BASE_URL}/auth/send-otp`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `${res.data.access_token}`,
                  },
                }),
                {
                  loading: "Sending OTP... ⏳",
                  success: <b>OTP sent successfully! 📩</b>,
                  error: <b>Failed to send OTP. ❌</b>,
                }
              )
                .then(() => navigate("/verify-otp"))
                .catch(() => {});
            } else {
              // toast.success("Login successful! 🎉");
              navigate("/dashboard");
            }
          }
        })
        .catch(() => {
          toast.error("Invalid email or password! ❌");
        });
    } catch (error) {
      toast.error("Something went wrong. ❌");
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
            <label htmlFor="email" className="block text-white">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none"
            />
          </div>
          <div className="relative space-y-1 text-sm">
            <label htmlFor="password" className="block text-white">Password</label>
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
              {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
            </p>
          </div>
          {!isLoading ? (
            <button type="submit" className="w-full p-3 text-center rounded-sm text-black bg-white hover:bg-gray-300">
              Sign In
            </button>
          ) : (
            <button className="flex justify-center items-center w-full p-3 rounded-sm bg-gray-200">
              <ThreeDots visible height="30" width="30" color="#0d72b9" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
