const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 text-white placeholder-zinc-500 border border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";

const ShopInfoForm = ({ shopData, setShopData, errors = {} }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-zinc-300 mb-1.5">
          Shop Name
        </label>
        <input
          type="text"
          value={shopData.dokaan_name}
          onChange={(e) =>
            setShopData({ ...shopData, dokaan_name: e.target.value })
          }
          placeholder="e.g., Dokaan Mart"
          className={inputClass}
        />
        {errors.dokaan_name && (
          <p className="text-xs text-rose-400 mt-1">{errors.dokaan_name}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-300 mb-1.5">
          Shop Location
        </label>
        <input
          type="text"
          value={shopData.dokaan_location}
          onChange={(e) =>
            setShopData({ ...shopData, dokaan_location: e.target.value })
          }
          placeholder="e.g., Dhanmondi, Dhaka"
          className={inputClass}
        />
        {errors.dokaan_location && (
          <p className="text-xs text-rose-400 mt-1">{errors.dokaan_location}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Shop Email
          </label>
          <input
            type="email"
            value={shopData.dokaan_email}
            onChange={(e) =>
              setShopData({ ...shopData, dokaan_email: e.target.value })
            }
            placeholder="shop@example.com"
            className={inputClass}
          />
          {errors.dokaan_email && (
            <p className="text-xs text-rose-400 mt-1">{errors.dokaan_email}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Shop Phone
          </label>
          <input
            type="tel"
            value={shopData.dokaan_phone}
            onChange={(e) =>
              setShopData({ ...shopData, dokaan_phone: e.target.value })
            }
            placeholder="01XXXXXXXXX"
            className={inputClass}
          />
          {errors.dokaan_phone && (
            <p className="text-xs text-rose-400 mt-1">{errors.dokaan_phone}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-300 mb-1.5">
          Shop Category
        </label>
        <select
          value={shopData.dokaan_type}
          onChange={(e) =>
            setShopData({ ...shopData, dokaan_type: e.target.value })
          }
          className={inputClass}
        >
          <option value="">Select category (optional)</option>
          <option value="Groceries">Groceries &amp; Super Shop</option>
          <option value="Electronics">Electronics &amp; Gadgets</option>
          <option value="Mobile Shop">Mobile &amp; Accessories</option>
          <option value="Clothing">Clothing &amp; Fashion</option>
          <option value="Pharmacy">Pharmacy &amp; Healthcare</option>
          <option value="Cosmetics">Cosmetics &amp; Personal Care</option>
          <option value="Stationery">Stationery &amp; Books</option>
          <option value="Bakery">Bakery &amp; Cafe</option>
        </select>
      </div>
    </div>
  );
};

export default ShopInfoForm;
