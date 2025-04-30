import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";

const ProductDetails = () => {
  const { id } = useParams();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/products/id/${id}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      return res.data.data;
    },
  });
console.log(product);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white dark:bg-gray-900 shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
      <img src={product.imageUrl || "/placeholder.png"} className="w-40 h-40 mb-4" />
      <p><strong>Barcode:</strong> {product.code}</p>
      <p><strong>Category:</strong> {product.itemCategory}</p>
      <p><strong>Description:</strong> {product.description || "No description"}</p>
      <p><strong>Initial Stock:</strong> {product.initialStock}</p>
      <p><strong>Current Stock:</strong> {product.stock}</p>
      <p><strong>Added Date:</strong> {new Date(product.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default ProductDetails;
