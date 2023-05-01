// Libs
import { createBrowserRouter } from "react-router-dom";
// Components
import {
  Home,
  AdminMenu,
  AdminOrders,
  AdminLogin,
  AdminMealList,
  AdminMealDetail,
  AdminMealSetting,
  Orders
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
        path: "menu",
        element: <AdminMenu />
      },
      {
        path: "orders",
        element: <AdminOrders />
      },
      {
        path: "login",
        element: <AdminLogin />
      },
      {
        path: "meal",
        children: [
          {
            path: "list",
            element: <AdminMealList />
          },
          {
            path: "meals/:meal_id",
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
