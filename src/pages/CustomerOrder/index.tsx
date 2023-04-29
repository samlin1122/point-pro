// Libs
// Components
import withMobileLayout from "~/hoc/create-mobile-layout";
import CustomerOrderPage from "~/features/customer-order";
// Styles

interface ICustomerOrderProps {}

const CustomerOrder = (props: ICustomerOrderProps) => {
  return <CustomerOrderPage {...props} />;
};

export default withMobileLayout(CustomerOrder);
