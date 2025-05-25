import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import axios from "axios";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { useUser } from "../../../contexts/AuthContext";
import StatCard from "../../../components/dashBoard/home/common/StatCard";
import DokaanTable from "../../../components/dashBoard/home/Shop/DokaanTable";

const DokaanPage = () => {
  const { user } = useUser();

  const { data = [], isLoading, isError } = useQuery({
    queryKey: ["dokaans", user?.email],
    queryFn: async () => {
      const token = Cookies.get("XTOKEN");
      const url = `${import.meta.env.VITE_BASE_URL}/dokaan/user/${user?.email}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
console.log(data);
      return response.data?.data || [];
    },
    enabled: !!user?.email,
  });

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Stat Card */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Dokaans"
            icon={Package}
            value={data?.length || 0}
            color="#6366F1"
          />
        </motion.div>

        {/* Add Dokaan Button */}
        <div className="mb-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Add Dokaan
          </button>
        </div>

        {/* Dokaan Table */}
        <DokaanTable shops={data} loading={isLoading} />
        {isError && <div className="text-red-500 mt-4">Failed to load dokaans.</div>}
      </main>
    </div>
  );
};

export default DokaanPage;
