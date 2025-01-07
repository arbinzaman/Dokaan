import Sidebar from "../components/dashBoard/home/common/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow p-6 overflow-auto mt-16 lg:mt-0">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
