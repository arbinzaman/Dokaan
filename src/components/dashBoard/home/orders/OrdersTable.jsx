import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, X } from "lucide-react";

const INITIAL_ORDERS = [
  { id: "ORD001", customer: "Arif Hasan", total: 2350.0, status: "Delivered", date: "2026-11-18" },
  { id: "ORD002", customer: "Nusrat Jahan", total: 4120.0, status: "Processing", date: "2026-11-19" },
  { id: "ORD003", customer: "Tanvir Ahmed", total: 1625.5, status: "Shipped", date: "2026-11-20" },
  { id: "ORD004", customer: "Farhana Rahman", total: 7500.0, status: "Pending", date: "2026-11-21" },
  { id: "ORD005", customer: "Mehedi Karim", total: 958.0, status: "Delivered", date: "2026-11-22" },
  { id: "ORD006", customer: "Sadia Islam", total: 3107.5, status: "Processing", date: "2026-11-23" },
  { id: "ORD007", customer: "Rafiqul Alam", total: 5289.0, status: "Shipped", date: "2026-11-24" },
  { id: "ORD008", customer: "Tasnim Akter", total: 1896.0, status: "Delivered", date: "2026-11-25" },
];

const OrdersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = INITIAL_ORDERS.filter((order) => {
    const term = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(term) ||
      order.customer.toLowerCase().includes(term) ||
      order.status.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <motion.div
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl p-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Order List
          </h2>
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full sm:w-64 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800/60">
              <tr>
                {["Order ID", "Customer", "Total", "Status", "Date", "Actions"].map(
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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-8 text-sm text-gray-500 dark:text-gray-400"
                  >
                    No matching orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-5 py-3.5 whitespace-nowrap text-sm font-mono font-medium text-gray-900 dark:text-white">
                      {order.id}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                      {order.customer}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                      ৳{order.total.toFixed(2)}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-sm">
                      <span
                        className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${order.status === "Delivered"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                            : order.status === "Processing"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                              : order.status === "Shipped"
                                ? "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400"
                                : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                          }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {order.date}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-sm">
                      <button
                        type="button"
                        aria-label={`View order ${order.id}`}
                        onClick={() => setSelectedOrder(order)}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 p-1"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedOrder(null);
          }}
        >
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-xl relative">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Order {selectedOrder.id}
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>
                <strong>Customer:</strong> {selectedOrder.customer}
              </p>
              <p>
                <strong>Status:</strong> {selectedOrder.status}
              </p>
              <p>
                <strong>Date:</strong> {selectedOrder.date}
              </p>
              <p>
                <strong>Total:</strong> ৳{selectedOrder.total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersTable;
