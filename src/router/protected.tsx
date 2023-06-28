import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "~/app/hook";
import { useSocket } from "~/hooks/useSocket";

export const ProtectedRoute = () => {
  const location = useLocation();

  const isAuthenticated = useAppSelector(({ auth }) => auth.isAuthenticated);
  const Token = sessionStorage.getItem("token");
  useSocket({ ns: "admin" });

  return (isAuthenticated || Token) && location.pathname !== "/admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/admin" state={{ from: location }} replace />
  );
};
