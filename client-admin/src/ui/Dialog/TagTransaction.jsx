import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { usdFormatter, cryptoFormatter } from "../../util";
import Checkbox from "@material-ui/core/Checkbox";
import CircleCheckedFilled from "@material-ui/icons/CheckCircle";
import CircleUnchecked from "@material-ui/icons/RadioButtonUnchecked";
import QuestionMarkIcon from "../Icons/QuestionMarkIcon";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CreateAccount from "./CreateAccount";
import { getExchangeRate } from "../../actions";

const useStyles = makeStyles((theme) => ({
  closeIcon: {
    position: "absolute",
    right: 5,
    fontFamily: '"Cabin",  sans-serif',
    fontSize: 14,
    letterSpacing: 1.17,
    fontWeight: 700,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: '"Roboto", sans-serif',
    fontSize: 28,
    color: "#000000",
    fontWeight: 400,
  },
  rectangle: {
    backgroundColor: "#daf5ff",
    padding: 25,
  },
  detailTitle: {
    fontFamily: '"Roboto", sans-serif',
    color: "#000000",
    fontSize: 18,
    fontWeight: 400,
    margin: 0,
    lineHeight: 1.33,
  },
  subtitle: {
    fontFamily: '"Cabin", sans-serif',
    color: "#000000",
    marginTop: 6,
    letterSpacing: 0.83,
    fontSize: 10,
    fontWeight: 500,
    textTransform: "uppercase",
  },
  donorList: {
    width: "100%",
    marginTop: 26,
  },
  donorListLabel: {
    fontFamily: '"Roboto", sans-serif',
    fontSize: 19,
    lineHeight: 1.42,
  },
  donorListSelect: {
    fontFamily: '"Roboto", sans-serif',
    height: 42,
    fontSize: 19,
    lineHeight: 1.42,
    color: "#898989",
  },
  donorMessage: {
    fontFamily: '"Roboto", sans-serif',
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1.33,
    color: "#898989",
    marginTop: 35,
  },
  donorNameTextfield: {
    fontFamily: '"Roboto", sans-serif',
    height: 42,
    width: "100%",
  },
  donorWalletTextfield: {
    fontFamily: '"Roboto", sans-serif',
    height: 42,
    width: "100%",
    marginTop: 16,
    marginBottom: 16,
  },
  donorTxidTextfield: {
    fontFamily: '"Roboto", sans-serif',
    height: 42,
    width: "100%",
    marginTop: 16,
    marginBottom: 35,
  },
  donorName: {
    fontFamily: '"Roboto", sans-serif',
    fontSize: 19,
    lineHeight: 1.42,
    color: "#898989",
  },
  donorCheckbox: {
    marginTop: 7,
    fontSize: 14,
    color: "#898989",
    lineHeight: 1.57,
  },
  relativeContainer: {
    position: "relative",
  },
  questionMark: {
    position: "absolute",
    bottom: "22%",
    marginLeft: ".5em",
    width: 20,
    height: 20,
  },
  filledButton: {
    width: "100%",
    height: 35,
    fontFamily: '"Cabin", sans-serif',
    fontSize: 12,
    fontWeight: 700,
    textAlign: "center",
    color: "#ffffff",
    boxShadow: "none",
  },
  outlineButton: {
    width: "100%",
    height: 35,
    fontFamily: '"Cabin", sans-serif',
    fontSize: 12,
    fontWeight: 700,
    textAlign: "center",
    color: "#00aeef",
    borderRadius: 5,
    boxShadow: "none",
  },
  or: {
    textTransform: "uppercase",
    textAlign: "center",
    fontWeight: 700,
    lineHeight: 1.2,
    fontSize: 12,
    color: "#929292",
    marginTop: 10,
    marginBottom: 10,
  },
  form: {
    marginBottom: 80,
  },
  addButton: {
    height: 35,
    fontFamily: '"Cabin", sans-serif',
    fontSize: 12,
    fontWeight: 700,
    textAlign: "center",
    color: "#ffffff",
    boxShadow: "none",
    backgroundColor: "#00aeef",
    float: "right",
    marginTop: 18,
    marginButtom: 18,
  },
}));

