// Libs
// Components
import MealDetailContainer from "~/features/admin/meal/detail";
import withMainLayout from "~/hoc/create-main-layout";
// Styles
import { RouterProps } from "~/types";

const MealDetailPage: React.FC<RouterProps> = (props) => {
  return <MealDetailContainer {...props} />;
};

export default withMainLayout(MealDetailPage);
