import React from "react";
import { Button, Typography } from "@material-ui/core";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../firebase/Auth";
import firebaseApp from "../../firebase/Firebase";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  storyLink: {
    textDecoration: "none",
    fontWeight: "bolder",
  },
});

const Greeting = () => {
  const [currentState, setCurrentState] = useState("");

  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged((a) => setCurrentState(a.displayName));
  }, []);

  const classes = useStyles();
  return (
    <div>
      &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;Welcome
      <Typography variant="h5" component={"h1"} className={classes.storyLink}>
        &nbsp;&nbsp; &nbsp;&nbsp; {currentState && currentState + "!"}
      </Typography>
    </div>
  );
};

export default Greeting;
