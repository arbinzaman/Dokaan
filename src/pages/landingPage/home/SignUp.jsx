import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/AuthContext"; // Adjust the path as needed
import toast from "react-hot-toast";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const navigate = useNavigate();
  const { login } = useUser(); // Assuming `login` is used to set the user context

  // Handle form submission
  const handleRegister = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const form = event.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const confirmPassword = form.confirmPassword.value.trim();

    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        await response.json();
        // Automatically log in the user after registration
        const loginStatus = await login(email, password);
        if (loginStatus === 200) {
          toast.success("Registration successful!");
          navigate("/dashboard"); // Redirect to the homepage
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password input change
  const handlePasswordChange = (event) => {
    const { name } = event.target;
    if (name === "password" || name === "confirmPassword") {
      setPasswordsMatch(true); // Reset the error message when user starts typing
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center text-white">New Account</h1>
        <form onSubmit={handleRegister} noValidate className="space-y-6">
          <div className="space-y-2 text-sm">
            <label htmlFor="name" className="block text-white">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Name"
              required
              className="w-full px-4 py-3 rounded-md border border-gray-300 text-black focus:border-primary focus:outline-none bg-white"
            />
            <label htmlFor="email" className="block text-white">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              required
              className="w-full px-4 py-3 rounded-md border border-gray-300 text-black focus:border-primary focus:outline-none bg-white"
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
              onChange={handlePasswordChange}
              required
              className="w-full px-4 py-3 rounded-md border border-gray-300 text-black focus:border-primary focus:outline-none bg-white"
            />
            <p
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 hover:cursor-pointer"
            >
              {showPassword ? (
                <FaEyeSlash className="text-gray-500" />
              ) : (
                <FaEye className="text-gray-500" />
              )}
            </p>
          </div>

          <div className="relative space-y-1 text-sm">
            <label htmlFor="confirmPassword" className="block text-white">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm Password"
              onChange={handlePasswordChange}
              required
              className="w-full px-4 py-3 rounded-md border border-gray-300 text-black focus:border-primary focus:outline-none bg-white"
            />
            <p
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 hover:cursor-pointer"
            >
              {showConfirmPassword ? (
                <FaEyeSlash className="text-gray-500" />
              ) : (
                <FaEye className="text-gray-500" />
              )}
            </p>
          </div>

          {!passwordsMatch && (
            <p className="text-sm text-red-500">
              Passwords do not match! Please try again.
            </p>
          )}

          {!isLoading ? (
            <button
              type="submit"
              disabled={isLoading}
              className="block w-full p-3 text-center rounded-sm text-black bg-white hover:bg-secondary"
            >
              Sign up
            </button>
          ) : (
            <button className="flex justify-center items-center w-full p-3 text-center rounded-sm text-white bg-background">
              <ThreeDots
                visible={true}
                height="30"
                width="30"
                color="#0d72b9"
                radius="9"
                ariaLabel="three-dots-loading"
              />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignUp;
