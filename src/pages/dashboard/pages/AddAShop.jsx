import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useUser } from "../../../contexts/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  ImagePlus,
  FileText,
  Mail,
  Phone,
  Tag,
} from "lucide-react";
import CreatableSelect from "react-select/creatable";

const AddAShop = () => {
  const [imageError, setImageError] = useState("");

  const { user ,logout } = useUser();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    dokaan_name: "",
    dokaan_location: "",
    dokaan_imageUrl: null,
    dokaan_Tin_Certificate: "",
    dokaan_email: "",
    dokaan_phone: "",
    dokaan_type: "",
  });

  const [previewImage, setPreviewImage] = useState(null);

  const categoryOptions = [
    { value: "Groceries", label: "Groceries" },
    { value: "Electronics", label: "Electronics" },
    { value: "Mobile Shop", label: "Mobile Shop" },
    { value: "Stationery", label: "Stationery" },
    { value: "Clothing", label: "Clothing" },
    { value: "Cosmetics", label: "Cosmetics" },
    { value: "Pharmacy", label: "Pharmacy" },
    { value: "Bakery", label: "Bakery" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "dokaan_Tin_Certificate" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        dokaan_imageUrl: file,
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleCategoryChange = (selectedOption) => {
    setForm((prev) => ({
      ...prev,
      dokaan_type: selectedOption ? selectedOption.value : "",
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setImageError(""); // Clear previous errors
  const token = Cookies.get("XTOKEN");

  try {
    const formData = new FormData();
    formData.append("dokaan_name", form.dokaan_name);
    formData.append("dokaan_location", form.dokaan_location);
    formData.append("dokaan_Tin_Certificate", form.dokaan_Tin_Certificate);
    formData.append("dokaan_email", form.dokaan_email);
    formData.append("dokaan_phone", form.dokaan_phone);
    formData.append("dokaan_type", form.dokaan_type);
    formData.append("ownerId", user?.id);
    formData.append("email", user?.email); // ✅ use email from context


    if (form.dokaan_imageUrl) {
      formData.append("dokaan_imageUrl", form.dokaan_imageUrl);
    }

    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/dokaan`,
      formData,
      {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.status === 200 || res.status === 201) {
      toast.success("Shop added successfully!");

      // ❗ Log out the user here
      setTimeout(() => {
        logout(); // from AuthContext
        navigate("/login");
      }, 1000);
    }
  } catch (error) {
    console.error(error);

    if (error.response?.data?.message?.toLowerCase().includes("image")) {
      setImageError(error.response.data.message);
    }

    toast.error("Failed to add shop.");
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

          {/* Image Upload */}
          <div className="block">
            <span className="flex items-center gap-2 mb-1 text-sm text-white font-medium">
              <ImagePlus className="text-green-400 animate-pulse" size={20} />
              Shop Image
            </span>
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
                <div>
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-10 h-10 rounded-full object-cover border border-red-400"
                  />
                  {imageError && (
                    <p className="text-sm text-red-400 mt-1">{imageError}</p>
                  )}
                </div>
              )}
            </div>
          </div>

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

          {/* Type/Category */}
          <div>
            <label className="block text-sm font-medium text-white mb-1 flex items-center gap-2">
              <Tag className="text-pink-400 animate-pulse" size={20} />
              Category
            </label>
            <CreatableSelect
              isClearable
              options={categoryOptions}
              onChange={handleCategoryChange}
              value={
                form.dokaan_type
                  ? { value: form.dokaan_type, label: form.dokaan_type }
                  : null
              }
              placeholder="Select or create category"
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "#1f2937",
                  borderColor: "#4b5563",
                  color: "#fff",
                }),
                singleValue: (base) => ({ ...base, color: "#fff" }),
                input: (base) => ({ ...base, color: "#fff" }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "#1f2937",
                  color: "#fff",
                }),
              }}
            />
          </div>

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
