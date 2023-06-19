// Libs
import { createBrowserRouter } from "react-router-dom";
// Components
import {
  Home,
  Booking,
  Orders,
  AdminLogin,
  AdminOrders,
  AdminMenu,
  AdminSeat,
  AdminMealList,
  AdminMealListDetail,
  AdminMealSettings,
  PaymentReturn,
  PaymentCancel
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
            children: [
              {
                path: "",
                element: <AdminMealList />
              },
              {
                path: ":meal_id",
                element: <AdminMealListDetail />
              }
            ]
          },
          {
            path: "settings",
            element: <AdminMealSettings />
          }
        ]
      }
    ]
  },
  {
    path: "payment",
    children: [
      {
        path: "confirm",
        element: <PaymentReturn />
      },
      {
        path: "cancel",
        element: <PaymentCancel />
      }
    ]
  }
]);

export default router;
