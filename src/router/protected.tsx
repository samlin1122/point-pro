import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "~/app/hook";

export const ProtectedRoute = () => {
  const location = useLocation();

  const isAuthenticated = useAppSelector(({ auth }) => auth.isAuthenticated);
  const Token = localStorage.getItem("token");

  return (isAuthenticated || Token) && location.pathname !== "/admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/admin" state={{ from: location }} replace />
  );
};
