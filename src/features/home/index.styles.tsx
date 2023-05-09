import { FC, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Button, Icon, Link, SxProps, Typography, styled } from "@mui/material";
import { Circle } from "@mui/icons-material";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import type { RootState } from "~/app/store";
import { decrement, increment } from "./slice";

import { ButtonBase } from "~/components/buttons";

interface CounterButton {}

export const CounterButton: FC<CounterButton> = () => {
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
  );
};

interface Title {
  title: string;
  subtitle: string;
  sx?: SxProps;
}

export const Title: FC<Title> = ({ title, subtitle, sx }) => {
  return (
    <Box sx={{ ...sx }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2
        }}
        mb={1}
      >
        <Circle sx={{ fontSize: "0.5rem", color: "primary.main" }} />
        <Typography component={"h2"} fontWeight={900}>
          {title}
        </Typography>
      </Box>
      <Box ml={3}>
        <Typography component={"h4"} color={"common.black_80"}>
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
};

interface CallToActionProps {
  content: string;
  handleOnClick: () => void;
}

export const CallToActionButton: FC<CallToActionProps> = ({ content, handleOnClick }) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <Button
      variant="contained"
      size="large"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: "5rem",
        padding: isHover ? "0.5rem 0.5rem 0.5rem 2rem" : "1.5rem 1.5rem 1.5rem 2rem",
        minWidth: "13rem",
        minHeight: "5rem"
      }}
      onClick={handleOnClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Typography variant="h6" lineHeight={1.2} fontWeight={900} component="span" mr={isHover ? 3 : 5}>
        {content}
      </Typography>
      <Box
        borderRadius={"50%"}
        height={"2rem"}
        width={"2rem"}
        component={"div"}
        sx={{
          display: "grid",
          placeContent: "center",
          backgroundColor: isHover ? "common.black" : "#00000014",
          color: isHover ? "common.white" : "common.black",
          transition: "all 0.3s ease",
          transformOrigin: "right center",
          transform: isHover ? "scale(2)" : "scale(1)"
        }}
      >
        {isHover ? (
          <Icon sx={{ display: "grid", placeContent: "center", fontSize: "1.5rem", color: "white" }}>
            <ArrowForwardIcon />
          </Icon>
        ) : (
          <Icon sx={{ display: "grid", placeContent: "center", fontSize: "1.5rem", color: "common.black" }}>
            <FingerprintIcon />
          </Icon>
        )}
      </Box>
    </Button>
  );
};

export const NavLink = styled(Link)({
  position: "relative",
  textDecoration: "none",
  padding: "0 8px",
  "&::after": {
    transformOrigin: "left",
    content: '""',
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%",
    height: 3,
    backgroundColor: "currentColor",
    transform: "scaleX(0) translateY(0.25rem)",
    transition: "transform 0.3s ease-in-out"
  },
  "&:hover::after": {
    transform: "scaleX(1) translateY(0.25rem)"
  }
});
