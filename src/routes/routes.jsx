import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/landingPage/home/Homee";
import Main from "../layouts/Main";
import Login from "../pages/landingPage/home/Login";
// import SignUp from "../pages/landingPage/home/SignUp";
import DashboardLayout from "../layouts/DashboardLayout"; 
import OverviewPage from "../pages/dashboard/pages/OverviewPage";
import ProductsPage from "../pages/dashboard/pages/ProductsPage";
import UsersPage from "../pages/dashboard/pages/UsersPage";
import SalesPage from "../pages/dashboard/pages/SalesPage";
import OrdersPage from "../pages/dashboard/pages/OrdersPage";
import AnalyticsPage from "../pages/dashboard/pages/AnalyticsPage";
import SettingsPage from "../pages/dashboard/pages/SettingsPage";
import OtpVerification from "../components/landingPage/login/OtpVerification";
import RegistrationStepper from "../pages/landingPage/RegistrationProcess/RegistrationStepper";
import DokaanProfile from "../components/dashBoard/Profile/DokaanProfile";
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Main />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/signup",
          element: <RegistrationStepper />,
        },
        {
          path: "/verify-otp",
          element: <OtpVerification />,
        },
      ],
    },
    {
      path: "/dashboard",	
      element: <DashboardLayout />,
      children: [
        {
          path: "/dashboard",
          element: <OverviewPage />,
        },
        {
          path : "/dashboard/products",
          element : <ProductsPage />
        },
        {
          path : "/dashboard/users",
          element : <UsersPage />
        },
        {
          path : "/dashboard/sales",
          element : <SalesPage />
        },
        {
          path : "/dashboard/orders",
          element : <OrdersPage />
        },
        {
          path : "/dashboard/analytics",
          element : <AnalyticsPage />
        },
        {
          path: "/dashboard/settings",
          element: <SettingsPage />,
        },
        {
          path: "/dashboard/dokaanProfile",
          element: <DokaanProfile />,
        }
      ],
    }
  ],
  {
    future: {
      v7_startTransition: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

export default router;
