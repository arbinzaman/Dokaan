import { useLocation } from "react-router-dom";
import InventoryTableDetails from "./InventoryTableDetails";

const InStockItemsTable = () => {
  const { state } = useLocation();
  const items = state?.items || [];
  const inStockItems = items.filter(item => item.initialStock > 0);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">In Stock Items</h2>
      <InventoryTableDetails items={inStockItems} loading={false} />
    </div>
  );
};

export default InStockItemsTable;
