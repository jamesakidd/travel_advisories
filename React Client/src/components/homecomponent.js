import React from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";

import { Typography } from "@material-ui/core";

import theme from "../theme";

const HomeComponent = () => {
  return (
    <MuiThemeProvider theme={theme}>
        <Typography
          color="primary"
          style={{
            float: "right",
            paddingRight: "1vh",
            paddingTop: "3vh",
            fontSize: "smaller",
          }}
        >
          &copy;James K. - 2021
        </Typography>
    </MuiThemeProvider>
  );
};
export default HomeComponent;
