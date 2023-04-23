import { Card, styled } from "@mui/material"


type AnimatedCardProps = {
  index: number
}

export const AnimatedCard = styled(Card)<AnimatedCardProps>(({ theme, index }) => ({
  userSelect: "none",
  position: "relative",
  transition: theme.transitions.create(["transform", "z-index"], {
    duration: theme.transitions.duration.standard
  }),
  transform: `translateX(${index === 0 ? "2rem" : index === 2 ? "-2rem" : 0})`,
  filter: `blur(${index === 1 ? 0 : 1.5}px)`,
  zIndex: index === 1 ? 2 : 1
}))

