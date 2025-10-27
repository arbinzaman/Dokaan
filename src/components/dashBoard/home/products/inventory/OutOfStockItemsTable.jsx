import { useLocation } from "react-router-dom";
import InventoryTableDetails from "./InventoryTableDetails";

const OutOfStockItemsTable = () => {
  const { state } = useLocation();
  const items = state?.items || [];

  const outOfStockItems = items.filter(item => item.initialStock <= 0);

  if (!state?.items) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No inventory data available. Please go back to the Inventory page.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Out of Stock Items</h2>
      <InventoryTableDetails items={outOfStockItems} loading={false} />
    </div>
  );
};

export default OutOfStockItemsTable;
