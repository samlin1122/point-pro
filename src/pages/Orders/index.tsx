// Libs
// Components
import withMobileLayout from "~/hoc/create-mobile-layout";
import OrdersPage from "~/features/orders";
// Styles

interface IOrderProps {}

const Orders = (props: IOrderProps) => {
  return <OrdersPage {...props} />;
};

export default withMobileLayout(Orders);
