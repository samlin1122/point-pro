// Libs
// Components
import MealDetailContainer from "~/features/admin/meals/meals-detail"
import withMainLayout from "~/hoc/create-main-layout"
// Styles

interface MealDetailProps {}

const MealDetailPage: React.FC<MealDetailProps> = (props) => {
  return <MealDetailContainer {...props} />
}

export default withMainLayout(MealDetailPage)
