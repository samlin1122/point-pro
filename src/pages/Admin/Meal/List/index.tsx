// Libs
import { FC } from "react";
// Components
import MealListContainer from "~/features/admin/meal/list";
import withMainLayout from "~/hoc/create-main-layout";

import { RouterProps } from "~/types";

const MealListPage: FC<RouterProps> = (props) => {
  return <MealListContainer {...props} />;
};

export default withMainLayout(MealListPage);
