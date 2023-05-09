import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";

const ButtonIcon = styled(IconButton)(({ theme }) => ({
  // your custom styles go here
}));

export default ButtonIcon;

export const StyledCloseButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.common.black,
  color: "white"
}));