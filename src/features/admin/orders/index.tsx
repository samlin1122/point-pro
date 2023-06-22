import { useEffect, useState } from "react";
import PaymentDrawer from "~/components/payment";
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
      <OrderList />
      <PaymentDrawer />
    </>
  );
};

export default OrdersContainer;
