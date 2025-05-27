import {
  BarChart2,
  Settings,
  ShoppingBag,
  TrendingUp,
  Box,
  FileText,
  UserCheck,
  UserCog,
  User,
} from "lucide-react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
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
    id: "shop",
    name: "Shop",
    icon: ShoppingBag,
    color: "#22C55E", // you can customize this
    href: "/dashboard/shop",
  },
  {
    id: "inventory",
    name: "Inventory",
    icon: Box,
    color: "#FF9900",
    href: "/dashboard/inventory",
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
    icon: UserCheck,
    color: "#EC4899",
    href: "/dashboard/customers",
  },
  {
    id: "users",
    name: "Users",
    icon: UserCog,
    color: "#C084FC",
    href: "/dashboard/users",
  },
  {
    id: "sales",
    name: "Sales",
    icon: FaBangladeshiTakaSign,
    color: "#10B981",
    href: "/dashboard/sales",
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: TrendingUp,
    color: "#3B82F6",
    href: "/dashboard/analytics",
  },
  {
    id: "expenses",
    name: "Expenses",
    icon: FaBangladeshiTakaSign,
    color: "#EF4444",
    href: "/dashboard/expenses",
  },
  {
    id: "employees",
    name: "Employees",
    icon: User,
    color: "#3B82F6",
    href: "/dashboard/employee",
  },
  {
    id: "memos",
    name: "Receipts / Memos",
    icon: FileText,
    color: "#F97316",
    href: "/dashboard/memos",
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
  const { dokaan, user } = useUser();

  const role = user?.role;

  const roleBasedAllowedIds = {
    admin: ["users"],
    "shop-owner": SIDEBAR_ITEMS.map((item) => item.id).filter(
      (id) => id !== "users"
    ),
    employee: ["inventory", "customers", "sales", "memos", "settings"],
  };

  const allowedIds = role ? roleBasedAllowedIds[role] || [] : [];

  const filteredSidebarItems = SIDEBAR_ITEMS.filter((item) =>
    allowedIds.includes(item.id)
  );

  const dokaanToPass = role === "employee" ? null : dokaan;

  return (
    <>
      <MobileSidebar
        sidebarItems={filteredSidebarItems}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <DesktopSidebar
        sidebarItems={filteredSidebarItems}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        dokaan={dokaanToPass}
      />
    </>
  );
};

export default Sidebar;
