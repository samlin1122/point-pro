// Libs
import { useEffect } from "react";
// Components
import {
  SeatInfo,
  CategoryNavbar,
  Meals,
  Header,
  Footer,
  CustomizedDialog,
  CartDialog,
  OrderDialog,
  PaymentModal,
  CounterReminderModal
} from "./index.styles";
// Others
import { useAppDispatch } from "~/app/hook";
import { getMenu, getOrders } from "./slice";

const Order = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getMenu());
    dispatch(getOrders());
  }, []);

  return (
    <>
      <Header />
      <SeatInfo />
      <CategoryNavbar />
      <Meals />
      <Footer />

      <CustomizedDialog />
      <CartDialog />
      <OrderDialog />

      <PaymentModal />
      <CounterReminderModal />
    </>
  );
};

export default Order;
