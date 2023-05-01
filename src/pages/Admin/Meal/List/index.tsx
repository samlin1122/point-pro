// Libs
// Components
import MealListContainer from "~/features/admin/meal/list";
import withMainLayout from "~/hoc/create-main-layout";
// Styles

interface MealListProps {}

const MealListPage: React.FC<MealListProps> = (props) => {
  return <MealListContainer {...props} />;
};

export default withMainLayout(MealListPage);
