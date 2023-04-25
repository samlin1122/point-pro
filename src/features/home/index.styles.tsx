import type { RootState } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "./slice";

import { ButtonBase } from "../../components/buttons"
import { Box, Typography } from "@mui/material"

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
    <Box
      sx={{
        display: "flex",
        gap: 2
      }}
    >
      <Box width={2} height={2} borderRadius={"50%"} bgcolor="primary.main" />
      <Box>
        <Typography component={"h2"} fontWeight={900}>{title}</Typography>
        <Typography component={"h4"}>{subtitle}</Typography>
      </Box>
    </Box>
  )
}
