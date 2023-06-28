// Libs
import { useEffect } from "react";
// Components
import { SeatInfo, CategoryNavbar, Meals, Header, Footer } from "./index.styles";
// Others
import { useAppDispatch } from "~/app/hook";
import { getMenu, getUserInfo } from "./slice";
import { getOrders } from "~/app/slices/order";
import { MobileModal } from "~/components/modals";
import { DialogType } from "~/components/dialog";
import { NameSpace, useSocket } from "~/hooks/useSocket";
import { getToken } from "~/utils/token.utils";

const Order = () => {
  const dispatch = useAppDispatch();

  useSocket({ ns: NameSpace.user });

  useEffect(() => {
    dispatch(getMenu());

    const token = getToken();
    if (token) {
      dispatch(getUserInfo());
      dispatch(getOrders({}));
    }
  }, []);

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
