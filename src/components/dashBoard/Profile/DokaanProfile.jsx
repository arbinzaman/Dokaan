import { useUser } from "../../../contexts/AuthContext";

const DokaanProfile = () => {
  const { dokaan, savedShop, setSavedShop } = useUser();

  // Filter out the current savedShop from the shop list
  const otherDokaans = dokaan?.filter((d) => d.id !== savedShop?.id) || [];

  return (
    <div className="flex flex-col items-center bg-transparent dark:bg-transparent text-black dark:text-white w-full">
      {/* Shop Switcher */}
      <div className="w-full mt-2">
        <h4 className="text-sm mb-2 text-white/80 px-2">Switch Shop</h4>
        {otherDokaans.length === 0 ? (
          <p className="text-xs text-white/60 px-2">No other shops available</p>
        ) : (
          otherDokaans.map((shop) => (
            <button
              key={shop.id}
              onClick={() => {
                setSavedShop(shop);
                window.location.reload(); // reload page after setting shop
              }}
              className="w-full text-left px-3 py-2 text-xs rounded bg-white/10 hover:bg-white/20 mb-1"
            >
              <p className="font-semibold">{shop.dokaan_name}</p>
              <p className="text-[10px] text-white/70 truncate">
                {shop.dokaan_location}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default DokaanProfile;
