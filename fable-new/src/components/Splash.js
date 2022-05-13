import React, { useContext, useEffect } from "react";
import {
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { NavLink, useNavigate } from "react-router-dom";
import { Stack } from "@mui/material";

import "../App.css";
import { AuthContext } from "../firebase/Auth";

const useStyles = makeStyles({
  card: {
    top: "10px",
    width: "900px",
    maxWidth: "1200px",
    height: "auto",
    marginLeft: "190px",
    marginRight: "auto",
    marginTop: "2px",
    borderRadius: 15,
    border: "0px solid #000000",
    fontFamily: "'Encode Sans Semi Expanded', sans-serif",
    fontSize: "30px",
    paddingLeft: "50px",
    backgroundColor: "white",
  },

  card1: {
    width: "600px",
    maxWidth: "900px",
    height: "auto",
    marginLeft: "40px",
    marginRight: "50px",
    marginTop: "10px",
    borderRadius: 15,
    border: "0px solid #000000",
    textAlign: "center",
  },

  titleHead: {
    borderBottom: "1px solid #1e8678",
    fontWeight: "bold",
  },
  grid: {
    flexGrow: 1,
    flexDirection: "row",
  },
  media: {
    height: "auto",
    width: "450px",
  },
  media1: {
    height: "auto",
    width: "150px",
  },
  button: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  right: {
    textAlign: "right",
    maxWidth: "400px",
    maxHeight: "500px",
    marginLeft: "1100px",
  },
});

const Splash = () => {
  const classes = useStyles();
  let { currentUser } = useContext(AuthContext);
  let navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/home");
      return;
    }
  }, [currentUser]);

  return (
    <Stack direction="row">
      <div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <Card className={classes.card} variant="outlined">
          <CardContent>
            <img
              src="fablelogofinal.png"
              alt="image"
              className={classes.media1}
            ></img>
            <br />
            <br />

            <h2 class="h2">Hi, we're Fable </h2>
            <h3 class="h3"> One Stop Destination for Story lovers</h3>

            <h4 class="h4">
              Fable Connects with a global community which is in love with
              stories
            </h4>
          </CardContent>
          <span>
            <CardContent>
              <button class="button">
                <NavLink to="/signin">
                  <span class="linktext">Login</span>
                </NavLink>
              </button>

              <button class="button">
                <NavLink to="/signup">
                  <span class="linktext">Sign-Up</span>
                </NavLink>
              </button>
            </CardContent>
          </span>
        </Card>
      </div>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <Card className={classes.card1} variant="outlined">
          <img src="undraw1.png" className={classes.media}></img>
          <br />
          <br />
          <br />
          <img src="undraw2.png" className={classes.media}></img>
        </Card>
      </div>
      <br />
    </Stack>
  );
};

export default Splash;
