import React, { useReducer, useEffect } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";

import { Button, TextField, Typography } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import theme from "../theme";
import "../App.css";

//const GRAPHURL = "http://localhost:5000/graphql";
const GRAPHURL = "/graphql";

const AdvisoryAddComponent = (props) => {
  const initialState = {
    selectedCountry: null,
    countryNames: [],
    travellerName: "",
    msg: "Add Advisory",
  };

  const sendDataToParent = (msgToSend) => {
    props.dataForSnackBar(msgToSend);
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const handleNameInput = (e) => {
    setState({ travellerName: e.target.value });
  };

  const onComboChange = (e, selectedOption) => {
    selectedOption
      ? setState({ selectedCountry: selectedOption })
      : setState({ selectedCountry: null });
  };

  useEffect(() => {
    fetchCountries();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCountries = async () => {
    try {
      sendDataToParent("loading countries...");

      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: `query {allcountries}` }),
      });

      let payload = await response.json();

      setState({ countryNames: payload.data.allcountries});
      
      sendDataToParent(`found ${payload.data.allcountries.length} countries`);
    } catch (error) {
      console.log(error);
      setState({
        msg: `Problem loading server data - ${error.message}`,
      });
    }
  }; //fetchCountries

  const emptyorundefined =
    state.travellerName === undefined ||
    state.travellerName === null ||
    /^\s+$/.test(state.travellerName) ||
    state.selectedCountry === undefined ||
    state.selectedCountry === null;

  const handleAddAdvisory = async () => {
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query:
            "mutation($name: String, $country: String) { addAdvisory(name: $name, country: $country) {name,country,text,date}}",
          variables: {
            name: state.travellerName,
            country: state.selectedCountry,
          },
        }),
      });

      let payload = await response.json();
      sendDataToParent(`added advisory on ${payload.data.addAdvisory.date}`);
      setState({ travellerName: "", selectedCountry: null })
    } catch (error) {
      console.log(error);
      setState({
        msg: `Problem adding advisory - ${error.message}`,
      });
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
      <TextField
        onChange={handleNameInput}
        helperText="Traveller's Name"
        value={state.travellerName}
        style={{ justifyContent: "center", display: "flex", padding: "2vh" }}
      />
      <Autocomplete
        options={state.countryNames}
        getOptionLabel={(option) => option}
        style={{ width: 300 }}
        onChange={onComboChange}
        value={state.selectedCountry}
        renderInput={(params) => (
          <TextField
            style={{ padding: "2vh" }}
            {...params}
            label="Select a Country"
            variant="outlined"
            fullWidth            
          />
        )}
      />

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleAddAdvisory}
        disabled={emptyorundefined}
        fullWidth
      >
        ADD ADVISORY
      </Button>
    </MuiThemeProvider>
  );
};
export default AdvisoryAddComponent;
