import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TxReceivedIcon from "../../components/atoms/Icons/TxReceivedIcon";
import TxSentIcon from "../../components/atoms/Icons/TxSentIcon";
import EditIcon from "../../components/atoms/Icons/EditIcon";
import TxStepper from "../../components/organisms/TxStepper";
import TextButton from "../../components/atoms/Button/TextIcon";

import { usdFormatter, cryptoFormatter } from "../../util";

const useStyles = makeStyles((theme) => ({
  walletSubtitle: {
    fontFamily: '"Cabin", sans-serif',
    color: "#000000",
    marginTop: 6,
    letterSpacing: 0.83,
    fontSize: 10,
    fontWeight: 500,
    textTransform: "uppercase",
  },
  transaction: {
    marginTop: "2em",
    marginBottom: "3em",
  },
  arrowIcon: {
    width: "1.25em",
    marginRight: ".5em",
  },
  txHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "left",
  },
  headerText: {
    fontFamily: '"Roboto", sans-serif',
    fontSize: 14,
    lineHeight: 1.57,
    color: "#000000",
  },
  txDetailsButton: {
    marginTop: "1em",
  },
  unpublishedTxBalance: {
    fontFamily: '"Roboto", sans-serif',
    color: "#000000",
    fontSize: 24,
    fontWeight: 400,
    margin: 0,
    paddingTop: 12,
  },
  archiveTransactionButton: {
    marginTop: "1em",
    float: "left",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1,
    fontFamily: '"Cabin", sans-serif',
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.textButtonHover,
    },
    "& .MuiButton-endIcon": {
      margin: 0,
    },
    paddingLeft: 0,
    "& .MuiButton-startIcon": {
      margin: 0,
      marginTop: 8,
    },
  },
}));

export default function PublishedTransactionCard({
  tx,
  txid,
  timestamp,
  address,
  currency,
  amount,
  symbol,
  to,
  from,
  amountUSD,
  currentValue,
  sent,
  received,
  setAuthorizationRecord,
  onTagTransactionClick,
  isAdmin,
}) {
  const classes = useStyles();
  const txSent = new Date(timestamp);
  return (
    <Fragment>
      <Grid container className={classes.transaction}>
        <Grid item xs={12} className={classes.txHeader}>
          {sent ? (
            <TxSentIcon className={classes.arrowIcon} />
          ) : (
            <TxReceivedIcon className={classes.arrowIcon} />
          )}
          <span className={classes.headerText}>
            Crypto {sent ? "sent" : null} {received ? "received" : null} at{" "}
            <b>
              {txSent.getUTCHours()}:{txSent.getMinutes() < 10 ? "0" : ""}
              {txSent.getMinutes()} UTC, {txSent.toDateString()}
            </b>
          </span>
        </Grid>
        <Grid item xs={8}>
          <TxStepper
            sent={tx.sent}
            received={tx.received}
            source={tx.source}
            destination={tx.destination}
            donor={tx.donor}
            to={tx.to}
            from={tx.from}
          />
          <div className={classes.txDetailsButton}>
            <TextButton
              endIcon={<ChevronRightIcon />}
              onClick={() => {
                switch (symbol) {
                  case "BTC":
                    window.open(
                      `https://www.blockchain.com/btc/tx/${txid}`,
                      "_blank"
                    );
                    break;
                  case "ETH":
                    window.open(`https://etherscan.io/tx/${txid}`);
                    break;
                  default:
                    break;
                }
              }}
            >
              Show Transaction Details
            </TextButton>
          </div>
        </Grid>
        <Grid item xs={4}>
          <div className={classes.unpublishedTxBalance}>
            <b>{cryptoFormatter(amount)}</b> {symbol} /{" "}
            {usdFormatter(amountUSD)}
          </div>
          <div className={classes.walletSubtitle}>Donated Amount</div>

          {isAdmin && (
            <TextButton
              className={classes.archiveTransactionButton}
              startIcon={<EditIcon style={{ paddingTop: 5, fontSize: 26 }} />}
              onClick={() => {
                onTagTransactionClick(tx);
              }}
              style={{ marginTop: "1em" }}
            >
              Edit Transaction
            </TextButton>
          )}
        </Grid>
      </Grid>
      <Divider />
    </Fragment>
  );
}
