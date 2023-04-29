// Libs
// Components
import HomeContainer from "../../features/home"
import withMainLayout from "../../hoc/create-main-layout"
// Styles

interface HomeProps {}

const HomePage: React.FC<HomeProps> = (props) => {
  return <HomeContainer {...props} />
}

export default withMainLayout(HomePage)
