import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { useUser } from "../../../../contexts/AuthContext";

const fetchFixedCosts = async (shopId, token) => {
  const res = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/expenses`,
    {
      params: { shopId },
      headers: token ? { Authorization: token } : undefined,
    }
  );
  const list = Array.isArray(res.data?.data) ? res.data.data : [];
  return list.filter((c) => c?.type === "fixed");
};

const FixedCostList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, savedShop } = useUser();
  const [payingId, setPayingId] = useState(null);

  const savedShopId = savedShop?.id;
  const token = Cookies.get("XTOKEN") || user?.token;

  const {
    data: costs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["fixed-costs", savedShopId],
    queryFn: () => fetchFixedCosts(savedShopId, token),
    enabled: !!savedShopId,
  });

  const handleMarkPaid = async (id) => {
    if (payingId === id) return;
    setPayingId(id);
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/expenses/${id}`,
        { isPaid: true },
        {
          headers: token ? { Authorization: token } : undefined,
        }
      );
      toast.success("Marked as paid");
      queryClient.invalidateQueries({ queryKey: ["fixed-costs", savedShopId] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to mark as paid.");
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 space-y-5">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Fixed Monthly Costs
        </h2>

        <button
          type="button"
          onClick={() => navigate("/dashboard/save-fixed-cost")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Add Fixed Cost
        </button>
      </div>

      {isLoading && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
          Loading fixed costs...
        </p>
      )}

      {isError && (
        <p className="text-center text-sm text-red-500 py-4">
          Failed to load fixed costs. Please try again.
        </p>
      )}

      {!isLoading && !isError && costs.length === 0 && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
          No fixed costs saved yet.
        </p>
      )}

      {!isLoading && !isError && costs.length > 0 && (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {costs.map((cost) => (
            <li
              key={cost.id}
              className="flex justify-between items-center p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {cost.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  ৳{Number(cost.amount ?? 0).toFixed(2)} •{" "}
                  <span className="capitalize">{cost.category || "Fixed"}</span>
                </p>
              </div>

              {cost.isPaid ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <CheckCircle2 size={14} />
                  Paid
                </span>
              ) : (
                <button
                  type="button"
                  disabled={payingId === cost.id}
                  onClick={() => handleMarkPaid(cost.id)}
                  className="px-3 py-1.5 text-xs font-semibold border border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 disabled:opacity-50 rounded-xl transition-colors"
                >
                  {payingId === cost.id ? "Updating..." : "Mark as Paid"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FixedCostList;
