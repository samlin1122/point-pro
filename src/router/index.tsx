// Libs
import { createBrowserRouter } from "react-router-dom"
// Components
import { Home } from "../pages"
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
  }
])

export default router
