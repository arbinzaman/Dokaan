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
  Store,
  ClipboardList,
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
    name: "Shops",
    icon: Store,
    color: "#22C55E",
    href: "/dashboard/shop",
  },
  {
    id: "inventory",
    name: "Inventory",
    icon: Box,
    color: "#F59E0B",
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
    id: "sales",
    name: "Sales",
    icon: FaBangladeshiTakaSign,
    color: "#10B981",
    href: "/dashboard/sales",
  },
  {
    id: "orders",
    name: "Orders",
    icon: ClipboardList,
    color: "#0EA5E9",
    href: "/dashboard/orders",
  },
  {
    id: "invoices",
    name: "Invoices",
    icon: FileText,
    color: "#F97316",
    href: "/dashboard/invoices",
  },
  {
    id: "customers",
    name: "Customers",
    icon: UserCheck,
    color: "#EC4899",
    href: "/dashboard/customers",
  },
  {
    id: "expenses",
    name: "Expenses",
    icon: FaBangladeshiTakaSign,
    color: "#EF4444",
    href: "/dashboard/expense",
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: TrendingUp,
    color: "#3B82F6",
    href: "/dashboard/analytics",
  },
  {
    id: "employees",
    name: "Employees",
    icon: User,
    color: "#14B8A6",
    href: "/dashboard/employee",
  },
  {
    id: "users",
    name: "Users",
    icon: UserCog,
    color: "#A855F7",
    href: "/dashboard/users",
  },
  {
    id: "settings",
    name: "Settings",
    icon: Settings,
    color: "#64748B",
    href: "/dashboard/settings",
  },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { dokaan, user } = useUser();

  const role = user?.role;

  const roleBasedAllowedIds = {
    admin: ["users", "settings"],
    "shop-owner": SIDEBAR_ITEMS.map((item) => item.id).filter(
      (id) => id !== "users"
    ),
    employee: ["inventory", "customers", "sales", "invoices", "settings"],
  };

  const allowedIds = role
    ? roleBasedAllowedIds[role] || roleBasedAllowedIds["shop-owner"]
    : [];

  const filteredSidebarItems = SIDEBAR_ITEMS.filter((item) =>
    allowedIds.includes(item.id)
  );

  const dokaanToPass = role === "shop-owner" ? dokaan : null;

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
