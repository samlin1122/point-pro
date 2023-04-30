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
  OrderDialog
} from "./index.styles";
// Others
import { useAppDispatch } from "~/app/hook";
import { fetchMenu } from "./slice";

interface IMenuProps {}

const CustomerOrder = (props: IMenuProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMenu());
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
    </>
  );
};

export default CustomerOrder;
