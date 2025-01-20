import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

// Import necessary components
import StatCard from "../../../components/dashBoard/home/common/StatCard";
import SalesOverviewChart from "../../../components/dashBoard/home/overview/SalesOverviewChart";
import CategoryDistributionChart from "../../../components/dashBoard/home/overview/CategoryDistributionChart";
import SalesChannelChart from "../../../components/dashBoard/home/overview/SalesChannelChart";

const ACCENT_COLOR = "rgb(204, 51, 51)"; // Define theme accent color

const OverviewPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Total Sales" icon={Zap} value="$12,345" color={ACCENT_COLOR} />
          <StatCard name="New Users" icon={Users} value="1,234" color={ACCENT_COLOR} />
          <StatCard name="Total Products" icon={ShoppingBag} value="567" color={ACCENT_COLOR} />
          <StatCard name="Conversion Rate" icon={BarChart2} value="12.5%" color={ACCENT_COLOR} />
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalesOverviewChart accentColor={ACCENT_COLOR} />
          <CategoryDistributionChart accentColor={ACCENT_COLOR} />
          <SalesChannelChart accentColor={ACCENT_COLOR} />
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;