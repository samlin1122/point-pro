// Libs
// Components
import FeatureSection from "./FeatureSection"
import HeroSection from "./HeroSection"
import MapSection from "./MapSection"
import PricingSection from "./PricingSection"
import TestimonialsSection from "./TestimonialsSection"

interface HomeContainerProps { }


const HomeContainer: React.FC<HomeContainerProps> = ({ ...rest }) =>
{
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <PricingSection />
      <TestimonialsSection />
      <MapSection />
    </>
  )
}
export default HomeContainer
