import { useUser } from "../../../contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const DokaanProfile = () => {
  const { dokaan, savedShop, selectShop } = useUser();
  const queryClient = useQueryClient();

  const dokaanList = Array.isArray(dokaan) ? dokaan : dokaan ? [dokaan] : [];
  const otherDokaans = dokaanList.filter((d) => d && d.id !== savedShop?.id);

  const handleSwitchShop = (shop) => {
    selectShop(shop);
    queryClient.invalidateQueries();
    toast.success(`Switched to ${shop.dokaan_name}`);
  };

  return (
    <div className="flex flex-col items-center text-gray-900 dark:text-white w-full">
      {savedShop && (
        <div className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3.5 rounded-xl mb-3 text-left">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-0.5">
            Current Shop
          </p>
          <p className="text-sm font-bold truncate">{savedShop.dokaan_name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {savedShop.dokaan_location}
          </p>
        </div>
      )}

      {otherDokaans.length > 0 && (
        <div className="w-full">
          <h4 className="text-xs font-medium mb-2 text-gray-500 dark:text-gray-400 px-1">
            Switch Shop
          </h4>
          <div className="space-y-1.5">
            {otherDokaans.map((shop) => (
              <button
                type="button"
                key={shop.id}
                onClick={() => handleSwitchShop(shop)}
                className="w-full text-left px-3 py-2 text-xs rounded-lg bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors"
              >
                <p className="font-semibold truncate">{shop.dokaan_name}</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                  {shop.dokaan_location}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DokaanProfile;
