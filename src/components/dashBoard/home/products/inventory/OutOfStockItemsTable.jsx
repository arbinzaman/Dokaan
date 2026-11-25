import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { useUser } from "../../../../../contexts/AuthContext";
import InventoryTableDetails from "./InventoryTableDetails";

const OutOfStockItemsTable = () => {
  const { state } = useLocation();
  const { savedShop } = useUser();

  const { data: fetchedItems = [], isLoading } = useQuery({
    queryKey: ["inventory", savedShop?.id],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/products`, {
        params: { shopId: savedShop?.id },
        headers: token ? { Authorization: token } : undefined,
      });
      return Array.isArray(res.data?.data) ? res.data.data : [];
    },
    enabled: !state?.items && !!savedShop?.id,
  });

  const items = state?.items || fetchedItems;
  const outOfStockItems = items.filter(
    (item) => Number(item?.stock ?? item?.initialStock ?? 0) <= 0
  );

  return (
    <div className="max-w-7xl mx-auto py-4 px-2 sm:px-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Out of Stock Items
      </h2>
      <InventoryTableDetails
        items={outOfStockItems}
        loading={!state?.items && isLoading}
      />
    </div>
  );
};

export default OutOfStockItemsTable;
