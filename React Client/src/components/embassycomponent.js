import React, { useReducer, useEffect } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";

import { TextField, Typography, Divider, Button } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import theme from "../theme";
import "../App.css";

//const GRAPHURL = "http://localhost:5000/graphql";
const GRAPHURL = "/graphql";

const EmbassyComponent = (props) => {
  const initialState = {
    selectedCountry: null,
    countryNames: [],
    embassy: null,
    msg: "",
  };

  const sendDataToParent = (msgToSend) => {
    props.dataForSnackBar(msgToSend);
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const onComboChange = async (e, selectedOption) => {
    if (selectedOption) {
      setState({ selectedCountry: selectedOption });

      try {
        //fetch embassy info for selectedOption
        let response = await fetch(GRAPHURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `query($sourcecountry: String) {embassyForCountry(sourcecountry: $sourcecountry) {sourceCountry,lat,lng,country,city,address,embassytype,passport,tel,fax,email,website}}`,
            variables: { sourcecountry: selectedOption },
          }),
        });

        let payload = await response.json();
        setState({
          embassy: payload.data.embassyForCountry[0],
          msg: "Your nearest embassy",
        });
      } catch (error) {
        console.log(error);
        setState({
          msg: `Problem loading server data - ${error.message}`,
        });
      }
    } else {
      setState({ selectedCountry: null, embassy: null, msg: "" });
    }
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
        body: JSON.stringify({ query: `query {allEmbassyCountries}` }),
      });

      let payload = await response.json();

      setState({ countryNames: payload.data.allEmbassyCountries });
      sendDataToParent(
        `found ${payload.data.allEmbassyCountries.length} countries`
      );
    } catch (error) {
      console.log(error);
      setState({
        msg: `Problem loading server data - ${error.message}`,
      });
    }
  };

  return (
    <MuiThemeProvider theme={theme}>
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

      <Typography
        style={{ textAlign: "center", padding: "1vh" }}
        variant="h5"
        color="primary"
      >
        {state.msg}
      </Typography>

      {state.embassy !== null && (
        <React.Fragment>
          <div style={{ padding: 5 }}>
            <Typography>
              <h4 style={{ display: "inline" }}>Country:</h4>{" "}
              {`${state.embassy.country}`}
            </Typography>
          </div>
          <Divider variant="middle" />
          <div style={{ padding: 5 }}>
            <Typography>
              <h4 style={{ display: "inline" }}>City:</h4> {state.embassy.city}
            </Typography>
          </div>
          <Divider variant="middle" />
          <div style={{ padding: 5 }}>
            <Typography>
              <h4 style={{ display: "inline" }}>Address:</h4>{" "}
              {state.embassy.address}
            </Typography>
          </div>
          <Divider variant="middle" />
          <div style={{ padding: 5 }}>
            <Typography>
              <h4 style={{ display: "inline" }}>Owner:</h4>{" "}
              {state.embassy.embassytype}
            </Typography>
          </div>
          <Divider variant="middle" />
          <div style={{ padding: 5 }}>
            <Typography>
              <h4 style={{ display: "inline" }}>Has Passport Services:</h4>{" "}
              {state.embassy.passport === 1 ? `Yes` : `No`}
            </Typography>
          </div>
          <Divider variant="middle" />
          <div style={{ padding: 5 }}>
            <Typography>
              <h4 style={{ display: "inline" }}>Tel:</h4> {state.embassy.tel}
            </Typography>
          </div>
          <Divider variant="middle" />
          <div style={{ padding: 5 }}>
            <Typography>
              <h4 style={{ display: "inline" }}>Fax:</h4> {state.embassy.fax}
            </Typography>
          </div>
          <Divider variant="middle" />
          <div style={{ padding: 5 }}>
            <Typography>
              <h4 style={{ display: "inline" }}>Email:</h4>{" "}
              {state.embassy.email}
            </Typography>
          </div>
          <Divider variant="middle" />
          <div style={{ padding: 5 }}>
            <Typography>
              <h4 style={{ display: "inline" }}>Website:</h4>{" "}
              <a
                target="_blank"
                rel="noreferrer"
                href={`${state.embassy.website}`}
              >
                {state.embassy.website}
              </a>
            </Typography>{" "}
          </div>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() =>
              window.open(
                `https://maps.google.com/?q=${state.embassy.lat},${state.embassy.lng}`,
                "_blank"
              )
            }
            fullWidth
            style={{ marginTop: "3vh" }}
          >
            Open Map
          </Button>
        </React.Fragment>
      )}
    </MuiThemeProvider>
  );
};
export default EmbassyComponent;
