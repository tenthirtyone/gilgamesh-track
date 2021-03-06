import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  cardBalance: {
    fontSize: 18,
    lineHeight: 1.33,
  },
}));

export default function ({ children, isBold, className }) {
  const classes = useStyles();

  return (
    <span className={`${classes.cardBalance} ${className}`}>
      {isBold ? <b>{children}</b> : children}
    </span>
  );
}
