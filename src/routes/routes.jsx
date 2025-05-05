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
import TestComponent from "../components/shared/Theme/TestComponent";
// import AddProducts from "../pages/dashboard/pages/AddProducts";
import AddProducts from "../components/dashBoard/home/products/AddProducts";
import Scanner from "../components/dashBoard/home/products/Scanner/Scanner";
import AddSaleProduct from "../pages/dashboard/pages/AddSaleProduct";
import Inventory from "../pages/dashboard/pages/Inventory";
import ProductDetails from "../components/dashBoard/home/products/inventory/ProductDetails";
import TotalItemsTable from "../components/dashBoard/home/products/inventory/TotalItemsTable";
import InStockItemsTable from "../components/dashBoard/home/products/inventory/InStockItemsTable";
import OutOfStockItemsTable from "../components/dashBoard/home/products/inventory/OutOfStockItemsTable";
import PrivateRoute from "./PrivateRoutes";
// import MobileSidebar from "../components/dashBoard/home/common/MobileSidebar";
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
      element: (
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      ),
      children: [
        {
          path: "/dashboard",
          element: <OverviewPage />,
        },
        {
          path: "/dashboard/products",
          element: <ProductsPage />,
        },
        {
          path: "/dashboard/users",
          element: <UsersPage />,
        },
        {
          path: "/dashboard/sales",
          element: <SalesPage />,
        },
        {
          path: "/dashboard/orders",
          element: <OrdersPage />,
        },
        {
          path: "/dashboard/analytics",
          element: <AnalyticsPage />,
        },
        {
          path: "/dashboard/settings",
          element: <SettingsPage />,
        },
        {
          path: "/dashboard/dokaanProfile",
          element: <DokaanProfile />,
        },
        {
          path: "/dashboard/product-add",
          element: <AddProducts />,
        },
        {
          path: "/dashboard/product-sell",
          element: <AddSaleProduct />,
        },
        {
          path: "/dashboard/test",
          element: <TestComponent />,
        },
        {
          path: "/dashboard/barcode",
          element: <Scanner />,
        },
        {
          path: "/dashboard/inventory",
          element: <Inventory />,
        },
        {
          path: "/dashboard/product/:id",
          element: <ProductDetails />,
        },
        {
          path: "/dashboard/total-products",
          element: <TotalItemsTable />,
        },
        {
          path: "/dashboard/products/in-stock",
          element: <InStockItemsTable />,
        },
        {
          path: "/dashboard/products/out-of-stock",
          element: <OutOfStockItemsTable />,
        },
        // {
        //   path: "/dashboard/mobile-nav",
        //   element: <MobileSidebar />,
        // }
      ],
    },
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
