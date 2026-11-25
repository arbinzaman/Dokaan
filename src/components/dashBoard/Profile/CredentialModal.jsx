import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const CredentialModal = ({ isOpen, onClose, onSubmit, modalType }) => {
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (isOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (input.trim() === "") {
      toast.error(
        modalType === "disable"
          ? "Password cannot be empty."
          : "OTP cannot be empty."
      );
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        [modalType === "disable" ? "password" : "otp"]: input.trim(),
      });
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("An error occurred while processing your request.");
    } finally {
      setInput("");
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-center items-center px-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-xl relative w-full max-w-sm">
        <button
          type="button"
          aria-label="Close modal"
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl leading-none px-1.5"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 pr-6">
          {modalType === "disable"
            ? "Enter Password to Disable 2FA"
            : "Enter OTP to Enable 2FA"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type={modalType === "disable" ? "password" : "text"}
            placeholder={
              modalType === "disable" ? "Enter password" : "Enter OTP code"
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 px-4 rounded-xl w-full transition-colors"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CredentialModal;
