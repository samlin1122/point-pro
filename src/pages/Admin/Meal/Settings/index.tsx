// Libs
import { FC } from "react";
// Components
import MealSettingsContainer from "~/features/admin/meal/settings";
import withMainLayout from "~/hoc/create-main-layout";

import { RouterProps } from "~/types";

const MealSettingsPage: FC<RouterProps> = (props) => {
  return <MealSettingsContainer {...props} />;
};

export default withMainLayout(MealSettingsPage);
