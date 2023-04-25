// Libs
// Components
import FeatureSection from "./FeatureSection"
import HeroSection from "./HeroSection"
import PricingSection from "./PricingSection"

interface HomeContainerProps { }


const HomeContainer: React.FC<HomeContainerProps> = ({ ...rest }) =>
{
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <PricingSection />
    </>
  );
};
export default HomeContainer;
