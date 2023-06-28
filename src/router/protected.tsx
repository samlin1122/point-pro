import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "~/app/hook";
import { NameSpace, useSocket } from "~/hooks/useSocket";
import { getToken } from "~/utils/token.utils";

export const ProtectedRoute = () => {
  const location = useLocation();

  const isAuthenticated = useAppSelector(({ auth }) => auth.isAuthenticated);

  const token = getToken();

  useSocket({ ns: NameSpace.admin });

  return (isAuthenticated || token) && location.pathname !== "/admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/admin" state={{ from: location }} replace />
  );
};
