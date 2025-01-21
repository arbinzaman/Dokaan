import { useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useUser } from "../../../contexts/AuthContext";

const ProfileUpdateModal = ({ isOpen, onClose,  }) => {
  const { user ,setUser } = useUser(); // Use setUser from AuthContext
  // console.log(user.user); // Debugging: Check the user context
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    profileImage: null,
  });
  const [previewImage, setPreviewImage] = useState(user?.profileImageUrl);

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
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    if (formData?.name) formDataToSend.append("name", formData.name);
    if (formData?.email) formDataToSend.append("email", formData.email);
    if (formData?.profileImage) formDataToSend.append("profileImageUrl", formData.profileImage);
  
    const token = Cookies.get("XTOKEN");
  
    await toast.promise(
      (async () => {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/profile/${user?.id}`, {
          method: "PUT",
          headers: {
            Authorization: `${token}`,
          },
          body: formDataToSend,
        });
  
        const data = await response.json();
  
        if (response?.status === 200) {
          setUser(data.data); // Update AuthContext
          localStorage.setItem("user", JSON.stringify(data.data)); // Update localStorage
          onClose(); // Close the modal after successful update
          return data; // Resolve promise to trigger success toast
        } else {
          throw new Error(data.message || "Something went wrong.");
        }
      })(),
      {
        loading: "Updating profile...",
        success: <b>Profile updated successfully!</b>,
        error: <b>Could not update profile. Please try again.</b>,
      }
    ).catch((error) => {
      console.error("Error updating profile:", error);
    });
  };
  

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-gray-800 p-6 rounded-lg max-w-md mx-auto shadow-lg w-full">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-indigo-600 outline-none"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-indigo-600 outline-none"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
            />
          </div>
          {previewImage && (
            <div className="mt-4">
              <img
                src={previewImage}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>
          )}
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

export default ProfileUpdateModal;
