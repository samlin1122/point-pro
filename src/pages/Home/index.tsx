// Libs
import { FC } from "react";
// Components
import HomeContainer from "~/features/home";

interface HomeProps {}

const HomePage: FC<HomeProps> = (props) => {
  return <HomeContainer {...props} />;
};

export default HomePage;
