// Libs
import { FC } from "react";
// Components
import MealListDetailContainer from "~/features/admin/meal/list/detail";
import withMainLayout from "~/hoc/create-main-layout";

import { RouterProps } from "~/types";

const MealListDetailPage: FC<RouterProps> = (props) => {
  return <MealListDetailContainer {...props} />;
};

export default withMainLayout(MealListDetailPage);
