import { styled } from "@mui/material/styles";
import { TextareaAutosize } from "@mui/base";

const InputTextarea = styled(TextareaAutosize)(({ theme }) => ({
  // your custom styles go here
  position: "relative",
  borderRadius: "4px",
  borderColor: "rgba(0, 0, 0, 0.23)",
  boxSizing: "border-box",
  padding: "16.5px 14px",
  minHeight: "100px",
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.body1.fontSize,
  "&:focus-visible": {
    outlineColor: theme.palette.primary.main
  }
}));

export default InputTextarea;
