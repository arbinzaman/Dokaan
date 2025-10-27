import { Link } from "react-router-dom";
import { Home, PlayCircle, Store, Bell, User, Settings, LogOut } from "lucide-react";
import { useUser } from "../../../../contexts/AuthContext";
import ThemeToggleButton from "../../../shared/Theme/ThemeToggleButton";

const MENU_ITEMS = [
  { id: "home", name: "Home", icon: Home, href: "/dashboard" },
  { id: "watch", name: "Watch", icon: PlayCircle, href: "/dashboard/watch" },
  { id: "marketplace", name: "Marketplace", icon: Store, href: "/dashboard/marketplace" },
  { id: "notifications", name: "Notifications", icon: Bell, href: "/dashboard/notifications" },
  { id: "profile", name: "Profile", icon: User, href: "/dashboard/profile" },
  { id: "settings", name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

const MobileSidebar = () => {
  const { user, logout } = useUser();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white flex flex-col p-4">
      {/* User Info */}
      {user && (
        <div className="flex items-center space-x-4 mb-6">
          <img src={user?.profileImageUrl} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
          <div>
            <h3 className="text-lg font-semibold">{user?.name}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      )}
      
      {/* Menu Items */}
      <nav className="space-y-4">
        {MENU_ITEMS.map((item) => (
          <Link key={item.id} to={item.href} className="flex items-center p-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <item.icon size={24} className="mr-4" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      
      {/* Theme Toggle */}
      <div className="mt-6">
        <ThemeToggleButton />
      </div>
      
      {/* Logout Button */}
      <button onClick={logout} className="mt-auto flex items-center p-4 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition">
        <LogOut size={24} className="mr-4" />
        Logout
      </button>
    </div>
  );
};

export default MobileSidebar;
