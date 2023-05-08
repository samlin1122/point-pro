// Libs
import { FC } from "react";
// Components
import MealSettingsContainer from "~/features/admin/meal/settings";
import withMainLayout from "~/hoc/create-main-layout";

interface MealSettingsProps {}

const MealSettingsPage: FC<MealSettingsProps> = (props) => {
  return <MealSettingsContainer {...props} />;
};

export default withMainLayout(MealSettingsPage);
