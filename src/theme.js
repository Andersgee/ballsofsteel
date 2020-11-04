import { createMuiTheme } from "@material-ui/core/styles";
//https://material-ui.com/customization/default-theme/
//const base = createMuiTheme();

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#3f51b5",
      contrastText: "#fff",
    },
    secondary: {
      main: "#f50057",
      contrastText: "#fff",
    },
    error: {
      main: "#f44336",
      contrastText: "#fff",
    },
    warning: {
      main: "#ff9800",
      contrastText: "rgba(0, 0, 0, 0.87)",
    },
    info: {
      main: "#2196f3",
      contrastText: "#fff",
    },
    success: {
      main: "#4caf50",
      contrastText: "rgba(0, 0, 0, 0.87)",
    },
    background: {
      default: "#fafafa",
      paper: "#fff",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)",
    },
  },
  typography: {
    fontFamily: ['"Work Sans"', "sans-serif"].join(","),
  },
});

export default theme;
