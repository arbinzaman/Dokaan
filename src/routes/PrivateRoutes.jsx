import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/AuthContext.jsx"; // adjust the path if needed

const PrivateRoute = () => {
  const { user } = useUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

//   return <Outlet />;
};

export default PrivateRoute;
