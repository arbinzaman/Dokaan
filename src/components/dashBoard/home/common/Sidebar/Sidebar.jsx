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
  ScanLine,
} from "lucide-react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { useState, useMemo } from "react";
import { useUser } from "../../../../../contexts/AuthContext";
import { useLanguage } from "../../../../../contexts/LanguageContext";
import MobileSidebar from "./Mobilesidebar";
import DesktopSidebar from "./DesktopSidebar";

const SIDEBAR_BLUEPRINT = [
  { id: "overview", labelKey: "nav.overview", icon: BarChart2, color: "#DC2626", href: "/dashboard" },
  { id: "pos", labelKey: "nav.pos", icon: ScanLine, color: "#10B981", href: "/dashboard/product-sell" },
  { id: "shop", labelKey: "nav.shops", icon: Store, color: "#22C55E", href: "/dashboard/shop" },
  { id: "inventory", labelKey: "nav.inventory", icon: Box, color: "#F59E0B", href: "/dashboard/inventory" },
  { id: "products", labelKey: "nav.products", icon: ShoppingBag, color: "#8B5CF6", href: "/dashboard/products" },
  { id: "sales", labelKey: "nav.sales", icon: FaBangladeshiTakaSign, color: "#10B981", href: "/dashboard/sales" },
  { id: "orders", labelKey: "nav.orders", icon: ClipboardList, color: "#0EA5E9", href: "/dashboard/orders" },
  { id: "invoices", labelKey: "nav.invoices", icon: FileText, color: "#F97316", href: "/dashboard/invoices" },
  { id: "customers", labelKey: "nav.customers", icon: UserCheck, color: "#EC4899", href: "/dashboard/customers" },
  { id: "expenses", labelKey: "nav.expenses", icon: FaBangladeshiTakaSign, color: "#EF4444", href: "/dashboard/expense" },
  { id: "analytics", labelKey: "nav.analytics", icon: TrendingUp, color: "#3B82F6", href: "/dashboard/analytics" },
  { id: "employees", labelKey: "nav.employees", icon: User, color: "#14B8A6", href: "/dashboard/employee" },
  { id: "users", labelKey: "nav.users", icon: UserCog, color: "#A855F7", href: "/dashboard/users" },
  { id: "settings", labelKey: "nav.settings", icon: Settings, color: "#64748B", href: "/dashboard/settings" },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { dokaan, user } = useUser();
  const { t } = useLanguage();

  const role = user?.role;

  const filteredSidebarItems = useMemo(() => {
    const roleBasedAllowedIds = {
      admin: ["users", "settings"],
      "shop-owner": SIDEBAR_BLUEPRINT.map((item) => item.id).filter(
        (id) => id !== "users"
      ),
      employee: ["pos", "inventory", "customers", "sales", "invoices", "settings"],
    };

    const allowedIds = role
      ? roleBasedAllowedIds[role] || roleBasedAllowedIds["shop-owner"]
      : [];

    return SIDEBAR_BLUEPRINT.filter((item) => allowedIds.includes(item.id)).map(
      (item) => ({
        ...item,
        name: t(item.labelKey),
      })
    );
  }, [role, t]);

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
