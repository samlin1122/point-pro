// Libs
import { FC } from "react";
// Components
import MealDetailContainer from "~/features/admin/meal/detail";
import withMainLayout from "~/hoc/create-main-layout";

import { RouterProps } from "~/types";

const MealDetailPage: FC<RouterProps> = (props) => {
  return <MealDetailContainer {...props} />;
};

export default withMainLayout(MealDetailPage);
