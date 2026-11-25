import { useState, useEffect } from "react";
import {
  X,
  UserCircle2,
  Mail,
  ImagePlus,
  CheckCircle,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useUser } from "../../../contexts/AuthContext";

const ProfileUpdateModal = ({ isOpen, onClose }) => {
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    profileImage: null,
  });
  const [previewImage, setPreviewImage] = useState(
    user?.profileImageUrl || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        profileImage: null,
      });
      setPreviewImage(user.profileImageUrl || null);
    }
  }, [isOpen, user]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (isOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, profileImage: file }));

    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    if (formData.profileImage) {
      formDataToSend.append("profileImageUrl", formData.profileImage);
    }

    const token = Cookies.get("XTOKEN");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/profile/${user?.id}`,
        {
          method: "PUT",
          headers: token ? { Authorization: token } : undefined,
          body: formDataToSend,
        }
      );

      let data = {};
      try {
        data = await response.json();
      } catch {
        // non-json response
      }

      if (response.ok) {
        const updatedUser = data?.data || data?.user || {
          ...user,
          name: formData.name,
          email: formData.email,
          ...(previewImage ? { profileImageUrl: previewImage } : {}),
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Profile updated!");
        onClose();
      } else {
        throw new Error(data.message || "Update failed.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-md p-6 rounded-2xl shadow-xl">
        <button
          type="button"
          aria-label="Close modal"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white transition"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5 text-center">
          Edit Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2.5">
            <UserCircle2 className="text-indigo-500 flex-shrink-0" size={18} />
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2.5">
            <Mail className="text-indigo-500 flex-shrink-0" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <label
                htmlFor="profileImage"
                className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ImagePlus className="text-indigo-500 w-4 h-4" />
                Change Photo
              </label>
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-700"
                />
              )}
            </div>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdateModal;
