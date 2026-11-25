import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useUser } from "../../../../contexts/AuthContext";

const LogoutZone = () => {
  const { logout } = useUser();

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl p-6 mb-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center mb-3">
        <LogOut className="text-indigo-500 mr-3" size={22} />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Sign Out
        </h2>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Sign out from your account securely on this device.
      </p>
      <button
        type="button"
        onClick={logout}
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-4 rounded-xl transition-colors"
      >
        Logout
      </button>
    </motion.div>
  );
};

export default LogoutZone;
