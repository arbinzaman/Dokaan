import { useUser } from "../../../contexts/AuthContext";

const DokaanProfile = () => {
  const { dokaan, savedShop, setSavedShop } = useUser();

  // Ensure dokaan is always an array
  const dokaanList = Array.isArray(dokaan) ? dokaan : dokaan ? [dokaan] : [];

  // Filter out current savedShop from list
  const otherDokaans = dokaanList.filter((d) => d.id !== savedShop?.id);

  return (
    <div className="flex flex-col items-center text-black dark:text-white w-full">
      {/* Current Shop Display */}
      {savedShop && (
        <div className="w-full bg-white/20 dark:bg-white/10 p-4 rounded-lg mb-4 text-left">
          <p className="text-xs uppercase text-white/60 mb-1">Current Shop</p>
          <p className="text-lg font-bold">{savedShop.dokaan_name}</p>
          <p className="text-sm text-white/70">{savedShop.dokaan_location}</p>
        </div>
      )}

      {/* Switch Shop Section */}
      <div className="w-full">
        <h4 className="text-sm mb-2 text-white/80 px-2">Switch Shop</h4>
        {otherDokaans.length === 0 ? (
          <p className="text-xs text-white/60 px-2">No other shops available</p>
        ) : (
          otherDokaans.map((shop) => (
            <button
              key={shop.id}
              onClick={() => {
                setSavedShop(shop);
                window.location.reload();
              }}
              className="w-full text-left px-3 py-2 text-xs rounded bg-white/10 hover:bg-white/20 mb-2"
            >
              <p className="font-semibold truncate">{shop.dokaan_name}</p>
              <p className="text-[10px] text-white/70 truncate">{shop.dokaan_location}</p>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default DokaanProfile;
