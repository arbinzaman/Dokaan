import { useState, useEffect } from "react";
import { X, ImagePlus, CheckCircle, Loader2, MapPin, Phone, Store } from "lucide-react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const DokaanUpdateModal = ({ isOpen, onClose, dokaan }) => {
  // Initialize with empty strings or null; will update with useEffect
  const [formData, setFormData] = useState({
    dokaan_name: "",
    dokaan_email: "",
    dokaan_phone: "",
    dokaan_type: "",
    dokaan_location: "",
    dokaan_image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update formData and previewImage when modal opens or dokaan changes
  useEffect(() => {
    if (isOpen && dokaan) {
      setFormData({
        dokaan_name: dokaan.dokaan_name || "",
        dokaan_email: dokaan.dokaan_email || "",
        dokaan_phone: dokaan.dokaan_phone || "",
        dokaan_type: dokaan.dokaan_type || "",
        dokaan_location: dokaan.dokaan_location || "",
        dokaan_image: null,
      });
      setPreviewImage(dokaan.dokaan_imageUrl || null);
    }
  }, [isOpen, dokaan]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, dokaan_image: file }));

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
    for (const key in formData) {
      if (key === "dokaan_image" && formData[key]) {
        formDataToSend.append("dokaan_imageUrl", formData[key]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }

    const token = Cookies.get("XTOKEN");

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/dokaan/${dokaan?.id}`, {
        method: "PUT",
        headers: { Authorization: token },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.status === 200) {
        toast.success("Dokaan updated!", {
          icon: "🏪",
          style: {
            background: "#1f1f1f",
            color: "#fff",
            borderRadius: "10px",
          },
        });
        setTimeout(() => onClose(), 1000);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative bg-[#1f1f1f] w-full max-w-md p-6 rounded-xl shadow-xl animate-fadeIn">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-red-400 mb-6 text-center">Edit Dokaan</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2">
            <Store className="text-red-500" />
            <input
              type="text"
              name="dokaan_name"
              placeholder="Shop name"
              value={formData.dokaan_name}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Phone className="text-red-500" />
            <input
              type="text"
              name="dokaan_phone"
              placeholder="Phone"
              value={formData.dokaan_phone}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="text-red-500" />
            <input
              type="text"
              name="dokaan_location"
              placeholder="Location"
              value={formData.dokaan_location}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <label htmlFor="dokaan_image" className="cursor-pointer">
                <ImagePlus className="text-red-500 hover:scale-110 transition-transform w-6 h-6" />
              </label>
              <input
                id="dokaan_image"
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

            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition flex items-center justify-center mx-auto sm:mx-0 w-12 h-12"
              disabled={isSubmitting}
              title="Update Dokaan"
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

export default DokaanUpdateModal;
