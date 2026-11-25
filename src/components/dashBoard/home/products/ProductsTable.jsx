import { motion } from "framer-motion";
import { Edit, Package, Search, Trash2 } from "lucide-react";
import { useState } from "react";

const getImageSrc = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://") || imageUrl.startsWith("data:")) {
    return imageUrl;
  }
  return `${import.meta.env.VITE_BASE_URL}/products/${imageUrl}`;
};

const ProductsTable = ({ products = [], loading = false, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const safeProducts = Array.isArray(products) ? products : [];
  const filteredProducts = safeProducts.filter((product) => {
    const q = searchTerm.toLowerCase();
    return (
      product?.name?.toLowerCase().includes(q) ||
      product?.itemCategory?.toLowerCase().includes(q) ||
      product?.code?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl p-6 mb-8 mt-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Product List
        </h2>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by name, category, or barcode..."
            className="w-full sm:w-72 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            value={searchTerm}
          />
          <Search
            className="absolute left-3 top-2.5 text-gray-400"
            size={18}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800/60">
            <tr>
              {["Name", "Category", "Price", "Stock", "Sales", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-sm text-gray-500 dark:text-gray-400 py-8"
                >
                  Loading products...
                </td>
              </tr>
            ) : paginatedProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-sm text-gray-500 dark:text-gray-400 py-8"
                >
                  No products found.
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product) => {
                const imgSrc = getImageSrc(product.imageUrl);
                const stock = product.stock ?? product.initialStock ?? 0;
                const priceNum = Number(product.salesPrice);
                return (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-900 dark:text-white flex gap-3 items-center whitespace-nowrap">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={product.name || "Product"}
                          className="size-9 rounded-lg object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0"
                        />
                      ) : (
                        <div className="size-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                          <Package size={18} />
                        </div>
                      )}
                      <div>
                        <div>{product.name || "Unnamed"}</div>
                        {product.code && (
                          <div className="text-xs text-gray-400 font-normal">
                            {product.code}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {product.itemCategory || "Uncategorized"}
                    </td>

                    <td className="px-5 py-3.5 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {product.salesPrice != null && !Number.isNaN(priceNum)
                        ? `৳${priceNum.toFixed(2)}`
                        : "N/A"}
                    </td>

                    <td className="px-5 py-3.5 text-sm whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${stock > 10
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                            : stock > 0
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                              : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                          }`}
                      >
                        {stock}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {product.totalSold ?? product.sales?.length ?? 0}
                    </td>

                    <td className="px-5 py-3.5 text-sm whitespace-nowrap">
                      <button
                        type="button"
                        aria-label={`Edit ${product.name}`}
                        onClick={() => onEdit && onEdit(product)}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mr-3 p-1"
                      >
                        <Edit size={17} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${product.name}`}
                        onClick={() => onDelete && onDelete(product)}
                        className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 p-1"
                      >
                        <Trash2 size={17} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {filteredProducts.length > itemsPerPage && (
        <div className="flex justify-center items-center mt-6 gap-4">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={safePage === 1}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            Page {safePage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={safePage === totalPages}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ProductsTable;
