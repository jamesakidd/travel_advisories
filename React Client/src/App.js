import React, { useReducer } from "react";
import { Route, Link, Redirect } from "react-router-dom";
import Reorder from "@material-ui/icons/Reorder";
import { MuiThemeProvider } from "@material-ui/core/styles";
import logo from "./assets/logo.svg";
import theme from "./theme";
import HomeComponent from "./components/homecomponent";
import AlertComponent from "./components/alertcomponent";
import AdvisoryAddComponent from "./components/advisoryaddcomponent";
import ListComponent from "./components/listcomponent";
import EmbassyComponent from "./components/embassycomponent";
import {
  Toolbar,
  AppBar,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Card,
  CardContent,
  Snackbar,
} from "@material-ui/core";

const App = () => {
  const initialState = {
    snackBarMsg: "",
    showSnackBar: false,
    anchorEl: null,
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const msgFromChild = (msg) => {
    setState({ snackBarMsg: msg, showSnackBar: true });
  };

  const handleClose = () => {
    setState({ anchorEl: null });
  };

  const handleClick = (event) => {
    setState({ anchorEl: event.currentTarget });
  };

  const snackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setState({
      showSnackBar: false,
    });
  };

  return (
    <MuiThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            INFO3139 - Case Study #1.5
          </Typography>
          <IconButton
            onClick={handleClick}
            color="inherit"
            style={{ marginLeft: "auto", paddingRight: "1vh" }}
          >
            <Reorder />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={state.anchorEl}
            open={Boolean(state.anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              component={Link}
              to="/homecomponent"
              onClick={handleClose}
            >
              Home
            </MenuItem>
            <MenuItem
              component={Link}
              to="/alertcomponent"
              onClick={handleClose}
            >
              Reset Alerts
            </MenuItem>
            <MenuItem
              component={Link}
              to="/advisoryaddcomponent"
              onClick={handleClose}
            >
              Add Advisory
            </MenuItem>
            <MenuItem
              component={Link}
              to="listcomponent"
              onClick={handleClose}
            >
              List Advisories
            </MenuItem>
            <MenuItem
              component={Link}
              to="embassycomponent"
              onClick={handleClose}
            >
              Find an Embassy
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Card style={{ marginTop: "5%" }}>
        <CardContent style={{ justifyContent: "center", display: "flex" }}>
          <img alt="logo" style={{ height: 100, width: 100 }} src={logo} />
        </CardContent>
        <Typography
          style={{ textAlign: "center" }}
          variant="h5"
          color="primary"
        >
          World Wide Travel Alerts
        </Typography>
        <div>
          <Route
            exact
            path="/"
            render={() => <Redirect to="/homecomponent" />}
          />

          <Route
            path="/alertcomponent"
            render={() => <AlertComponent dataForSnackBar={msgFromChild} />}
          />
          <Route
            path="/advisoryaddcomponent"
            render={() => (
              <AdvisoryAddComponent dataForSnackBar={msgFromChild} />
            )}
          />
          <Route
            path="/listcomponent"
            render={() => <ListComponent dataForSnackBar={msgFromChild} />}
          />
          <Route
            path="/embassycomponent"
            render={() => <EmbassyComponent dataForSnackBar={msgFromChild} />}
          />
          <Route path="/homecomponent" component={HomeComponent} />
        </div>
      </Card>
      <Snackbar
        open={state.showSnackBar}
        message={state.snackBarMsg}
        autoHideDuration={3000}
        onClose={snackbarClose}
      />
    </MuiThemeProvider>
  );
};

export default App;
