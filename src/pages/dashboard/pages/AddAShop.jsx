import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useUser } from "../../../contexts/AuthContext";
import toast from "react-hot-toast";
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
import { useThemeMode } from "../../../contexts/ThemeContext";

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

const AddAShop = () => {
  const [imageError, setImageError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, addShop } = useUser();
  const { mode } = useThemeMode();
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

  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewImage) URL.revokeObjectURL(previewImage);
      setForm((prev) => ({ ...prev, dokaan_imageUrl: file }));
      setPreviewImage(URL.createObjectURL(file));
      setImageError("");
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
    if (isSubmitting) return;
    setImageError("");
    setIsSubmitting(true);

    const token = Cookies.get("XTOKEN");

    try {
      const formData = new FormData();
      formData.append("dokaan_name", form.dokaan_name.trim());
      formData.append("dokaan_location", form.dokaan_location.trim());
      if (form.dokaan_Tin_Certificate.trim()) {
        formData.append(
          "dokaan_Tin_Certificate",
          form.dokaan_Tin_Certificate.trim()
        );
      }
      formData.append("dokaan_email", form.dokaan_email.trim());
      formData.append("dokaan_phone", form.dokaan_phone.trim());
      formData.append("dokaan_type", form.dokaan_type);
      formData.append("ownerId", user?.id);
      formData.append("email", user?.email);

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
        const createdShop =
          res.data?.data?.dokaan || res.data?.data || res.data?.dokaan;
        if (createdShop && createdShop.id) {
          addShop(createdShop);
        }
        toast.success("Shop added successfully!");
        navigate("/dashboard/shop");
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to add shop.";
      if (msg.toLowerCase().includes("image")) {
        setImageError(msg);
      }
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDark = mode === "dark";

  return (
    <div className="max-w-xl mx-auto px-2 sm:px-4 py-6">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
          Add New Shop
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="flex items-center gap-2 mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
              <Briefcase className="text-indigo-500" size={16} />
              Shop Name
            </span>
            <input
              type="text"
              name="dokaan_name"
              value={form.dokaan_name}
              onChange={handleChange}
              placeholder="e.g., Rahim Battery Center"
              required
              className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          <label className="block">
            <span className="flex items-center gap-2 mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
              <MapPin className="text-amber-500" size={16} />
              Location
            </span>
            <input
              type="text"
              name="dokaan_location"
              value={form.dokaan_location}
              onChange={handleChange}
              placeholder="e.g., Dhanmondi, Dhaka"
              required
              className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          <div className="block">
            <span className="flex items-center gap-2 mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
              <ImagePlus className="text-emerald-500" size={16} />
              Shop Image (Optional)
            </span>
            <div className="flex items-center gap-3">
              <label
                htmlFor="dokaan_image"
                className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ImagePlus size={16} />
                Upload Image
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
                  alt="Shop preview"
                  className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                />
              )}
            </div>
            {imageError && (
              <p className="text-xs text-red-500 mt-1.5">{imageError}</p>
            )}
          </div>

          <label className="block">
            <span className="flex items-center gap-2 mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
              <FileText className="text-indigo-500" size={16} />
              TIN Certificate (Optional)
            </span>
            <input
              type="text"
              name="dokaan_Tin_Certificate"
              value={form.dokaan_Tin_Certificate}
              onChange={handleChange}
              placeholder="e.g., 123456789012"
              className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          <div className="flex flex-col sm:flex-row gap-4">
            <label className="w-full sm:w-1/2 block">
              <span className="flex items-center gap-2 mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
                <Mail className="text-sky-500" size={16} />
                Email
              </span>
              <input
                type="email"
                name="dokaan_email"
                value={form.dokaan_email}
                onChange={handleChange}
                placeholder="shop@example.com"
                required
                className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>

            <label className="w-full sm:w-1/2 block">
              <span className="flex items-center gap-2 mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
                <Phone className="text-emerald-500" size={16} />
                Phone
              </span>
              <input
                type="tel"
                name="dokaan_phone"
                value={form.dokaan_phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
              <Tag className="text-purple-500" size={16} />
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
                  backgroundColor: isDark ? "#1f2937" : "#ffffff",
                  borderColor: isDark ? "#374151" : "#d1d5db",
                  borderRadius: "0.75rem",
                  minHeight: "42px",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: isDark ? "#f9fafb" : "#111827",
                }),
                input: (base) => ({
                  ...base,
                  color: isDark ? "#f9fafb" : "#111827",
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: isDark ? "#1f2937" : "#ffffff",
                  color: isDark ? "#f9fafb" : "#111827",
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused
                    ? isDark
                      ? "#374151"
                      : "#eef2ff"
                    : "transparent",
                  color: isDark ? "#f9fafb" : "#111827",
                }),
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors"
          >
            {isSubmitting ? "Adding Shop..." : "Add Shop"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAShop;
