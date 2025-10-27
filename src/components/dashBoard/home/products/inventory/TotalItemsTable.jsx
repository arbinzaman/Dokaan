import { useLocation } from "react-router-dom";
import InventoryTableDetails from "./InventoryTableDetails";

const TotalItemsTable = () => {
  const { state } = useLocation();
  const items = state?.items || [];

  if (!state?.items) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No inventory data available. Please go back to the Inventory page.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Products</h2>
      <InventoryTableDetails items={items} loading={false} />
    </div>
  );
};

export default TotalItemsTable;
