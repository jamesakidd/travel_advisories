import React, { useEffect, useReducer } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";

import {
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  Typography,
  TextField,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
  Paper,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import theme from "../theme";

// const GRAPHURL = "http://localhost:5000/graphql";
const GRAPHURL = "/graphql";

const ListComponent = (props) => {
  const initialState = {
    displayArr: [],
    comboArr: [],
    msg: "List Advisories By:",
    selectedString: null,
    comboLabel: "",
    queryType: "",
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const sendDataToParent = (msgToSend) => {
    props.dataForSnackBar(msgToSend);
  };

  useEffect(() => {
    fetchTravellers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onComboChange = async (e, selectedOption) => {
    if (selectedOption) {
      setState({ selectedString: selectedOption });
      try {
        let response = await fetch(GRAPHURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `query($name: String) {${state.queryType} (name: $name) {name,text,date}}`,
            variables: { name: selectedOption },
          }),
        });
        let payload = await response.json();
        setState({ displayArr: payload.data[state.queryType] });
        sendDataToParent(
          `found ${
            payload.data[state.queryType].length
          } alerts for ${selectedOption}`
        );
        //setState({ selectedString: null });
      } catch (error) {
        console.log(error);
        setState({
          msg: `Problem loading server data - ${error.message}`,
        });
      }
    } else {
      setState({ selectedString: null });
    }
  };

  const fetchTravellers = async () => {
    setState({ queryType: "alertsfortraveller" });
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: `query{alltravellers}` }),
      });

      let payload = await response.json();
      setState({
        comboArr: payload.data.alltravellers,
        comboLabel: "Select a Traveller",
      });
      sendDataToParent(`found ${payload.data.alltravellers.length} travellers`);
    } catch (error) {
      console.log(error);

      setState({
        msg: `Problem loading server data - ${error.message}`,
      });
    }
  }; //fetchTravellers

  const fetchRegions = async () => {
    setState({ queryType: "alertsforregion" });
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: `query{regions}` }),
      });

      let payload = await response.json();
      setState({
        comboArr: payload.data.regions,
        comboLabel: "Select a Region",
      });
      sendDataToParent(`found ${payload.data.regions.length} regions`);
    } catch (error) {
      console.log(error);

      setState({
        msg: `Problem loading server data - ${error.message}`,
      });
    }
  };

  const fetchSubRegions = async () => {
    setState({ queryType: "alertsforsubregion" });
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: `query{subregions}` }),
      });

      let payload = await response.json();
      setState({
        comboArr: payload.data.subregions,
        comboLabel: "Select a Sub-Region",
      });
      sendDataToParent(`found ${payload.data.subregions.length} sub-regions`);
    } catch (error) {
      console.log(error);

      setState({
        msg: `Problem loading server data - ${error.message}`,
      });
    }
  };

  const handleRadioChange = (event) => {
    setState({ selectedString: null, displayArr: [], comboArr: [] });
    switch (event.target.value) {
      case "traveller":
        fetchTravellers();
        break;
      case "region":
        fetchRegions();
        break;
      case "sub-region":
        fetchSubRegions();
        break;
      default:
        break;
    }
  };

  return (
    <MuiThemeProvider theme={theme}>
      <Typography
        style={{ textAlign: "center", padding: "3vh" }}
        variant="h5"
        color="primary"
      >
        {state.msg}
      </Typography>

      <FormControl component="fieldset">
        <RadioGroup onChange={handleRadioChange} row defaultValue="traveller">
          <FormControlLabel
            labelPlacement="start"
            value="traveller"
            control={<Radio />}
            label="Traveller"
          />
          <FormControlLabel
            labelPlacement="start"
            value="region"
            control={<Radio />}
            label="Region"
          />
          <FormControlLabel
            labelPlacement="start"
            value="sub-region"
            control={<Radio />}
            label="Sub-Region"
          />
        </RadioGroup>
      </FormControl>

      <Autocomplete
        options={state.comboArr}
        getOptionLabel={(option) => option}
        style={{ width: 300 }}
        onChange={onComboChange}
        value={state.selectedString}
        renderInput={(params) => (
          <TextField
            style={{ padding: "2vh" }}
            {...params}
            label={state.comboLabel}
            variant="outlined"
            fullWidth
          />
        )}
      />
      <Paper>
        <TableContainer style={{ maxHeight: 350 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography fontWeight="fontWeightBold">Country</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="fontWeightBold">
                    Alert Information
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.displayArr.map((row) => (
                <TableRow key={row.text + row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>
                    {row.text} {row.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </MuiThemeProvider>
  );
};

export default ListComponent;
