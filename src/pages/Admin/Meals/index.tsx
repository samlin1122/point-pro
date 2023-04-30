// Libs
// Components
import MealsContainer from "~/features/admin/meals"
import withMainLayout from "~/hoc/create-main-layout"
// Styles

interface MealsProps {}

const MealsPage: React.FC<MealsProps> = (props) => {
  return <MealsContainer {...props} />
}

export default withMainLayout(MealsPage)
