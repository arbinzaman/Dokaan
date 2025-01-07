/* eslint-disable no-mixed-spaces-and-tabs */
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
  import { useState } from "react";
  import { AnimatePresence, motion } from "framer-motion";
  import { Link } from "react-router-dom";
  
  const SIDEBAR_ITEMS = [
	{ name: "Overview", icon: BarChart2, color: "#6366f1", href: "/dashboard" },
	{ name: "Products", icon: ShoppingBag, color: "#8B5CF6", href: "/dashboard/products" },
	{ name: "Users", icon: Users, color: "#EC4899", href: "/dashboard/users" },
	{ name: "Sales", icon: DollarSign, color: "#10B981", href: "/dashboard/sales" },
	{ name: "Orders", icon: ShoppingCart, color: "#F59E0B", href: "/dashboard/orders" },
	{ name: "Analytics", icon: TrendingUp, color: "#3B82F6", href: "/dashboard/analytics" },
	{ name: "Settings", icon: Settings, color: "#6EE7B7", href: "/dashboard/settings" },
  ];
  
  const Sidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true); // For desktop sidebar
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // For mobile sidebar
  
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
					key={item.href}
					to={item.href}
					onClick={() => setIsMobileMenuOpen(false)} // Close menu on navigation
					className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2"
				  >
					<item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
					<span className="ml-4">{item.name}</span>
				  </Link>
				))}
			  </nav>
			</motion.div>
		  )}
		</AnimatePresence>
  
		{/* Desktop Sidebar */}
		<motion.div
		  className={`hidden lg:flex flex-col h-full bg-gray-800 text-white p-4 border-r border-gray-700 ${
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
  
		  {/* Navigation Items */}
		  <nav className="mt-8 flex-grow">
			{SIDEBAR_ITEMS.map((item) => (
			  <Link
				key={item.href}
				to={item.href}
				className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2"
			  >
				<item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
				{isSidebarOpen && <span className="ml-4">{item.name}</span>}
			  </Link>
			))}
		  </nav>
		</motion.div>
  
		{/* Add Padding to Content for Desktop */}
		<div className="hidden lg:block h-16"></div>
	  </>
	);
  };
  
  export default Sidebar;
  