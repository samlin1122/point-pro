import { createTheme } from "@mui/material/styles";
declare module "@mui/material/styles" {
  // 能用使用 createTheme 來設定這個屬性
  interface PaletteOptions {
    gray: {
      "0": string
      "20": string
      "40": string
      "60": string
      "80": string
      "100": string
    }
  }
}

// Create a theme instance.
const theme = createTheme({
  palette: {
    common: {
      black: "#020202"
    },
    primary: {
      main: "#F7C324"
    },
    gray: {
      "0": "#FFFFFF",
      "20": "#F2F2F2",
      "40": "#D1D1D1",
      "60": "#919191",
      "80": "#525252",
      "100": "#020202"
    },
    secondary: {
      main: "#F8F8F8",
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
