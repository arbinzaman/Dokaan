import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Handle form submission
  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      setIsLoading(false);
      return;
    }

    // Proceed with form submission logic (e.g., make API call)
    console.log(name, email, password);
    setIsLoading(false);
  };

  // Handle password input change
  const handlePasswordChange = (event) => {
    // eslint-disable-next-line no-unused-vars
    const { name, value } = event.target;
    if (name === "password" || name === "confirmPassword") {
      setPasswordsMatch(true); // Reset the error message when user starts typing
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center text-white">New Account</h1>
        <form onSubmit={handleLogin} noValidate className="space-y-6">
          <div className="space-y-2 text-sm">
            <label htmlFor="name" className="block text-white">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Name"
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
              disabled={isLoading ? true : false}
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
