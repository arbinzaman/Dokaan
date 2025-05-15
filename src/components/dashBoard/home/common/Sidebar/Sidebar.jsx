import {
  BarChart2,
  DollarSign,
  Settings,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Users,
  Box,
} from "lucide-react";
import { useState } from "react";
import { useUser } from "../../../../../contexts/AuthContext";
import MobileSidebar from "./Mobilesidebar";
import DesktopSidebar from "./DesktopSidebar";

const SIDEBAR_ITEMS = [
  {
    id: "overview",
    name: "Overview",
    icon: BarChart2,
    color: "#6366f1",
    href: "/dashboard",
  },
  {
    id: "inventory",
    name: "Inventory",
    href: "/dashboard/inventory",
    icon: Box,
    color: "#FF9900",
  },
  {
    id: "products",
    name: "Products",
    icon: ShoppingBag,
    color: "#8B5CF6",
    href: "/dashboard/products",
  },
  {
    id: "customers",
    name: "Customers",
    icon: Users, // You can use another icon if needed
    color: "#EC4899",
    href: "/dashboard/customers",
  },
  {
    id: "users",
    name: "Users",
    icon: Users,
    color: "#C084FC",
    href: "/dashboard/users",
  },
  {
    id: "sales",
    name: "Sales",
    icon: DollarSign,
    color: "#10B981",
    href: "/dashboard/sales",
  },
  {
    id: "orders",
    name: "Orders",
    icon: ShoppingCart,
    color: "#F59E0B",
    href: "/dashboard/orders",
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: TrendingUp,
    color: "#3B82F6",
    href: "/dashboard/analytics",
  },
  {
    id: "settings",
    name: "Settings",
    icon: Settings,
    color: "#6EE7B7",
    href: "/dashboard/settings",
  },
];


const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { dokaan } = useUser();

  return (
    <>
      <MobileSidebar
        sidebarItems={SIDEBAR_ITEMS}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <DesktopSidebar
        sidebarItems={SIDEBAR_ITEMS}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        dokaan={dokaan}
      />
    </>
  );
};

export default Sidebar;
