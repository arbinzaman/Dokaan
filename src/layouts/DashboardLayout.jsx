import Sidebar from "../components/dashBoard/home/common/Sidebar";
import { Outlet } from "react-router-dom";
import { ThemeModeProvider } from "../contexts/ThemeContext";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen">
      <ThemeModeProvider>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-grow p-6 overflow-auto lg:mt-0">
          <Outlet />
        </div>
      </ThemeModeProvider>
    </div>
  );
};

export default DashboardLayout;
