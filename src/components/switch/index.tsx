import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";

const SwitchBase = styled(Switch)(({ theme }) => ({
  width: 112,
  height: 64,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    transform: "translate(8px,6px)",
    "&.Mui-checked": {
      transform: "translate(52px,6px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        border: 0
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5
      }
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: theme.palette.primary.main,
      border: "6px solid #fff"
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[100]
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.7
    }
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: "48px",
    height: "48px"
    // transform: "translate(48px)"
  },
  "& .MuiSwitch-track": {
    borderRadius: "100px",
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500
    })
  }
}));

export default SwitchBase;
