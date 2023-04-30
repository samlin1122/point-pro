// Libs
import { createBrowserRouter } from "react-router-dom"
// Components
import {
  Home,
  AdminMenu,
  AdminOrders,
  AdminLogin,
  AdminMeals,
  AdminMealDetail,
  AdminMealSetting,
  CustomerOrder
} from "../pages"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "customer-order",
    element: <CustomerOrder />
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
        path: "meals",
        element: <AdminMeals />
      },
      {
        path: "meals/:meal_id",
        element: <AdminMealDetail />
      },
      {
        path: "meal-settings",
        element: <AdminMealSetting />
      }
    ]
  }
])

export default router
