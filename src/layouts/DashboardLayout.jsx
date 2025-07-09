import Sidebar from "../components/dashBoard/home/common/Sidebar/Sidebar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ThemeModeProvider } from "../contexts/ThemeContext";
import { ArrowLeft } from "lucide-react";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1); // Go to previous page in history
    } else {
      navigate("/dashboard"); // Fallback
    }
  };

  return (
    <div className="flex h-screen">
      <ThemeModeProvider>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-grow p-0 overflow-auto lg:mt-0">
          {/* Sticky Back Button */}
          {location.pathname !== "/dashboard" && (
            <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 hover:text-red-500"
              >
                <ArrowLeft size={18} />
                Back
              </button>
            </div>
          )}

          {/* Page Content */}
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </ThemeModeProvider>
    </div>
  );
};

export default DashboardLayout;
