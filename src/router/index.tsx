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
  AdminMealSetting
} from "../pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "orders",
    element: <Orders />
  },
  {
    path: "admin",
    children: [
      {
        path: "login",
        element: <AdminLogin />
      },
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
