// Libs
// Components
import MealSettingsContainer from "~/features/admin/meal/settings";
import withMainLayout from "~/hoc/create-main-layout";
// Styles

interface MealSettingsProps {}

const MealSettingsPage: React.FC<MealSettingsProps> = (props) => {
  return <MealSettingsContainer {...props} />;
};

export default withMainLayout(MealSettingsPage);
