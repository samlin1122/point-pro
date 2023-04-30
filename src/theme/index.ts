import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6"
    },
    secondary: {
      main: "#19857b"
    },
    error: {
      main: red.A400
    }
  },
  typography: {
    fontSize: 16,
    fontFamily: ["Noto Sans TC", "Inter", " system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"].join(","),
    h1: { fontSize: "3rem" },
    h2: { fontSize: "2.5rem" },
    h3: { fontSize: "2rem" },
    h4: { fontSize: "1.75rem" },
    h5: { fontSize: "1.5rem" },
    h6: { fontSize: "1.25rem" }
  }
});

export default theme;
