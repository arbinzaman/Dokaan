import { motion } from "framer-motion";
import { LogOut } from "lucide-react"; // Icon for logout, change if desired
import { useUser } from "../../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const LogoutZone = () => {
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");

  };

  return (
    <motion.div
      className="bg-blue-900 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-blue-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center mb-4">
        <LogOut className="text-blue-400 mr-3" size={24} />
        <h2 className="text-xl font-semibold text-gray-100">Logout</h2>
      </div>
      <p className="text-gray-300 mb-4">Sign out from your account securely.</p>
      <button
        onClick={handleLogout}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
      >
        Logout
      </button>
    </motion.div>
  );
};

export default LogoutZone;
