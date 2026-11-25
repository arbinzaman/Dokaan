import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 text-white placeholder-zinc-500 border border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent";

const UserRegistrationForm = ({ userData, setUserData, errors = {} }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const mismatchError =
    userData.confirmPassword && userData.password !== userData.confirmPassword
      ? "Passwords do not match"
      : "";

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-zinc-300 mb-1.5">
          Full Name
        </label>
        <input
          type="text"
          value={userData.name}
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          placeholder="e.g., Karim Ahmed"
          className={inputClass}
        />
        {errors.name && (
          <p className="text-xs text-rose-400 mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-300 mb-1.5">
          Email Address
        </label>
        <input
          type="email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          placeholder="you@example.com"
          className={inputClass}
        />
        {errors.email && (
          <p className="text-xs text-rose-400 mt-1">{errors.email}</p>
        )}
      </div>

      <div className="relative">
        <label className="block text-xs font-medium text-zinc-300 mb-1.5">
          Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          value={userData.password}
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
          placeholder="Minimum 6 characters"
          className={`${inputClass} pr-10`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 top-8 p-1 text-zinc-500 hover:text-zinc-200"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        {errors.password && (
          <p className="text-xs text-rose-400 mt-1">{errors.password}</p>
        )}
      </div>

      <div className="relative">
        <label className="block text-xs font-medium text-zinc-300 mb-1.5">
          Confirm Password
        </label>
        <input
          type={showConfirmPassword ? "text" : "password"}
          value={userData.confirmPassword || ""}
          onChange={(e) =>
            setUserData({ ...userData, confirmPassword: e.target.value })
          }
          placeholder="Re-enter password"
          className={`${inputClass} pr-10`}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          aria-label={
            showConfirmPassword ? "Hide confirm password" : "Show confirm password"
          }
          className="absolute right-3 top-8 p-1 text-zinc-500 hover:text-zinc-200"
        >
          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        {(errors.confirmPassword || mismatchError) && (
          <p className="text-xs text-rose-400 mt-1">
            {errors.confirmPassword || mismatchError}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserRegistrationForm;
