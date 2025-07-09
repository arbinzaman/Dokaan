import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import CustomersTable from "../../../dashBoard/home/customers/CustomersTable";
import { useSearchParams } from "react-router-dom";
import { useUser } from "../../../../contexts/AuthContext";

const CustomersListPage = () => {
  const { savedShop } = useUser();
  const [searchParams] = useSearchParams();
  const isFavoriteFilter = searchParams.get("favorite") === "true";

  const { data = {}, isLoading, isError } = useQuery({
    queryKey: ["customers", savedShop?.id],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const shopId = Number(savedShop?.id);

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/customers/stats`,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          params: { shopId },
        }
      );
      return response.data.data;
    },
    enabled: !!savedShop?.id,
  });

  const { customers = [] } = data;

  const filteredCustomers = isFavoriteFilter
    ? customers.filter((c) => c.isFavorite)
    : customers;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        {isFavoriteFilter ? "Favorite Customers" : "All Customers"}
      </h1>

      {isLoading && <p>Loading customers...</p>}
      {isError && <p>Failed to load customers.</p>}

      <CustomersTable customers={filteredCustomers} />
    </div>
  );
};

export default CustomersListPage;
