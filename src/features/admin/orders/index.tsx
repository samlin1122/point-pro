import PaymentDrawer from "~/components/payment";
import OrderTabs from "./OrderTab";
import OrderList from "./OrderList";
import { Box } from "@mui/material";

export const OrdersContainer = () => {
  return (
    <Box bgcolor={"background.paper"}>
      <OrderTabs />
      <OrderList />
      <PaymentDrawer />
    </Box>
  );
};

export default OrdersContainer;
