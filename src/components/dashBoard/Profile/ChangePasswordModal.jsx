import { useState } from "react";
import toast from "react-hot-toast";

const ChangePasswordModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("All fields are required!");
      return;
    }
  
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
  
    onSubmit({
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    });
  };
  

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-gray-800 p-6 rounded-lg max-w-md mx-auto shadow-lg w-full">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">
          Change Password
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">Old Password</label>
            <input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-indigo-600 outline-none"
              placeholder="Enter your old password"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-indigo-600 outline-none"
              placeholder="Enter your new password"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-indigo-600 outline-none"
              placeholder="Confirm your new password"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
