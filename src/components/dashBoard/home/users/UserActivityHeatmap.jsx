import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";

const userActivityData = [
  { name: "Mon", "0-4": 20, "4-8": 40, "8-12": 60, "12-16": 80, "16-20": 100, "20-24": 30 },
  { name: "Tue", "0-4": 30, "4-8": 50, "8-12": 70, "12-16": 90, "16-20": 110, "20-24": 40 },
  { name: "Wed", "0-4": 40, "4-8": 60, "8-12": 80, "12-16": 100, "16-20": 120, "20-24": 50 },
  { name: "Thu", "0-4": 50, "4-8": 70, "8-12": 90, "12-16": 110, "16-20": 130, "20-24": 60 },
  { name: "Fri", "0-4": 60, "4-8": 80, "8-12": 100, "12-16": 120, "16-20": 140, "20-24": 70 },
  { name: "Sat", "0-4": 70, "4-8": 90, "8-12": 110, "12-16": 130, "16-20": 150, "20-24": 80 },
  { name: "Sun", "0-4": 80, "4-8": 100, "8-12": 120, "12-16": 140, "16-20": 160, "20-24": 90 },
];

const UserActivityHeatmap = () => {
  return (
    <motion.div
      className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-base font-semibold text-slate-900 dark:text-zinc-100 mb-4">
        User Activity by Time Window
      </h2>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={userActivityData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#94A3B8"
              strokeOpacity={0.2}
            />
            <XAxis
              dataKey="name"
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
            <Bar dataKey="0-4" stackId="a" fill="#6366F1" />
            <Bar dataKey="4-8" stackId="a" fill="#8B5CF6" />
            <Bar dataKey="8-12" stackId="a" fill="#EC4899" />
            <Bar dataKey="12-16" stackId="a" fill="#10B981" />
            <Bar dataKey="16-20" stackId="a" fill="#F59E0B" />
            <Bar dataKey="20-24" stackId="a" fill="#0EA5E9" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default UserActivityHeatmap;
