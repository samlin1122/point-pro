import { useState } from "react";
import { OrderList, OrderTabs } from "./index.style";
import PaymentDrawer from "~/components/payment";

export const OrdersContainer = () => {
  const [openPayment, setOpenPayment] = useState(false);

  return (
    <>
      <OrderTabs />
      <OrderList setOpenPayment={setOpenPayment} />
      <PaymentDrawer open={openPayment} item={[]} totalPrice={0} setOpen={setOpenPayment} />
    </>
  );
};

export default OrdersContainer;
