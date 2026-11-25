import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";

const InventoryTable = ({ items, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, idx) => (
          <div
            key={idx}
            className="h-20 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-500 dark:text-gray-400">
        No inventory items found. Add a product to get started.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => {
        const stock = Number(item?.stock ?? item?.initialStock ?? 0);
        const price = Number(item?.salesPrice ?? 0);
        return (
          <div
            key={item.id}
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/dashboard/product/${item.id}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate(`/dashboard/product/${item.id}`);
              }
            }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-xs hover:shadow-sm transition bg-white dark:bg-gray-900 cursor-pointer"
          >
            <div className="flex items-center gap-4 w-full">
              <div className="size-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                <Package size={20} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Barcode: {item.code || "N/A"} •{" "}
                  {item.itemCategory || "Uncategorized"}
                </p>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-0.5">
                  Price: ৳{price.toFixed(2)}
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                {stock > 0 ? (
                  <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                    {stock} in stock
                  </span>
                ) : (
                  <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
                    Out of stock
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InventoryTable;