/* 
This form is overloaded with multiple 
responsibilities. Add a donor to the transactions, 
or add a donor and define a new donor
but the new donor info is different from
the new donor form under accounts

txid goes ?somewhere?
*/
export default function TagTransaction(props) {
  const classes = useStyles();
  const [exchangeRate, setExchangeRate] = useState(0);
  const [natcoms, setNatcoms] = useState([]);
  const [natcom, setNatcom] = useState("");

  const [donors, setDonors] = useState([]);
  const [donor, setDonor] = useState("");

  const [openCreateAccount, setOpenCreateAccount] = useState(false);
  const [createAccountName, setCreateAccountName] = useState("");
  const [createAccountType, setCreateAccountType] = useState("");
  const [addresses, setAddresses] = useState([]);

  const handleClose = () => {
    if (props.onClose) {
      props.onClose();
    }
  };

  const getAccounts = async () => {
    let res, accounts, donors, natcoms;
    try {
      res = await fetch("/rest/admin/accounts");
      accounts = await res.json();
      donors = accounts.filter((account) => {
        return account.type === "donor";
      });
      natcoms = accounts.filter((account) => {
        return account.type === "natcom";
      });
    } catch (e) {
      console.log(e);
    }

    console.log(natcoms);

    setDonors(donors);
    setNatcoms(natcoms);
  };

  const saveTransaction = async (publish) => {
    // Update Natcom if address is new - HOLD
    // Would also require searching all other natcoms to remove this address from list
    //Update tx data
    const { tx } = props;
    tx.source = natcom;
    tx.donor = donor;
    tx.published = publish;

    let res;
    try {
      res = await fetch(`/rest/admin/transactions/`, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
          tx,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      console.log(e);
      return;
    }

    handleClose();
  };

  useEffect(() => {
    const getExchangeRates = async () => {
      let rate;
      try {
        rate = await getExchangeRate(props.tx.symbol);
      } catch (e) {
        console.log(e);
      }
      setExchangeRate(rate);
    };

    getExchangeRates();
    getAccounts();
    setNatcom(props.tx.source || "");
    setDonor(props.tx.donor || "");

    setAddresses([
      {
        address: props.tx.received ? props.tx.from : props.tx.to,
        currency: props.tx.currency === "Ethereum" ? "Ether" : "Bitcoin",
        amount: props.tx.amount,
      },
    ]);
  }, [props.tx]);

  return (
    <div>
      <CreateAccount
        open={openCreateAccount}
        type={createAccountType}
        edit={false}
        name={createAccountName}
        addresses={addresses}
        onDialogClose={async (account) => {
          setOpenCreateAccount(false);
          await getAccounts();
          if (account) {
            if (account.type === "natcom") {
              setNatcom(account.name);
            } else {
              setDonor(account.name);
            }
          }
        }}
      />
      <Dialog fullScreen open={props.open} onClose={handleClose}>
        <Toolbar>
          <IconButton
            color="primary"
            onClick={handleClose}
            aria-label="close"
            className={classes.closeIcon}
          >
            Cancel <CloseIcon fontSize="large" />
          </IconButton>
        </Toolbar>
        <Container maxWidth={"sm"}>
          <h1 className={classes.title}>{props.title}</h1>
          <Grid container className={classes.rectangle}>
            <Grid item xs={3} className={classes.detailTitle}>
              {donor}
            </Grid>

            <Grid item xs={9} className={classes.detailTitle}>
              {props.tx.source}
            </Grid>

            <Grid item xs={3} className={classes.subtitle}>
              Donor
            </Grid>

            <Grid item xs={9} className={classes.subtitle}>
              Intermediary
            </Grid>
            <Grid item xs={3} className={classes.detailTitle}>
              {cryptoFormatter(props.tx.amount)} {props.tx.symbol}
            </Grid>
            <Grid item xs={9} className={classes.detailTitle}>
              {usdFormatter.format(props.tx.amount * exchangeRate)} USD
            </Grid>
            <Grid item xs={3} className={classes.subtitle}>
              {props.currency} Donated
            </Grid>
            <Grid item xs={9} className={classes.subtitle}>
              Current Value
            </Grid>
          </Grid>
          <form className={classes.form}>
            <FormControl className={classes.donorList}>
              <InputLabel className={classes.donorListLabel}>
                {" "}
                Select a natcom from existing list
              </InputLabel>
              <Select
                className={classes.donorListSelect}
                value={natcom}
                onChange={(e) => {
                  setNatcom(e.target.value);
                }}
              >
                {natcoms.map((natcom) => {
                  return (
                    <MenuItem
                      key={natcom.name}
                      className={classes.donorName}
                      value={natcom.name}
                    >
                      {natcom.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <div className={classes.relativeContainer}>
              <Button
                variant="contained"
                color="primary"
                className={classes.addButton}
                onClick={() => {
                  setCreateAccountType("natcom");
                  setOpenCreateAccount(true);
                }}
              >
                Add Natcom Account
              </Button>
            </div>
            <FormControl className={classes.donorList}>
              <InputLabel className={classes.donorListLabel}>
                {" "}
                Select a donor from existing list
              </InputLabel>
              <Select
                className={classes.donorListSelect}
                value={donor}
                onChange={(e) => {
                  setDonor(e.target.value);
                }}
              >
                {donors.map((donor) => {
                  return (
                    <MenuItem
                      key={donor.name}
                      className={classes.donorName}
                      value={donor.name}
                    >
                      {donor.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <div className={classes.relativeContainer}>
              <Button
                variant="contained"
                color="primary"
                className={classes.addButton}
                onClick={() => {
                  setAddresses([
                    {
                      address: "",
                      currency:
                        props.tx.currency === "Ethereum" ? "Ether" : "Bitcoin",
                      amount: props.tx.amount,
                    },
                  ]);
                  setCreateAccountType("donor");
                  setOpenCreateAccount(true);
                }}
              >
                Add Donor Account
              </Button>
            </div>
          </form>
          {!props.tx.published ? (
            <Fragment>
              <div className={classes.relativeContainer}>
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.outlineButton}
                  onClick={() => {
                    saveTransaction(false);
                  }}
                >
                  Tag and Save Transaction
                </Button>
                <QuestionMarkIcon className={classes.questionMark} />
              </div>
              <p className={classes.or}>Or</p>
              <div className={classes.relativeContainer}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.filledButton}
                  onClick={() => {
                    saveTransaction(true);
                  }}
                >
                  Tag and Publish Transaction
                </Button>
                <QuestionMarkIcon className={classes.questionMark} />
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div className={classes.relativeContainer}>
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.outlineButton}
                  onClick={() => {
                    saveTransaction(props.tx.published);
                  }}
                >
                  Tag and Save Transaction
                </Button>
                <QuestionMarkIcon className={classes.questionMark} />
              </div>
              <p className={classes.or}>Or</p>
              <div className={classes.relativeContainer}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.filledButton}
                  onClick={() => {
                    saveTransaction(false);
                  }}
                >
                  Tag and Unpublish Transaction
                </Button>
                <QuestionMarkIcon className={classes.questionMark} />
              </div>
            </Fragment>
          )}
        </Container>
      </Dialog>
    </div>
  );
}
