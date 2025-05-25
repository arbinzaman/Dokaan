import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useUser } from "../../../contexts/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Image,
  FileText,
  Mail,
  Phone,
  Tag,
} from "lucide-react";

const AddAShop = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    dokaan_name: "",
    dokaan_location: "",
    dokaan_imageUrl: null, // changed to file
    dokaan_Tin_Certificate: "",
    dokaan_email: "",
    dokaan_phone: "",
    dokaan_type: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "dokaan_imageUrl"
          ? files[0] // handle file upload
          : name === "dokaan_Tin_Certificate"
          ? Number(value)
          : value,
    }));
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "your_upload_preset"); // 🔁 Replace with your Cloudinary preset
    data.append("cloud_name", "your_cloud_name"); // 🔁 Replace with your Cloudinary cloud name

    const res = await axios.post("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", data);
    return res.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("XTOKEN");

    try {
      toast.loading("Uploading image...");
      const imageUrl = await uploadToCloudinary(form.dokaan_imageUrl);

      const payload = {
        ...form,
        dokaan_imageUrl: imageUrl,
        ownerId: user?.id,
      };

      await axios.post(`${import.meta.env.VITE_BASE_URL}/dokaan`, payload, {
        headers: { Authorization: token },
      });

      toast.dismiss();
      toast.success("Shop added successfully!", {
        position: "bottom-center",
        duration: 3000,
        style: {
          background: "#333",
          color: "#fff",
          padding: "12px 24px",
          fontWeight: "600",
          borderRadius: "10px",
        },
      });

      setTimeout(() => {
        navigate("/dashboard/shops");
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error("Failed to add shop.", {
        position: "bottom-center",
        duration: 3000,
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <Toaster />
      <div className="backdrop-blur-md bg-white/10 dark:bg-gray-800/30 border border-white/20 rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          🏪 Add New Shop
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Shop Name */}
          <label className="block">
            <span className="flex items-center gap-2 mb-1 text-sm text-white font-medium">
              <Briefcase className="text-pink-400 animate-pulse" size={20} />
              Shop Name
            </span>
            <input
              type="text"
              name="dokaan_name"
              value={form.dokaan_name}
              onChange={handleChange}
              placeholder="e.g., Rahim Battery Center"
              required
              className="w-full p-2 rounded-lg border border-white/30 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </label>

          {/* Shop Location */}
          <label className="block">
            <span className="flex items-center gap-2 mb-1 text-sm text-white font-medium">
              <MapPin className="text-yellow-400 animate-pulse" size={20} />
              Location
            </span>
            <input
              type="text"
              name="dokaan_location"
              value={form.dokaan_location}
              onChange={handleChange}
              placeholder="e.g., Dhanmondi, Dhaka"
              required
              className="w-full p-2 rounded-lg border border-white/30 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </label>

          {/* Image File */}
          <label className="block">
            <span className="flex items-center gap-2 mb-1 text-sm text-white font-medium">
              <Image className="text-green-400 animate-pulse" size={20} />
              Shop Image
            </span>
            <input
              type="file"
              name="dokaan_imageUrl"
              accept="image/*"
              onChange={handleChange}
              required
              className="w-full text-white"
            />
          </label>

          {/* TIN Certificate */}
          <label className="block">
            <span className="flex items-center gap-2 mb-1 text-sm text-white font-medium">
              <FileText className="text-indigo-400 animate-pulse" size={20} />
              TIN Certificate (Optional)
            </span>
            <input
              type="number"
              name="dokaan_Tin_Certificate"
              value={form.dokaan_Tin_Certificate}
              onChange={handleChange}
              placeholder="e.g., 12345678"
              className="w-full p-2 rounded-lg border border-white/30 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </label>

          {/* Email & Phone */}
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="w-full sm:w-1/2 block">
              <span className="flex items-center gap-2 mb-1 text-sm text-white font-medium">
                <Mail className="text-blue-400 animate-pulse" size={20} />
                Email
              </span>
              <input
                type="email"
                name="dokaan_email"
                value={form.dokaan_email}
                onChange={handleChange}
                placeholder="shop@example.com"
                required
                className="w-full p-2 rounded-lg border border-white/30 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>

            <label className="w-full sm:w-1/2 block">
              <span className="flex items-center gap-2 mb-1 text-sm text-white font-medium">
                <Phone className="text-yellow-400 animate-pulse" size={20} />
                Phone
              </span>
              <input
                type="text"
                name="dokaan_phone"
                value={form.dokaan_phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                className="w-full p-2 rounded-lg border border-white/30 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </label>
          </div>

          {/* Type */}
          <label className="block">
            <span className="flex items-center gap-2 mb-1 text-sm text-white font-medium">
              <Tag className="text-red-400 animate-pulse" size={20} />
              Shop Type
            </span>
            <input
              type="text"
              name="dokaan_type"
              value={form.dokaan_type}
              onChange={handleChange}
              placeholder="e.g., Retail, Wholesale"
              className="w-full p-2 rounded-lg border border-white/30 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 hover:from-purple-500 hover:to-green-400 text-white font-semibold py-2 rounded-xl transition-all shadow-lg hover:scale-105"
          >
            🏪 Add Shop
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAShop;
