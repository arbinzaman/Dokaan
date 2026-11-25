import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const orderStatusData = [
  { name: "Pending", value: 30 },
  { name: "Processing", value: 45 },
  { name: "Shipped", value: 60 },
  { name: "Delivered", value: 120 },
];
const COLORS = ["#F59E0B", "#0EA5E9", "#6366F1", "#10B981"];

const OrderDistribution = () => {
  return (
    <motion.div
      className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-base font-semibold text-slate-900 dark:text-zinc-100 mb-4">
        Order Status Distribution
      </h2>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={orderStatusData}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={84}
              paddingAngle={3}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {orderStatusData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
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
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default OrderDistribution;
