import { useSelector, useDispatch } from "react-redux"
import { Box, Typography } from "@mui/material"
import { Circle } from "@mui/icons-material"

import type { RootState } from "../../app/store"
import { decrement, increment } from "./slice"

import { ButtonBase } from "../../components/buttons"

interface CounterButton {}

export const CounterButton: React.FC<CounterButton> = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <>
      <ButtonBase aria-label="Increment value" onClick={() => dispatch(increment())}>
        Increment
      </ButtonBase>
      <span>{count}</span>
      <ButtonBase aria-label="Decrement value" onClick={() => dispatch(decrement())}>
        Decrement
      </ButtonBase>
    </>
  )
}

interface Title
{
  title: string,
  subtitle: string,
}


export const Title: React.FC<Title> = ({ title, subtitle }) => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
        mb={1}
      >
        <Circle sx={{ fontSize: "0.5rem", color: "primary.main" }} />
        <Typography component={"h2"} fontWeight={900}>
          {title}
        </Typography>
      </Box>
      <Box ml={3}>
        <Typography component={"h4"}>{subtitle}</Typography>
      </Box>
    </Box>
  )
}
