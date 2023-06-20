import { useEffect, useState } from "react";
import { OrderList, OrderTabs } from "./index.style";
import PaymentDrawer from "~/components/payment";
import { Order } from "~/features/orders/type";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { getOrders } from "~/app/slices/order";

export const OrdersContainer = () => {
  const [openPayment, setOpenPayment] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order>();
  const dispatch = useAppDispatch();

  const status = useAppSelector(({ order }) => order.status);

  useEffect(() => {
    dispatch(getOrders({ status }));
  }, [status]);

  const handlePayment = (order: Order) => {
    setCurrentOrder(order);
    setOpenPayment(true);
  };

  return (
    <>
      <OrderTabs />
      <OrderList setOpenPayment={setOpenPayment} onPayment={(order) => handlePayment(order)} />
      <PaymentDrawer open={openPayment} order={currentOrder} setOpen={setOpenPayment} isAdmin={true} />
    </>
  );
};

export default OrdersContainer;
