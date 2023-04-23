// Libs
// Components
import { CounterButton } from "./index.styles"
import Container from "@mui/material/Container"
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import HeroSection from "./HeroSection"
import PricingSection from "./PricingSection"

interface HomeContainerProps { }


const HomeContainer: React.FC<HomeContainerProps> = ({ ...rest }) =>
{
  return (
    <>
      <HeroSection />
      <PricingSection />
    </>
  )
}
export default HomeContainer
