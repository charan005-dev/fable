import { Grid, Paper, Typography } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/styles";
import logo from "./Assets/404.png";
import { Link } from "react-router-dom";

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
  headText: {
    paddingTop: 100,
  },
});

const Error404page = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.sizing}>
      <Grid className={classes.headText} container justifyContent="center">
        <Typography variant="overline">
          (You've reached the void. <Link to={`/home`}>Click here</Link> to go to safety.)
        </Typography>
      </Grid>
      <img src={logo} alt="error 404" className={classes.logo} />
      <br />
    </Paper>
  );
};

export default Error404page;
