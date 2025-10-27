import { useState } from "react";

const CredentialModal = ({ isOpen, onClose, onSubmit, modalType }) => {
  const [input, setInput] = useState("");

  const handleSubmit = async () => {
    if (input.trim() === "") {
      alert(modalType === "disable" ? "Password cannot be empty" : "OTP cannot be empty");
      return;
    }

    try {
      const result = await onSubmit({ [modalType === "disable" ? "password" : "otp"]: input });
      if (!result?.success && modalType === "disable") {
        alert(result?.message || "Password verification failed.");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert("An error occurred while processing your request.");
    } finally {
      setInput(""); // Clear the input field
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="modal-content bg-slate-600 p-6 rounded shadow-md relative">
        <button
          className="close absolute top-2 right-2 text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-4">
          {modalType === "disable"
            ? "Enter Password to Disable Two-Factor Authentication"
            : "Enter OTP to Enable Two-Factor Authentication"}
        </h2>
        <input
          type={modalType === "disable" ? "password" : "text"}
          placeholder={modalType === "disable" ? "Enter password" : "Enter OTP"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded w-full"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CredentialModal;
