import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const dailyOrdersData = [
  { date: "Nov 19", orders: 45 },
  { date: "Nov 20", orders: 52 },
  { date: "Nov 21", orders: 49 },
  { date: "Nov 22", orders: 60 },
  { date: "Nov 23", orders: 55 },
  { date: "Nov 24", orders: 58 },
  { date: "Nov 25", orders: 62 },
];

const DailyOrders = () => {
  return (
    <motion.div
      className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-base font-semibold text-slate-900 dark:text-zinc-100 mb-4">
        Daily Orders
      </h2>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dailyOrdersData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#94A3B8"
              strokeOpacity={0.2}
            />
            <XAxis
              dataKey="date"
              stroke="#64748B"
              tick={{ fill: "#64748B", fontSize: 12 }}
            />
            <YAxis
              stroke="#64748B"
              tick={{ fill: "#64748B", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181B",
                borderColor: "#27272A",
                borderRadius: "0.75rem",
                color: "#F4F4F5",
              }}
              itemStyle={{ color: "#F4F4F5" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="orders"
              name="Orders"
              stroke="#4F46E5"
              strokeWidth={2.5}
              dot={{ r: 3.5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default DailyOrders;
