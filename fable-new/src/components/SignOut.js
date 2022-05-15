import React from "react";
import { doSignOut } from "../firebase/FirebaseFunctions";
import { makeStyles, Button } from "@material-ui/core";

const useStyles = makeStyles({
  button: {
    backgroundColor: "black",
    color: "white",
  },
});

const SignOutButton = () => {
  const classes = useStyles();
  return (
    <Button variant="contained" onClick={doSignOut} className={classes.button}>
      Sign-Out
    </Button>
  );
};

export default SignOutButton;
