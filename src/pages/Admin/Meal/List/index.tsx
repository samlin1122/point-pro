// Libs
// Components
import MealListContainer from "~/features/admin/meal/list";
import withMainLayout from "~/hoc/create-main-layout";
// Styles
import { RouterProps } from "~/types";

const MealListPage: React.FC<RouterProps> = (props) => {
  return <MealListContainer {...props} />;
};

export default withMainLayout(MealListPage);
