import CloseIcon from "@mui/icons-material/Close";
import { FC } from "react";
import { StyledCloseButton } from "./button-icon";

interface ICloseButtonProps {
  onClick: () => void;
}

export const CloseButton: FC<ICloseButtonProps> = ({ onClick }) => (
  <StyledCloseButton onClick={onClick}>
    <CloseIcon />
  </StyledCloseButton>
);

export default CloseButton;
