const InventoryTable = ({ items, loading }) => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className="h-20 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
            />
          ))}
        </div>
      );
    }
  
    if (!items || items.length === 0) {
      return (
        <>
          <div className="text-center text-gray-500 dark:text-gray-400">No inventory items found.<br />Please add some product.</div>
          
        </>
      );
    }
  
    return (
      <div className="grid gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg shadow-sm border hover:shadow-md transition bg-white dark:bg-gray-900 dark:border-gray-700"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
              {/* Product Image */}
              <img
                src={item.imageUrl || "/placeholder.png"}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md border"
              />
  
              {/* Product Info */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{item.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  barcode: {item.code || "N/A"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Quantity: {item?.initialStock ||0}
                </p>
              </div>
  
              {/* Stock Info */}
              <div className="text-right sm:text-left">
                {item.initialStock > 0 ? (
                  <span className="text-green-600 font-medium">{item.stock} in stock</span>
                ) : (
                  <span className="text-red-500 font-medium">Out of stock</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default InventoryTable;
  