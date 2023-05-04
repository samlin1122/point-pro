// Libs
// Components
import { useState } from "react"
import AboutUsSection from "./AboutUsSection"
import BackToTopButton from "./BackToTop"
import ContactFormModal from "./ContactFormModal"
import FeatureSection from "./FeatureSection"
import HeroSection from "./HeroSection"
import MapSection from "./MapSection"
import PricingSection from "./PricingSection"
import SiteMapSection from "./SiteMapSection"
import SubscribedSection from "./SubscribedSection"
import TestimonialsSection from "./TestimonialsSection"
import Footer from "~/components/footer"
import { HeaderNavBar } from "./HeaderNavBar"
import { Box } from "@mui/material"

interface HomeContainerProps { }


const HomeContainer: React.FC<HomeContainerProps> = ({ ...rest }) =>
{
  const [isOpen, setIsOpen] = useState(false);
  const handleOpenModal = () =>
  {
    console.log("handleOpenModal");
    setIsOpen(true);
  };
  const handleCloseModal = () =>
  {
    console.log("handleCloseModal");
    setIsOpen(false);
  };
  return (
    <>
      <Box style={{ position: "fixed", top: 0, width: "100%", zIndex: 999 }}>
        <HeaderNavBar />
      </Box>
      <section id="hero-section">
        <HeroSection openModal={handleOpenModal} />
      </section>
      <section id="feature">
        <FeatureSection />
      </section>
      <section id="pricing">
      <PricingSection openModal={handleOpenModal} />
      </section>
      <TestimonialsSection />
      <SubscribedSection />
      <section id="about">
      <AboutUsSection />
      </section>
      <MapSection />
      <SiteMapSection />
      <Footer />
      <ContactFormModal open={isOpen} onClose={handleCloseModal} />
      <BackToTopButton position={{bottom: 50, right: 50}} />
    </>
  );
};
export default HomeContainer;
