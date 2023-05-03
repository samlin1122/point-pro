import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

interface Props {
  length?: Number;
  align?: string;
}

export const VSpace = styled("div")((props: Props) => ({
  flexShrink: 0,
  height: `${props.length}px`,
  minHeight: `${props.length}px`
}));

export const HSpace = styled("div")((props: Props) => ({
  flexShrink: 0,
  width: `${props.length}px`,
  minWidth: `${props.length}px`
}));

export const Row = styled(Box)((props: Props) => ({
  display: "flex",
  position: "relative",
  alignItems: props.align || "center"
}));

export const Column = styled(Box)(() => ({
  display: "flex",
  position: "relative",
  flexDirection: "column"
}));

export const Base = styled(Box)(() => ({
  padding: "24px"
}));
