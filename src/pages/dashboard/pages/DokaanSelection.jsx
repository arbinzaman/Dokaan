import { Briefcase, MapPin, Phone, Mail } from "lucide-react";
import { useUser } from "../../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const DokaanSelection = () => {
  const { dokaan, selectShop, savedShop } = useUser();
  const navigate = useNavigate();

  const dokaanList = Array.isArray(dokaan)
    ? dokaan.filter(Boolean)
    : dokaan
      ? [dokaan]
      : [];

  const handleSelect = (shop) => {
    selectShop(shop);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center">
        Select Your Shop
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 text-center">
        Choose the store branch you want to manage right now.
      </p>

      {dokaanList.length === 0 ? (
        <div className="text-center space-y-4">
          <p className="text-gray-500 dark:text-gray-400">
            No shops found for your account.
          </p>
          <Link
            to="/dashboard/add-shop"
            className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium text-sm"
          >
            + Add Your First Shop
          </Link>
        </div>
      ) : (
        <div className="grid w-full max-w-4xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {dokaanList.map((shop) => {
            const isSelected = savedShop?.id === shop.id;
            return (
              <button
                type="button"
                key={shop.id}
                onClick={() => handleSelect(shop)}
                className={`relative text-left rounded-2xl overflow-hidden border p-4 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isSelected
                    ? "border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-md"
                    : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-indigo-400 hover:shadow-md"
                  }`}
              >
                <div className="w-full h-28 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-3 overflow-hidden">
                  {shop.dokaan_imageUrl ? (
                    <img
                      src={shop.dokaan_imageUrl}
                      alt={shop.dokaan_name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Briefcase className="text-indigo-500 w-8 h-8" />
                  )}
                </div>

                <h3 className="text-base font-semibold mb-1 truncate">
                  {shop.dokaan_name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 truncate">
                  <MapPin size={13} /> {shop.dokaan_location}
                </p>
                {shop.dokaan_phone && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1 truncate">
                    <Phone size={13} /> {shop.dokaan_phone}
                  </p>
                )}
                {shop.dokaan_email && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1 truncate">
                    <Mail size={13} /> {shop.dokaan_email}
                  </p>
                )}

                {isSelected && (
                  <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                    Selected
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DokaanSelection;
