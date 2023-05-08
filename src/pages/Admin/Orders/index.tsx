// Libs
import { FC } from "react";
// Components
import OrderContainer from "~/features/admin/orders";
import withMainLayout from "~/hoc/create-main-layout";

interface IAdminOrderProps {}

const OrdersPage: FC<IAdminOrderProps> = (props) => {
  return <OrderContainer {...props} />;
};

export default withMainLayout(OrdersPage);
