// Libs
import { createBrowserRouter } from "react-router-dom"
// Components
import { Home, AdminMenu, AdminOrders } from "../pages"
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
      }
    ]
  }
])

export default router
