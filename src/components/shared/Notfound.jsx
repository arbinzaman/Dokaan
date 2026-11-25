import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "../../contexts/AuthContext";

const NotFound = () => {
  const { user } = useUser();
  const backPath = user ? "/dashboard" : "/";
  const backLabel = user ? "Back to Dashboard" : "Back to Home";

  return (
    <div className="min-h-screen w-full flex items-center justify-center pt-20 px-6 bg-transparent text-gray-900 dark:text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-md"
      >
        <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          404
        </h1>
        <p className="mt-4 text-xl font-semibold">Page not found</p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          to={backPath}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-md font-medium text-sm"
        >
          <ArrowLeft size={18} />
          {backLabel}
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
