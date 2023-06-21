import { useEffect, useState } from "react";
import PaymentDrawer from "~/components/payment";
import { Order } from "~/features/orders/type";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { getOrders } from "~/app/slices/order";
import OrderTabs from "./OrderTab";
import OrderList from "./OrderList";

export const OrdersContainer = () => {
  const dispatch = useAppDispatch();

  const status = useAppSelector(({ order }) => order.status);

  useEffect(() => {
    dispatch(getOrders({ status }));
  }, [status]);

  return (
    <>
      <OrderTabs />
<<<<<<< HEAD
      <OrderList setOpenPayment={setOpenPayment} onPayment={(order) => handlePayment(order)} />
      <PaymentDrawer open={openPayment} order={currentOrder} setOpen={setOpenPayment} />
=======
      <OrderList />
      <PaymentDrawer isAdmin={true} />
>>>>>>> origin/develop
    </>
  );
};

export default OrdersContainer;
