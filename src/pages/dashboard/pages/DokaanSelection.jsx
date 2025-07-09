import { Briefcase, MapPin } from "lucide-react";
import { useUser } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const DokaanSelection = () => {
  const { dokaan, setSavedShop, savedShop } = useUser();
  const navigate = useNavigate();

  // Convert dokaan to an array if it's a single object
  const dokaanList = Array.isArray(dokaan) ? dokaan : dokaan ? [dokaan] : [];

  const handleSelect = (shop) => {
    setSavedShop(shop);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-black via-[#1c0c0c] to-[#2e0f0f]">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center">
        🛍️ Select Your Shop
      </h2>

      <div className="grid w-full max-w-3xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center">
        {dokaanList.map((shop) => (
          <div
            key={shop.id}
            onClick={() => handleSelect(shop)}
            className={`relative cursor-pointer backdrop-blur-md rounded-xl overflow-hidden border p-3 w-64 transition-all duration-300 ${
              savedShop?.id === shop.id
                ? "border-red-500 bg-gradient-to-tr from-red-600/70 to-black/40 scale-105 shadow-lg"
                : "border-white/20 bg-black/30 hover:scale-105 hover:border-red-400"
            }`}
          >
            <div className="w-full h-28 bg-black/20 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
              {shop.dokaan_imageUrl ? (
                <img
                  src={shop.dokaan_imageUrl}
                  alt={shop.dokaan_name}
                  className="object-cover w-full h-full rounded-lg"
                />
              ) : (
                <Briefcase className="text-red-400 w-8 h-8" />
              )}
            </div>

            <h3 className="text-md font-semibold text-white mb-1 flex items-center gap-2">
              {shop.dokaan_name}
            </h3>
            <p className="text-xs text-red-300 flex items-center gap-1">
              <MapPin size={14} /> {shop.dokaan_location}
            </p>
            <p className="text-xs text-red-400 mt-1 truncate">
              📞 {shop.dokaan_phone}
            </p>
            <p className="text-xs text-red-400 truncate">
              📧 {shop.dokaan_email}
            </p>

            {savedShop?.id === shop.id && (
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow">
                Selected
              </div>
            )}
          </div>
        ))}
      </div>

      {savedShop && (
        <div className="mt-8 text-center text-green-400 text-md font-medium">
          ✅ You selected <strong>{savedShop.dokaan_name}</strong> in{" "}
          {savedShop.dokaan_location}
        </div>
      )}
    </div>
  );
};

export default DokaanSelection;
