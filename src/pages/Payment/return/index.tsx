// Libs
import { FC } from "react";
// Components
import withMobileLayout from "~/hoc/create-mobile-layout";
import Payments from "~/features/payment";
import { NameSpace, useSocket } from "~/hooks/useSocket";

const Payment: FC = (props) => {
  useSocket({ ns: NameSpace.user });

  return <Payments.PaymentReturnContainer {...props} />;
};

export default withMobileLayout(Payment);
