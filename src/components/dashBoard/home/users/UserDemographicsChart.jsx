import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#0EA5E9", "#EC4899"];

const userDemographicsData = [
  { name: "18–24", value: 20 },
  { name: "25–34", value: 30 },
  { name: "35–44", value: 25 },
  { name: "45–54", value: 15 },
  { name: "55+", value: 10 },
];

const UserDemographicsChart = () => {
  return (
    <motion.div
      className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-base font-semibold text-slate-900 dark:text-zinc-100 mb-4">
        User Demographics
      </h2>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={userDemographicsData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={82}
              paddingAngle={3}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {userDemographicsData.map((entry, index) => (
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

export default UserDemographicsChart;
