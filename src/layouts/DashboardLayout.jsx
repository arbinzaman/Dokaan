import Sidebar from "../components/dashBoard/home/common/Sidebar/Sidebar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const normalizedPath = location.pathname.replace(/\/+$/, "");
  const isOverview = normalizedPath === "/dashboard";

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex h-screen bg-dashboard-light-background dark:bg-dashboard-dark-background text-dashboard-light-text dark:text-dashboard-dark-text">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow p-0 overflow-auto lg:mt-0">
        {/* Sticky Back Button */}
        {!isOverview && (
          <div className="sticky top-0 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-4 py-3 border-b border-gray-200 dark:border-gray-800 no-print">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <ArrowLeft size={18} />
              Back
            </button>
          </div>
        )}

        {/* Page Content */}
        <div className="p-4 sm:p-6 pb-24 lg:pb-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
