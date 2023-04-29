// Libs
import { createBrowserRouter } from "react-router-dom"
// Components
import { Home, AdminMenu, AdminOrders, AdminLogin, AdminMeals, AdminMealDetail, AdminMealSetting } from "../pages"
import Customer from "~/features/customer"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "menu/:categoryId?",
    element: <Customer.Menu />
  },
  {
    path: "cart",
    element: <Customer.Cart />
  },
  {
    path: "orders",
    element: <Customer.Order />
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
