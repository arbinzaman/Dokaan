import { useState } from "react";
import { X, UserCircle2, Mail, ImagePlus, CheckCircle, Loader2 } from "lucide-react";
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
  const [previewImage, setPreviewImage] = useState(user?.profileImageUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, profileImage: file }));

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    if (formData.profileImage) {
      formDataToSend.append("profileImageUrl", formData.profileImage);
    }

    const token = Cookies.get("XTOKEN");

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/profile/${user?.id}`, {
        method: "PUT",
        headers: { Authorization: token },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.status === 200) {
        setUser(data.data);
        localStorage.setItem("user", JSON.stringify(data.data));
        toast("Profile Updated!", {
          icon: "🎉",
          style: {
            background: "#1f1f1f",
            color: "#fff",
            borderRadius: "10px",
          },
        });
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        throw new Error(data.message || "Update failed.");
      }
    } catch (err) {
      toast.error("❌ " + err.message, {
        style: {
          background: "#1f1f1f",
          color: "#fff",
          borderRadius: "10px",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-[#1f1f1f] w-[90%] sm:max-w-md p-6 rounded-xl shadow-lg animate-fadeIn">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-red-400 mb-6 text-center">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center gap-2">
            <UserCircle2 className="text-red-500" />
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Mail className="text-red-500" />
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="profileImage" className="cursor-pointer">
              <ImagePlus className="text-red-500 hover:scale-110 transition-transform" />
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
                className="w-10 h-10 rounded-full object-cover border border-red-400"
              />
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition flex items-center justify-center"
              disabled={isSubmitting}
              title="Update Profile"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdateModal;
