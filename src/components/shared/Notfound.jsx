// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-transparent text-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-pink-500">
          404
        </h1>
        <p className="mt-4 text-xl font-medium text-gray-300">
          Page not found
        </p>
        <p className="mt-2 text-sm text-gray-400">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <Link
          to="/dashboard"
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-xl hover:bg-gray-200 transition-all shadow-lg"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
