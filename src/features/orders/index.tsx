// Libs
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
// Components
import { SeatInfo, CategoryNavbar, Meals, Header, Footer } from "./index.styles";
// Others
import { useAppDispatch } from "~/app/hook";
import { getMenu, getUserInfo } from "./slice";
import { getOrders } from "~/app/slices/order";
import { MobileModal } from "~/components/modals";
import { DialogType } from "~/components/dialog";
import { useSocket } from "~/hooks/useSocket";

const Order = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  useSocket({ ns: "user" });

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

      {/* 客製化、購物車、訂單畫面 */}
      <DialogType.Customized />
      <DialogType.Cart />
      <DialogType.Orders />

      {/* 提示彈窗 */}
      <MobileModal.ConfirmRemoveCartItem />
      <MobileModal.Payment />
      <MobileModal.CounterReminder />
      <MobileModal.CartItemIsOffReminder />
      <MobileModal.EcPayForm />
    </>
  );
};

export default Order;
