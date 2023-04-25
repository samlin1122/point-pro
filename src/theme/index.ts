import { createTheme } from "@mui/material/styles"
import { red } from "@mui/material/colors"
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
    error: {
      main: red.A400
    }
  }
})

export default theme
