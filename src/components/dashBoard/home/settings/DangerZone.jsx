import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const DangerZone = () => {
  const handleDeleteRequest = () => {
    const confirmed = window.confirm(
      "Are you sure you want to request permanent account deletion? This action cannot be undone."
    );
    if (confirmed) {
      toast.error(
        "Account deletion requires administrator verification. Please contact support@dokaan.app."
      );
    }
  };

  return (
    <motion.div
      className="bg-rose-50 dark:bg-rose-950/30 shadow-sm rounded-2xl p-6 border border-rose-200 dark:border-rose-900 mb-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center mb-3">
        <Trash2 className="text-rose-600 dark:text-rose-400 mr-3" size={22} />
        <h2 className="text-lg font-semibold text-rose-900 dark:text-rose-200">
          Danger Zone
        </h2>
      </div>
      <p className="text-sm text-rose-700 dark:text-rose-300/80 mb-4">
        Permanently delete your account and all associated shop records.
      </p>
      <button
        type="button"
        onClick={handleDeleteRequest}
        className="bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold py-2 px-4 rounded-xl transition-colors"
      >
        Delete Account
      </button>
    </motion.div>
  );
};

export default DangerZone;
