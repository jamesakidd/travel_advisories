import React, { useReducer, useEffect } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Typography,
} from "@material-ui/core";

import theme from "../theme";
import "../App.css";
// const GRAPHURL = "http://localhost:5000/graphql";
const GRAPHURL = "/graphql";


const AlertComponent = (props) => {
  const initialState = {
    msg: "Alert Setup - Details",
    resArr: [],
  };

  const sendDataToParent = (msgToSend) => {
    props.dataForSnackBar(msgToSend);
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchAlerts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAlerts = async () => {
    try {
      sendDataToParent("running setup...");

      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: `query {setupalerts {results}}` }),
      });

      let payload = await response.json();
      setState({
        resArr: payload.data.setupalerts.results
          .replace(/([.])\s*(?=[A-Z])/g, "$1|")
          .split("|"),
      });
      sendDataToParent("alerts collection setup completed");
    } catch (error) {
      console.log(error);

      setState({
        msg: `Problem loading server data - ${error.message}`,
      });
    }
  }; //fetchAlerts

  return (
    <MuiThemeProvider theme={theme}>
      <Typography
        style={{ textAlign: "center", padding: "3vh" }}
        variant="h5"
        color="primary"
      >
        {state.msg}
      </Typography>

      <TableContainer>
        <Table>
          <TableBody>
            {state.resArr.map((row) => (
              <TableRow key={row}>
                <TableCell component="th" scope="row">
                  {row}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </MuiThemeProvider>
  );
}; //AlertComponent

export default AlertComponent;
