import React, { Component } from "react";
import "./Checkout.css";
import Header from "../../common/header/Header";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import { withStyles } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

const styles = (theme) => ({
  stepper: {
    "padding-top": "0px",
    "@media (max-width:600px)": {
      padding: "0px",
    },
  },

  gridList: {
    flexWrap: "nowrap",
    transform: "translateZ(0)",
  },

  addressCheckButton: {
    float: "right",
  },

  saveAddressForm: {
    width: "60%",
    padding: "20px",
    textAlign: "left",
  },

  formControl: {
    width: "200px",
  },

  selectField: {
    width: "100%",
  },

  formButton: {
    "font-weight": 400,
    width: "150px",
  },

  actionsContainer: {
    marginBottom: theme.spacing(2),
  },

  button: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
  },

  resetContainer: {
    padding: theme.spacing(3),
  },

  summaryHeader: {
    "margin-left": "10px",
    "margin-right": "10px",
  },

  restaurantName: {
    "font-size": "18px",
    color: "rgb(85,85,85)",
    margin: "10px 0px 10px 0px",
  },

  cardContent: {
    "padding-top": "0px",
    "margin-left": "10px",
    "margin-right": "10px",
  },
});

const TabContainer = function(props) {
  return (
    <Typography className={props.className} component="div">
      {props.children}
    </Typography>
  );
};
TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class Checkout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStep: 0,
      steps: ["Delivery", "Payment"],
      value: 0,
      addresses: [],
      noOfColumn: 3,
      accessToken: sessionStorage.getItem("access-token"),
      selectedAddress: "",
      flatBuildingName: "",
      flatBuildingNameRequired: "dispNone",
      locality: "",
      localityRequired: "dispNone",
      city: "",
      cityRequired: "dispNone",
      selectedState: "",
      stateRequired: "dispNone",
      pincode: "",
      pincodeRequired: "dispNone",
      pincodeHelpText: "dispNone",
      states: [],
      selectedPayment: "",
      payment: [],
      restaurantDetails: props.location.restaurantDetails
        ? props.location.restaurantDetails
        : { name: null },
    };
  }

  componentDidMount() {
    this.getAllAddress();

    let statesData = null;
    let xhrStates = new XMLHttpRequest();
    let that = this;
    xhrStates.addEventListener("readystatechange", function() {
      if (xhrStates.readyState === 4 && xhrStates.status === 200) {
        let states = JSON.parse(xhrStates.responseText).states;
        that.setState({
          ...that.state,
          states: states,
        });
      }
    });
    xhrStates.open("GET", this.props.baseUrl + "states");
    xhrStates.send(statesData);
  }

  getAllAddress = () => {
    let data = null;
    let that = this;
    let xhrAddress = new XMLHttpRequest();

    xhrAddress.addEventListener("readystatechange", function() {
      if (xhrAddress.readyState === 4 && xhrAddress.status === 200) {
        let responseAddresses = JSON.parse(xhrAddress.responseText).addresses;
        let addresses = [];
        responseAddresses.forEach((responseAddress) => {
          let address = {
            id: responseAddress.id,
            city: responseAddress.city,
            flatBuildingName: responseAddress.flat_building_name,
            locality: responseAddress.locality,
            pincode: responseAddress.pincode,
            state: responseAddress.state,
            selected: false,
          };
          addresses.push(address);
        });
        that.setState({
          ...that.state,
          addresses: addresses,
        });
      }
    });

    xhrAddress.open("GET", this.props.baseUrl + "address/customer");
    xhrAddress.setRequestHeader(
      "authorization",
      "Bearer " + this.state.accessToken
    );
    xhrAddress.send(data);
  };

  tabsChangeHandler = (event, value) => {
    this.setState({
      value,
    });
  };

  nextButtonClickHandler = () => {
    if (this.state.value === 0) {
      if (this.state.selectedAddress !== "") {
        let activeStep = this.state.activeStep;
        activeStep++;
        this.setState({
          ...this.state,
          activeStep: activeStep,
        });
      } else {
        this.setState({
          ...this.state,
          snackBarOpen: true,
          snackBarMessage: "Select Address",
        });
      }
    }
    if (this.state.activeStep === 1) {
      if (this.state.selectedPayment === "") {
        let activeStep = this.state.activeStep;
        this.setState({
          ...this.state,
          activeStep: activeStep,
          snackBarOpen: true,
          snackBarMessage: "Select Payment",
        });
      }
    }
  };

  backButtonClickHandler = () => {
    let activeStep = this.state.activeStep;
    activeStep--;
    this.setState({
      ...this.state,
      activeStep: activeStep,
    });
  };

  addressSelectedClickHandler = (addressId) => {
    let addresses = this.state.addresses;
    let selectedAddress = "";
    addresses.forEach((address) => {
      if (address.id === addressId) {
        address.selected = true;
        selectedAddress = address.id;
      } else {
        address.selected = false;
      }
    });
    this.setState({
      ...this.state,
      addresses: addresses,
      selectedAddress: selectedAddress,
    });
  };

  inputFlatBuildingNameChangeHandler = (event) => {
    this.setState({
      ...this.state,
      flatBuildingName: event.target.value,
    });
  };

  inputLocalityChangeHandler = (event) => {
    this.setState({
      ...this.state,
      locality: event.target.value,
    });
  };

  inputCityChangeHandler = (event) => {
    this.setState({
      ...this.state,
      city: event.target.value,
    });
  };

  selectSelectedStateChangeHandler = (event) => {
    this.setState({
      ...this.state,
      selectedState: event.target.value,
    });
  };

  inputPincodeChangeHandler = (event) => {
    this.setState({
      ...this.state,
      pincode: event.target.value,
    });
  };

  saveAddressClickHandler = () => {
    if (this.saveAddressFormValid()) {
      let newAddressData = JSON.stringify({
        city: this.state.city,
        flat_building_name: this.state.flatBuildingName,
        locality: this.state.locality,
        pincode: this.state.pincode,
        state_uuid: this.state.selectedState,
      });

      let xhrSaveAddress = new XMLHttpRequest();
      let that = this;

      xhrSaveAddress.addEventListener("readystatechange", function() {
        if (xhrSaveAddress.readyState === 4 && xhrSaveAddress.status === 201) {
          that.setState({
            ...that.state,
            value: 0,
          });
          that.getAllAddress();
        }
      });

      xhrSaveAddress.open("POST", this.props.baseUrl + "address");
      xhrSaveAddress.setRequestHeader(
        "authorization",
        "Bearer " + this.state.accessToken
      );
      xhrSaveAddress.setRequestHeader("Content-Type", "application/json");
      xhrSaveAddress.send(newAddressData);
    }
  };

  saveAddressFormValid = () => {
    let flatBuildingNameRequired = "dispNone";
    let cityRequired = "dispNone";
    let localityRequired = "dispNone";
    let stateRequired = "dispNone";
    let pincodeRequired = "dispNone";
    let pincodeHelpText = "dispNone";
    let saveAddressFormValid = true;

    if (this.state.flatBuildingName === "") {
      flatBuildingNameRequired = "dispBlock";
      saveAddressFormValid = false;
    }

    if (this.state.locality === "") {
      localityRequired = "dispBlock";
      saveAddressFormValid = false;
    }

    if (this.state.selectedState === "") {
      stateRequired = "dispBlock";
      saveAddressFormValid = false;
    }

    if (this.state.city === "") {
      cityRequired = "dispBlock";
      saveAddressFormValid = false;
    }

    if (this.state.pincode === "") {
      pincodeRequired = "dispBlock";
      saveAddressFormValid = false;
    }
    if (this.state.pincode !== "") {
      var pincodePattern = /^\d{6}$/;
      if (!this.state.pincode.match(pincodePattern)) {
        pincodeHelpText = "dispBlock";
        saveAddressFormValid = false;
      }
    }
    this.setState({
      ...this.state,
      flatBuildingNameRequired: flatBuildingNameRequired,
      cityRequired: cityRequired,
      localityRequired: localityRequired,
      stateRequired: stateRequired,
      pincodeRequired: pincodeRequired,
      pincodeHelpText: pincodeHelpText,
    });

    return saveAddressFormValid;
  };

  radioChangeHandler = (event) => {
    this.setState({
      ...this.state,
      selectedPayment: event.target.value,
    });
  };

  changeButtonClickHandler = () => {
    this.setState({
      ...this.state,
      activeStep: 0,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Header baseUrl={this.props.baseUrl} showHeaderSearchBox={false} />
        <div className="checkout-container">
          <div className="stepper-container">
            <Stepper
              activeStep={this.state.activeStep}
              orientation="vertical"
              className={classes.stepper}
            >
              {this.state.steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    {index === 0 ? (
                      <div className="address-container">
                        <Tabs
                          className="address-tabs"
                          value={this.state.value}
                          onChange={this.tabsChangeHandler}
                        >
                          <Tab label="EXISTING ADDRESS" />
                          <Tab label="NEW ADDRESS" />
                        </Tabs>
                        {/* Display Existing Address */}
                        {this.state.value === 0 && (
                          <TabContainer>
                            {this.state.addresses.length !== 0 ? (
                              <GridList
                                className={classes.gridList}
                                cols={this.state.noOfColumn}
                                spacing={2}
                                cellHeight="auto"
                              >
                                {this.state.addresses.map((address) => (
                                  <GridListTile
                                    className={classes.gridListTile}
                                    key={address.id}
                                    style={{
                                      borderColor: address.selected
                                        ? "rgb(224,37,96)"
                                        : "white",
                                    }}
                                  >
                                    <div className="grid-list-tile-container">
                                      <Typography variant="body1" component="p">
                                        {address.flatBuildingName}
                                      </Typography>
                                      <Typography variant="body1" component="p">
                                        {address.locality}
                                      </Typography>
                                      <Typography variant="body1" component="p">
                                        {address.city}
                                      </Typography>
                                      <Typography variant="body1" component="p">
                                        {address.state.state_name}
                                      </Typography>
                                      <Typography variant="body1" component="p">
                                        {address.pincode}
                                      </Typography>
                                      <IconButton
                                        className={classes.addressCheckButton}
                                        onClick={() =>
                                          this.addressSelectedClickHandler(
                                            address.id
                                          )
                                        }
                                      >
                                        <CheckCircleIcon
                                          style={{
                                            color: address.selected
                                              ? "green"
                                              : "grey",
                                          }}
                                        />
                                      </IconButton>
                                    </div>
                                  </GridListTile>
                                ))}
                              </GridList>
                            ) : (
                              <Typography variant="body1" component="p">
                                There are no saved addresses! You can save an
                                address using the 'New Address' tab or using
                                your ‘Profile’ menu option.
                              </Typography>
                            )}
                          </TabContainer>
                        )}
                        {/* Add New Address */}
                        {this.state.value === 1 && (
                          <TabContainer className={classes.saveAddressForm}>
                            <FormControl
                              required
                              className={classes.formControl}
                            >
                              <InputLabel htmlFor="flat-building-name">
                                Flat / Building No.
                              </InputLabel>
                              <Input
                                id="flat-building-name"
                                className="input-fields"
                                flatbuildingname={this.state.flatBuildingName}
                                fullWidth={true}
                                value={this.state.flatBuildingName}
                                onChange={
                                  this.inputFlatBuildingNameChangeHandler
                                }
                              />
                              <FormHelperText
                                className={this.state.flatBuildingNameRequired}
                              >
                                <span className="red">required</span>
                              </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <FormControl className={classes.formControl}>
                              <InputLabel htmlFor="locality">
                                Locality
                              </InputLabel>
                              <Input
                                id="locality"
                                className="input-fields"
                                locality={this.state.locality}
                                fullWidth={true}
                                value={this.state.locality}
                                onChange={this.inputLocalityChangeHandler}
                              />
                              <FormHelperText
                                className={this.state.localityRequired}
                              >
                                <span className="red">required</span>
                              </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <FormControl
                              required
                              className={classes.formControl}
                            >
                              <InputLabel htmlFor="city">City</InputLabel>
                              <Input
                                id="city"
                                className="input-fields"
                                type="text"
                                city={this.state.city}
                                fullWidth={true}
                                value={this.state.city}
                                onChange={this.inputCityChangeHandler}
                              />
                              <FormHelperText
                                className={this.state.cityRequired}
                              >
                                <span className="red">required</span>
                              </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <FormControl
                              required
                              className={classes.formControl}
                            >
                              <InputLabel htmlFor="state">State</InputLabel>
                              <Select
                                id="state"
                                className={classes.selectField}
                                state={this.state.selectedState}
                                MenuProps={{
                                  style: {
                                    marginTop: "50px",
                                    maxHeight: "300px",
                                  },
                                }}
                                value={this.state.selectedState}
                                onChange={this.selectSelectedStateChangeHandler}
                              >
                                {this.state.states.map((state) => (
                                  <MenuItem value={state.id} key={state.id}>
                                    {state.state_name}
                                  </MenuItem>
                                ))}
                              </Select>
                              <FormHelperText
                                className={this.state.stateRequired}
                              >
                                <span className="red">required</span>
                              </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <FormControl
                              required
                              className={classes.formControl}
                            >
                              <InputLabel htmlFor="pincode">Pincode</InputLabel>
                              <Input
                                id="pincode"
                                className="input-fields"
                                pincode={this.state.pincode}
                                fullWidth={true}
                                value={this.state.pincode}
                                onChange={this.inputPincodeChangeHandler}
                              />
                              <FormHelperText
                                className={this.state.pincodeRequired}
                              >
                                <span className="red">required</span>
                              </FormHelperText>
                              <FormHelperText
                                className={this.state.pincodeHelpText}
                              >
                                <span className="red">
                                  Pincode must contain only numbers and must be
                                  6 digits long
                                </span>
                              </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <br />
                            <Button
                              variant="contained"
                              className={classes.formButton}
                              color="secondary"
                              onClick={this.saveAddressClickHandler}
                            >
                              SAVE ADDRESS
                            </Button>
                          </TabContainer>
                        )}
                      </div>
                    ) : (
                      // Display Modes of Payment
                      <div className="payment-container">
                        <FormControl
                          component="fieldset"
                          className={classes.radioFormControl}
                        >
                          <FormLabel component="legend">
                            Select Mode of Payment
                          </FormLabel>
                          <RadioGroup
                            aria-label="payment"
                            name="payment"
                            value={this.state.selectedPayment}
                            onChange={this.radioChangeHandler}
                          >
                            {this.state.payment.map((payment) => (
                              <FormControlLabel
                                key={payment.id}
                                value={payment.id}
                                control={<Radio />}
                                label={payment.payment_name}
                              />
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </div>
                    )}
                    <div className={classes.actionsContainer}>
                      <div>
                        <Button
                          disabled={this.state.activeStep === 0}
                          className={classes.button}
                          onClick={this.backButtonClickHandler}
                        >
                          Back
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          className={classes.button}
                          onClick={this.nextButtonClickHandler}
                        >
                          {this.state.activeStep === this.state.steps.length - 1
                            ? "Finish"
                            : "Next"}
                        </Button>
                      </div>
                    </div>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {/* Change button functionality */}
            {this.state.activeStep === this.state.steps.length && (
              <Paper square elevation={0} className={classes.resetContainer}>
                <Typography>
                  View the summary and place your order now!
                </Typography>
                <Button
                  className={classes.button}
                  onClick={this.changeButtonClickHandler}
                >
                  Change
                </Button>
              </Paper>
            )}
          </div>
          {/* Summary Card */}
          <div className="summary-container">
            <Card className={classes.summary}>
              <CardHeader
                title="Summary"
                titleTypographyProps={{ vartiant: "h5" }}
                className={classes.summaryHeader}
              />
              <CardContent className={classes.cardContent}>
                <Typography
                  variant="subtitle1"
                  component="p"
                  className={classes.restaurantName}
                >
                  {this.state.restaurantDetails.name}
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Checkout);
