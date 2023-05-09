// Libs
import { createBrowserRouter } from "react-router-dom";
// Components
import {
  Home,
  Orders,
  AdminLogin,
  AdminOrders,
  AdminMenu,
  AdminSeat,
  AdminMealList,
  AdminMealDetail,
  AdminMealSetting,
  Booking
} from "../pages";
import { ProtectedRoute } from "./protected";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "booking",
    element: <Booking />
  },
  {
    path: "orders",
    element: <Orders />
  },
  {
    path: "admin",
    element: <AdminLogin />
  },
  {
    element: <ProtectedRoute />,
    path: "admin",
    children: [
      {
        path: "orders",
        element: <AdminOrders />
      },
      {
        path: "menu",
        element: <AdminMenu />
      },
      {
        path: "seat",
        element: <AdminSeat />
      },
      {
        path: "meal",
        children: [
          {
            path: "list",
            element: <AdminMealList />
          },
          {
            path: "list/:meal_id",
            element: <AdminMealDetail />
          },
          {
            path: "settings",
            element: <AdminMealSetting />
          }
        ]
      }
    ]
  }
]);

export default router;
