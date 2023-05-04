// Libs
// Components
import HomeContainer from "../../features/home";
// Styles

interface HomeProps {}

const HomePage: React.FC<HomeProps> = (props) => {
  return <HomeContainer {...props} />;
};

export default HomePage;
