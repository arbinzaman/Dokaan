import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { Edit, Package } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/products/id/${id}`,
        {
          headers: token ? { Authorization: `${token}` } : undefined,
        }
      );
      return res.data?.data ?? null;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-gray-500 dark:text-gray-400">
        Loading product details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-red-500">
        Error: {error.message}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-gray-500 dark:text-gray-400">
        Product not found.
      </div>
    );
  }

  const createdDate = product.createdAt ? new Date(product.createdAt) : null;
  const formattedDate =
    createdDate && !Number.isNaN(createdDate.getTime())
      ? createdDate.toLocaleString()
      : "N/A";
  const currentStock = Number(product.stock ?? product.initialStock ?? 0);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl text-gray-900 dark:text-white">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-20 h-20 rounded-2xl object-cover border border-gray-200 dark:border-gray-700"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Package size={32} />
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {product.itemCategory || "Uncategorized"} • Barcode:{" "}
              {product.code || "N/A"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() =>
            navigate("/dashboard/product-add", { state: { product } })
          }
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
        >
          <Edit size={16} />
          Edit Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60">
          <p className="text-gray-500 dark:text-gray-400">Purchase Price</p>
          <p className="text-lg font-semibold mt-0.5">
            ৳{Number(product.purchasePrice ?? 0).toFixed(2)}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60">
          <p className="text-gray-500 dark:text-gray-400">Sales Price</p>
          <p className="text-lg font-semibold mt-0.5">
            ৳{Number(product.salesPrice ?? 0).toFixed(2)}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60">
          <p className="text-gray-500 dark:text-gray-400">Current Stock</p>
          <p className="text-lg font-semibold mt-0.5">{currentStock} units</p>
        </div>
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60">
          <p className="text-gray-500 dark:text-gray-400">Added Date</p>
          <p className="text-sm font-medium mt-1">{formattedDate}</p>
        </div>
      </div>

      {product.description && (
        <div className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 text-sm">
          <p className="text-gray-500 dark:text-gray-400 mb-1">Description</p>
          <p>{product.description}</p>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
