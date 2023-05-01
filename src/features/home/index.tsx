// Libs
// Components
import AboutUsSection from "./AboutUsSection"
import BackToTopButton from "./BackToTop"
import FeatureSection from "./FeatureSection"
import HeroSection from "./HeroSection"
import MapSection from "./MapSection"
import PricingSection from "./PricingSection"
import SubscribedSection from "./SubscribedSection"
import TestimonialsSection from "./TestimonialsSection"

interface HomeContainerProps { }


const HomeContainer: React.FC<HomeContainerProps> = ({ ...rest }) =>
{
  return (
    <>
      {/* <HeroSection /> */}
      <FeatureSection />
      {/* <PricingSection /> */}
      {/* <TestimonialsSection /> */}
      <SubscribedSection />
      <AboutUsSection />
      {/* <MapSection /> */}
      <BackToTopButton position={{bottom: 50, right: 50}} />
    </>
  );
};
export default HomeContainer;
