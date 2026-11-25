import { useSearchParams } from "react-router-dom";
import CustomersTable from "../../../dashBoard/home/customers/CustomersTable";

const CustomersListPage = () => {
  const [searchParams] = useSearchParams();
  const isFavoriteFilter = searchParams.get("favorite") === "true";

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {isFavoriteFilter ? "Favorite Customers" : "All Customers"}
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {isFavoriteFilter
          ? "Showing your top repeat and favorited customers."
          : "Browse and filter your entire customer directory."}
      </p>

      <CustomersTable favoriteOnly={isFavoriteFilter} />
    </div>
  );
};

export default CustomersListPage;
