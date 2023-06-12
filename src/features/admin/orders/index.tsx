import { useEffect } from "react";
import { OrderList, OrderTabs } from "./index.style";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { getOrders, setOrderStatus } from "~/app/slices/order";
import { OrderStatus } from "~/features/orders/type";

export const OrdersContainer = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(({ order }) => order.status);

  useEffect(() => {
    !status && dispatch(setOrderStatus(OrderStatus.PENDING));
    status && dispatch(getOrders({ status }));
  }, [status]);

  return (
    <>
      <OrderTabs />
      <OrderList />
    </>
  );
};

export default OrdersContainer;
