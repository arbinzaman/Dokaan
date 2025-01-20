import {
	BarChart2,
	DollarSign,
	Menu,
	Settings,
	ShoppingBag,
	ShoppingCart,
	TrendingUp,
	Users,
} from "lucide-react";
import { GiShop } from "react-icons/gi";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import DokaanProfile from "../../../dashBoard/Profile/DokaanProfile";
import { useUser } from "../../../../contexts/AuthContext";
// import { useThemeMode } from "../../../../contexts/ThemeContext";
import ThemeToggleButton from "../../../shared/Theme/ThemeToggleButton";

const SIDEBAR_ITEMS = [
	{ id: "overview", name: "Overview", icon: BarChart2, color: "#6366f1", href: "/dashboard" },
	{ id: "products", name: "Products", icon: ShoppingBag, color: "#8B5CF6", href: "/dashboard/products" },
	{ id: "users", name: "Users", icon: Users, color: "#EC4899", href: "/dashboard/users" },
	{ id: "sales", name: "Sales", icon: DollarSign, color: "#10B981", href: "/dashboard/sales" },
	{ id: "orders", name: "Orders", icon: ShoppingCart, color: "#F59E0B", href: "/dashboard/orders" },
	{ id: "analytics", name: "Analytics", icon: TrendingUp, color: "#3B82F6", href: "/dashboard/analytics" },
	{ id: "settings", name: "Settings", icon: Settings, color: "#6EE7B7", href: "/dashboard/settings" },
];

const Sidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true); // For desktop sidebar
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // For mobile sidebar
	const { dokaan } = useUser(); // Get dokaan data from context
	// const { mode, toggleTheme } = useThemeMode();

	return (
		<>
			{/* Mobile Sticky Menu Button */}
			<div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-800 text-white flex justify-between items-center p-4 z-50">
				<span className="text-xl font-bold">Dashboard</span>
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					className="p-2 rounded-full hover:bg-gray-700 transition-colors"
				>
					<Menu size={24} />
				</motion.button>
			</div>

			{/* Add Padding to Content Below the Sticky Menu */}
			<div className="lg:hidden h-16"></div>

			{/* Mobile Sidebar */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						initial={{ x: "-100%" }}
						animate={{ x: 0 }}
						exit={{ x: "-100%" }}
						transition={{ duration: 0.3 }}
						className="fixed top-0 left-0 w-64 h-full bg-gray-800 text-white z-50 flex flex-col p-4"
					>
						{/* Close Button */}
						<button
							onClick={() => setIsMobileMenuOpen(false)}
							className="self-end p-2 text-gray-400 hover:text-white transition-colors"
						>
							✕
						</button>

						{/* Navigation Items */}
						<nav className="mt-4">
							{SIDEBAR_ITEMS.map((item) => (
								<Link
									key={item.id}
									to={item.href || "#"}
									className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2"
								>
									<item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
									<span className="ml-4">{item.name}</span>
								</Link>
							))}
						</nav>

						{/* Theme Toggle Button
						<button
							onClick={toggleTheme}
							className="mt-auto flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
						>
							<span>{mode === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}</span>
						</button> */}

					</motion.div>
				)}
			</AnimatePresence>

			{/* Desktop Sidebar */}
			<motion.div
				className={`hidden lg:flex flex-col h-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white p-4 border-r border-gray-300 dark:border-gray-700 ${
					isSidebarOpen ? "w-64" : "w-20"
				}`} 
				animate={{ width: isSidebarOpen ? 256 : 80 }}
			>
				{/* Toggle Button */}
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
				>
					<Menu size={24} />
				</motion.button>

				{/* Dokaan Profile - Only Render if User Has Dokaan */}
				{dokaan && (
					<div className="p-4 bg-gray-900 rounded-lg mb-4">
						{/* If Sidebar is Collapsed, Show Profile Image Only */}
						{isSidebarOpen ? (
							<DokaanProfile />
						) : (
							<Link to="dokaanProfile">
								<GiShop />
							</Link>
						)}
					</div>
				)}

				{/* Navigation Items */}
				<nav className="mt-4 flex-grow">
					{SIDEBAR_ITEMS.map((item) => (
						<Link
							key={item.id}
							to={item.href || "#"}
							className={`flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2 ${
								isSidebarOpen ? "justify-start" : "justify-center"
							}`}
						>
							<item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
							{isSidebarOpen && <span className="ml-4">{item.name}</span>}
						</Link>
					))}
				</nav>

				{/* Theme Toggle Button */}
				<ThemeToggleButton />
			</motion.div>
		</>
	);
};

export default Sidebar;
