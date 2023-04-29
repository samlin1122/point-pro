// Libs
import { createBrowserRouter } from "react-router-dom";
// Components
import { Home, CustomerOrder } from "~/pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "customer-order",
    element: <CustomerOrder />
  }
]);

export default router;
