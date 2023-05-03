import { styled } from "@mui/material"
import { Column } from "../../components/layout"

type AnimatedCardProps =
 {
  index: number
}

export const AnimatedCard = styled(Column)<AnimatedCardProps>(({ theme, index }) => ({
  userSelect: "none",
  position: "relative",
  transition: theme.transitions.create([ "transform", "opacity", "z-index" ], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.enteringScreen
  }),
  transform: `translateX(${index === 0 ? "2rem" : index === 2 ? "-2rem" : 0}) translateY(${index === 1 ? "-3.125rem" : "0rem"
    })`,
  filter: `blur(${index === 1 ? 0 : 2}px)`,
  zIndex: index === 1 ? 2 : 1,
  "&::after": index === 1 ? {} : {
    content: "''",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(255, 255, 255, 0.5)"
  }
}))

