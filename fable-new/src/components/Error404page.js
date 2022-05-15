import { Paper, Typography } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/styles";
import logo from "./Assets/404.png";

const useStyles = makeStyles({
  storyBook: {
    margin: 100,
  },
  fab: {
    marginLeft: "41%",
    paddingTop: "1%",
    paddingBottom: "1%",
    bgcolor: "blanchedalmond",
  },

  background: {
    backgroundColor: "blanchedalmond",
  },

  logo: {
    width: "30vw",
    marginLeft: "35%",
    marginTop: "10%",
    marginBottom: "20%",
    height: "100%",
  },
});

const Error404page = ({ title, subtitle }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.sizing}>
      <img src={logo} alt="loading..." className={classes.logo} />
    </Paper>
  );
};

export default Error404page;
