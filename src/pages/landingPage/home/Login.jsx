import { useNavigate } from "react-router-dom";
// import { useUser } from "../../contexts/AuthContext";
import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
// import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
//   const { login } = useUser();

  const handleLogin = async (event) => {
    // try {
      setIsLoading(true);
      event.preventDefault();
      const form = event.target;
      const email = form.email.value;
      const password = form.password.value;
      console.log(email, password);
    //   const res = await login(email, password);

//       if (res === 200) {
//         navigate("/dashboard");
//       }
//       setIsLoading(false);
//     } catch (error) {
//       setIsLoading(false);
//       toast.error("Please enter valid email or password!");
//     }
  };

  return (
    <div className="flex items-center justify-center min-h-screen  px-4">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl  shadow-md">
        <h1 className="text-2xl font-bold text-center text-white">
          Login
        </h1>
        <form onSubmit={handleLogin} noValidate className="space-y-6">
          <div className="space-y-1 text-sm">
            <label htmlFor="email" className="block text-white">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="email"
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
            <div className="flex justify-end text-xs text-gray-500 hover:cursor-pointer my-1">
              <p onClick={() => navigate("/forgot-password")}>
                Forgot Password?
              </p>
            </div>
          </div>
          {!isLoading ? (
            <button
              type="submit"
              disabled={isLoading ? true : false}
              className={
                "block w-full p-3 text-center rounded-sm text-black bg-white hover:bg-secondary"
              }
            >
              Sign in
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
                wrapperStyle={{}}
                wrapperClass=""
              />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
