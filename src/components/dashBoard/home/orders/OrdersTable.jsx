import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, X } from "lucide-react";

const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered"];

const statusBadgeClass = (status) => {
  if (status === "Delivered") {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400";
  }
  if (status === "Processing") {
    return "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400";
  }
  if (status === "Shipped") {
    return "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400";
  }
  return "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400";
};

const OrdersTable = ({ orders = [], loading = false, onStatusChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const safeOrders = Array.isArray(orders) ? orders : [];

  const filteredOrders = safeOrders.filter((order) => {
    const term = searchTerm.toLowerCase();
    return (
      String(order.id).toLowerCase().includes(term) ||
      order.customer?.toLowerCase().includes(term) ||
      order.status?.toLowerCase().includes(term)
    );
  });

  const handleSelectStatus = async (order, nextStatus) => {
    await onStatusChange?.(order.id, nextStatus);
    if (selectedOrder?.id === order.id) {
      setSelectedOrder({ ...order, status: nextStatus });
    }
  };

  return (
    <>
      <motion.div
        className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">
            Order List
          </h2>
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full sm:w-64 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 placeholder-slate-400 border border-slate-200 dark:border-zinc-700 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 text-slate-400"
              size={16}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-zinc-800">
            <thead className="bg-slate-50 dark:bg-zinc-800/60">
              <tr>
                {["Order ID", "Customer", "Total", "Status", "Date", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-8 text-sm text-slate-500 dark:text-zinc-400"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-8 text-sm text-slate-500 dark:text-zinc-400"
                  >
                    No matching orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <td className="px-5 py-3.5 whitespace-nowrap text-sm font-mono font-medium text-slate-900 dark:text-zinc-100">
                      {order.id}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-sm text-slate-700 dark:text-zinc-200">
                      {order.customer}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-zinc-100 tabular-nums">
                      ৳{Number(order.total || 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-sm">
                      <select
                        aria-label={`Change status for ${order.id}`}
                        value={order.status}
                        onChange={(e) => handleSelectStatus(order, e.target.value)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${statusBadgeClass(
                          order.status
                        )}`}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option
                            key={opt}
                            value={opt}
                            className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100"
                          >
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-sm text-slate-600 dark:text-zinc-300">
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
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-xl relative">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Order {selectedOrder.id}
            </h3>
            <div className="space-y-2.5 text-sm text-slate-700 dark:text-zinc-300">
              <p>
                <strong>Customer:</strong> {selectedOrder.customer}
              </p>
              {selectedOrder.phone && (
                <p>
                  <strong>Phone:</strong> {selectedOrder.phone}
                </p>
              )}
              {selectedOrder.items && (
                <p>
                  <strong>Items:</strong> {selectedOrder.items}
                </p>
              )}
              <p>
                <strong>Date:</strong> {selectedOrder.date}
              </p>
              <p>
                <strong>Total:</strong> ৳{Number(selectedOrder.total || 0).toFixed(2)}
              </p>
              <div className="pt-2">
                <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1">
                  Update Fulfillment Status
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleSelectStatus(selectedOrder, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersTable;
