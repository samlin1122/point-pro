import { createTheme } from "@mui/material/styles";

// Create a theme instance.
const theme = createTheme({
  palette: {
    common: {
      black: "#020202"
    },
    primary: {
      main: "#F7C324",
      contrastText: "#020202"
    },
    secondary: {
      main: "#020202",
      contrastText: "#ffffff"
    },
    text: {
      primary: "#020202",
      disabled: "#D1D1D1"
    },
    divider: "#D1D1D1",
    background: {
      paper: "#F8F8F8"
    }
  },
  typography: {
    fontSize: 16,
    fontFamily: ["Noto Sans TC", "Inter", " system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"].join(","),
    h1: { fontSize: "3rem" },
    h2: { fontSize: "2.5rem" }, // 40px
    h3: { fontSize: "2rem" }, // 32px
    h4: { fontSize: "1.75rem" },
    h5: { fontSize: "1.5rem" }, // 24px
    h6: { fontSize: "1.25rem" }, // 20px
    button: {
      fontSize: "20px"
    }
  }
});

export default theme;
