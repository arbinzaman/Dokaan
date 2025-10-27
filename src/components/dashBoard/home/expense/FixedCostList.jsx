import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { useUser } from "../../../../contexts/AuthContext";

const fetchFixedCosts = async (shopId, token) => {
  console.log("🔍 fetchFixedCosts called with:", shopId, token);

  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/expenses?shopId=${shopId}`,
      {
        headers: {
          Authorization: token, // ✅ No Bearer
        },
      }
    );

    console.log("✅ Fetched data:", res.data);

    return res.data.data.filter((c) => c.type === "fixed");
  } catch (error) {
    console.error("❌ Error fetching fixed costs:", error);
    throw error;
  }
};

const FixedCostList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, savedShop } = useUser();

  const savedShopId = savedShop?.id;
  const contextToken = user?.token;
  const cookieToken = Cookies.get("XTOKEN");
  const token = contextToken || cookieToken;

  console.log("🧠 Context:", { savedShopId, token });

  const {
    data: costs = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["fixed-costs", savedShopId],
    queryFn: () => fetchFixedCosts(savedShopId, token),
    enabled: !!savedShopId && !!token,
  });

  const handleMarkPaid = async (id) => {
    console.log("🛠 Marking as paid:", id);
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/expenses/${id}`,
        { isPaid: true },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      toast.success("Marked as paid");
      queryClient.invalidateQueries(["fixed-costs", savedShopId]);
    } catch (err) {
      console.error("❌ Mark paid error:", err);
      toast.error("Failed to mark as paid");
    }
  };

  return (
    <div className="space-y-6 px-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Fixed Costs
        </h2>

        <button
          onClick={() => navigate("/dashboard/save-fixed-cost")}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow transition"
        >
          <PlusCircle className="w-5 h-5" />
          Save Fixed Cost
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <p className="text-center text-zinc-500 dark:text-zinc-400">
          🔄 Loading fixed costs...
        </p>
      )}

      {/* Error */}
      {isError && (
        <div className="text-center text-red-500 dark:text-red-400">
          ❌ Failed to load fixed costs.
          <pre className="text-xs mt-2">{JSON.stringify(error?.message || error, null, 2)}</pre>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && costs.length === 0 && (
        <p className="text-center text-zinc-500 dark:text-zinc-400">
          🪙 No fixed costs saved yet.
        </p>
      )}

      {/* List */}
      {!isLoading && !isError && costs.length > 0 && (
        <ul className="space-y-4 max-w-xl mx-auto">
          {costs.map((cost) => (
            <li
              key={cost.id}
              className="flex justify-between items-center p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:shadow-sm transition"
            >
              <div>
                <p className="text-lg font-medium text-zinc-800 dark:text-zinc-100">
                  {cost.title}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  ৳{cost.amount} — <em>{cost.category}</em>
                </p>
              </div>

              {cost.isPaid ? (
                <span className="text-green-600 font-semibold">Paid</span>
              ) : (
                <button
                  onClick={() => handleMarkPaid(cost.id)}
                  className="px-4 py-1 text-sm font-medium border border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-zinc-700 rounded-md transition"
                >
                  Mark as Paid
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
