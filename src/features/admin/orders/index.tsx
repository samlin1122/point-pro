import { useEffect, useState } from "react";
import { OrderList, OrderTabs } from "./index.style";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { getOrders } from "~/app/slices/order";
import PaymentDrawer from "~/components/payment";

export const OrdersContainer = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(({ order }) => order.status);

  const [openPayment, setOpenPayment] = useState(false);

  useEffect(() => {
    dispatch(getOrders({ status }));
  }, [status]);

  return (
    <>
      <OrderTabs />
      <OrderList setOpenPayment={setOpenPayment} />
      <PaymentDrawer open={openPayment} item={[]} totalPrice={0} setOpen={setOpenPayment} />
    </>
  );
};

export default OrdersContainer;
