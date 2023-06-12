// Libs
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
  CounterReminderModal,
  ConfirmRemoveCartItemModal
} from "./index.styles";
// Others
import { useAppDispatch } from "~/app/hook";
import { getMenu, getUserInfo } from "./slice";
import { getOrders } from "~/app/slices/order";

const Order = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }

    dispatch(getUserInfo());
    dispatch(getMenu());
    dispatch(getOrders({}));
  }, [token]);

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

      <ConfirmRemoveCartItemModal />
      <PaymentModal />
      <CounterReminderModal />
    </>
  );
};

export default Order;
