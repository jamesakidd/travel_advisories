import { createMuiTheme } from "@material-ui/core/styles";

export default createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    common: { black: "#000", white: "#fff" },
    background: { paper: "#fff", default: "rgba(223, 220, 220, 1)" },
    primary: {
      light: "rgba(101, 14, 179, 1)",
      main: "rgba(58, 7, 104, 1)",
      dark: "rgba(29, 1, 60, 1)",
      contrastText: "#fff",
    },
    secondary: {
      light: "rgba(72, 136, 0, 1)",
      main: "rgba(40, 77, 0, 1)",
      dark: "rgba(18, 32, 1, 1)",
      contrastText: "#fff",
    },
    error: {
      light: "rgba(241, 2, 2, 1)",
      main: "rgba(184, 0, 21, 1)",
      dark: "rgba(102, 3, 3, 1)",
      contrastText: "#fff",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)",
    },
  },
});
