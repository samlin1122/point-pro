// Libs
// Components
import HomePage from "../../features/home"
import withMainLayout from "../../hoc/create-main-layout"
// Styles

interface HomeProps {}

const Home: React.FC<HomeProps> = (props) => {
  return <HomePage {...props} />
}

export default withMainLayout(Home)
