// Libs
import { FC } from "react";
// Components
import SeatContainer from "~/features/admin/seat";
import withMainLayout from "~/hoc/create-main-layout";

import { RouterProps } from "~/types";

const SeatPage: FC<RouterProps> = (props) => {
  return <SeatContainer {...props} />;
};

export default withMainLayout(SeatPage);
