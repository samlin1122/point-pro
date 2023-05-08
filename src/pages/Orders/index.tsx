// Libs
import { FC } from "react";
// Components
import withMobileLayout from "~/hoc/create-mobile-layout";
import OrdersPage from "~/features/orders";

interface IOrderProps {}

const Orders: FC<IOrderProps> = (props) => {
  return <OrdersPage {...props} />;
};

export default withMobileLayout(OrdersPage);
