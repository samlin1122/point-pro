import CloseIcon from "@mui/icons-material/Close";
import { Button, styled } from "@mui/material";
import { CSSProperties, FC } from "react";

interface ICloseButtonProps {
  onClick: () => void;
  sx?: CSSProperties;
}

export const StyledCloseButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.common.black,
  color: "white",
  "&:hover": {
    backgroundColor: theme.palette.common.black_80,
    color: theme.palette.common.black_20
  }
}));

export const CloseButton: FC<ICloseButtonProps> = ({ onClick, sx }) => (
  <StyledCloseButton color="inherit" onClick={onClick} sx={{ ...sx }}>
    <CloseIcon />
  </StyledCloseButton>
);

export default CloseButton;
