import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

const ButtonBase = styled(Button)(({ theme, size }) => ({
  // your custom styles go here
  fontSize: size || 14,
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  "&.Mui-disabled": {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.secondary.main
  }
}));

export default ButtonBase;
