import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { doCreateUserWithEmailAndPassword } from "../firebase/FirebaseFunctions";

import { collapseClasses, fabClasses } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LockIcon from "@mui/icons-material/Lock";
import { AuthContext } from "../firebase/Auth";
import { NavLink } from "react-router-dom";
import SocialSignIn from "./SocialSignIn";
import firebase from "firebase";
import { create } from "@mui/material/styles/createTransitions";
import { Card, CardContent, Grid, makeStyles, Typography, TextField } from "@material-ui/core";

import { doSignInWithEmailAndPassword, doPasswordReset } from "../firebase/FirebaseFunctions";
const axios = require("axios").default;
// axios.defaults.baseURL = "http://localhost:4000";

const theme = createTheme();

const useStyles = makeStyles({
  card: {
    top: "10px",
    width: "300px",
    maxWidth: "1200px",
    height: "auto",
    marginLeft: "300px",
    marginRight: "auto",
    marginTop: "200px",
    paddingTop: "30px",
    borderRadius: 15,
    border: "1px solid #000000",
    fontFamily: "'Encode Sans Semi Expanded', sans-serif",
    fontSize: "30px",
    paddingLeft: "50px",
    backgroundColor: "white",
  },
  text: {
    justifyContent: "center",
    paddingLeft: "50px",
  },

  textdecoration: {
    color: "black",
    textdecoration: "none",

    "&:hover": {
      color: "blanchedalmond",
      textdecoration: "none",
    },
  },
  button: {
    backgroundColor: "black",
    color: "blanchedalmond",
    textDecoration: "white",
    "&:hover": {
      backgroundColor: "blanchedalmond",
      color: "black",
      textDecoration: "white",
    },
    textbox: {
      border: "5px black",
      "&:hover": {
        backgroundColor: "#5dc2a6",
        border: "5px bold black",
      },
    },
  },

  button1: {
    backgroundColor: "blanchedalmond",
    color: "black",
    "&:hover": {
      backgroundColor: "black",
      color: "blanchedalmond",
    },
  },
});

function SignUp() {
  const classes = useStyles();
  const { currentUser } = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState("");
  const [token, setToken] = useState("");
  const handleSignUp = async (e) => {
    e.preventDefault();
    const { name, email, passwordOne, passwordTwo } = e.target.elements;
    if (passwordOne.value !== passwordTwo.value) {
      setPwMatch("Passwords do not match");
      return false;
    }
    try {
      await doCreateUserWithEmailAndPassword(email.value, passwordOne.value, name.value);
      console.log(email.value);
      let userId = firebase.auth().currentUser.uid;
      let emailAddress = firebase.auth().currentUser.email;
      let username = name.value;
      const { data } = await axios.post(`/api/users`, {
        userId,
        emailAddress,
        displayName: username,
      });
      console.log(data);
    } catch (error) {
      alert(error);
    }
  };

  if (currentUser) {
    return <Navigate to="/home" />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" sx={{ marginTop: 8 }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "black" }}>
            <LockIcon />
          </Avatar>
          <br />
          <Typography component="h1" variant="h4">
            Sign-Up
          </Typography>
          {pwMatch && <h4 className="error">{pwMatch}</h4>}
          <Box component="form" onSubmit={handleSignUp} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              className={classes.textbox}
              id="name"
              label="name"
              name="name"
              autoComplete="name"
              autoFocus
              variant="outlined"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              className={classes.textbox}
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              variant="outlined"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              className={classes.textbox}
              name="passwordOne"
              label="Password"
              type="password"
              id="passwordOne"
              autoComplete="current-password"
              variant="outlined"
              sx={{ border: "4px bold black" }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              className={classes.textbox}
              name="passwordTwo"
              label="Confirm Password"
              type="password"
              id="passwordTwo"
              autoComplete="current-password"
              variant="outlined"
              sx={{ border: "4px bold black" }}
            />
            <Button className={classes.button} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign-Up
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Typography component="h11" variant="h11">
              Already Have an Account?
            </Typography>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button className={classes.button1} sx={{ mt: 3, mb: 2 }}>
              &nbsp;
              <NavLink to="/login" className={classes.textdecoration}>
                {" "}
                Login{" "}
              </NavLink>{" "}
              &nbsp;
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
export default SignUp;
