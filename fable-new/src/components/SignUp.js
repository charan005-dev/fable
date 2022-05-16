import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { doCreateUserWithEmailAndPassword } from "../firebase/FirebaseFunctions";
import { collapseClasses, fabClasses } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LockIcon from "@mui/icons-material/Lock";
import { AuthContext } from "../firebase/Auth";
import { NavLink } from "react-router-dom";
import firebase from "firebase";
import { toast } from "react-toastify";
import { Card, CardContent, Grid, makeStyles, Typography, TextField, Paper } from "@material-ui/core";
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
    fontWeight: "bold",
    "&:hover": {
      color: "white",
      textDecoration: "none",
      fontWeight: "bold",
    },
  },
  button: {
    backgroundColor: "black",
    width: "80%",
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
    marginLeft: "10.5%",
    marginTop: "4%",
    "&:hover": {
      backgroundColor: "black",
      color: "white",
      fontWeight: "bold",
    },
  },

  textbox: {
    border: "1px black",
    "&:hover": {
      backgroundColor: "#ececec",
      borderRadius: "4px",
    },
  },

  button1: {
    backgroundColor: "#ececec",
    color: "black",
    textDecoration: "none",
    fontWeight: "bold",
    marginTop: "5%",
    marginLeft: "-10%",
    marginBottom: "5%",
    "&:hover": {
      backgroundColor: "black",
      color: "white",
      textDecoration: "none",
    },
  },
  paper: {
    marginLeft: "35%",
    marginRight: "35%",
    paddingBottom: "1%",
  },
  typog: {
    float: "left",
    marginTop: "1%",
    paddingTop: "5%",
    marginLeft: "2%",
    paddingLeft: "5%",
    marginBottom: "5%",
  },
});

function SignUp() {
  const classes = useStyles();
  const { currentUser } = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const handleSignUp = async (e) => {
    e.preventDefault();
    const { name, email, passwordOne, passwordTwo } = e.target.elements;
    if (passwordOne.value !== passwordTwo.value) {
      setPwMatch("Passwords do not match");
      toast.error("Given passwords do not match", {
        theme: "dark",
        position: "top-center",
      });
      return false;
    }
    // check to see if the display name is available.
    try {
      await axios.get(`/api/users/check?tentative=${name.value}`);
    } catch (e) {
      toast.error("This username is not available.", {
        theme: "dark",
        position: "top-center",
      });
      return;
    }
    if (
      !name.value ||
      typeof name.value !== "string" ||
      name.value.length === 0 ||
      name.value.trim().length === 0 ||
      name.value.length < 6
    ) {
      toast.error("Please make sure the username exceeds 6 characters ", {
        theme: "dark",
        position: "top-center",
      });
      return;
    }
    var isSafari =
      navigator.vendor &&
      navigator.vendor.indexOf("Apple") > -1 &&
      navigator.userAgent &&
      navigator.userAgent.indexOf("CriOS") == -1 &&
      navigator.userAgent.indexOf("FxiOS") == -1;
    if (!isSafari) {
      // Safari doesn't support lookbehind in regex yet (?<=\/).
      // https://stackoverflow.com/questions/51568821/works-in-chrome-but-breaks-in-safari-invalid-regular-expression-invalid-group
      // in this case, skip frontend check - will be caught in backend anyway
      let uNameRegex = new RegExp(`^(?![-])[- '0-9A-Za-z]+(?<![-])$`, "g");
      if (!uNameRegex.test(name.value)) {
        toast.error(
          "It's really catchy but make sure your username contains only alphanumerics and hyphens (can't end with one).",
          {
            theme: "dark",
            position: "top-center",
          }
        );
        return;
      }
    }

    if (passwordOne.value.trim().length === 0 || passwordOne.value.trim().length < 6) {
      toast.error("Your password format is invalid", {
        theme: "dark",
        position: "top-center",
      });
      return;
    }
    try {
      console.log("Firing firebase");
      await doCreateUserWithEmailAndPassword(email.value, passwordOne.value, name.value);
      let userId = firebase.auth().currentUser.uid;
      let emailAddress = firebase.auth().currentUser.email;
      let username = name.value;
      let loweredEmailAddress = emailAddress.toLowerCase();
      const { data } = await axios.post(`/api/users`, {
        userId,
        emailAddress: loweredEmailAddress,
        displayName: username,
      });
      console.log(data);
    } catch (error) {
      toast.error(error.message, {
        theme: "dark",
        position: "top-center",
      });
    }
  };

  if (currentUser) {
    return <Navigate to="/home" />;
  }

  return (
    <Paper className={classes.paper} elevation={24}>
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
            <br />
            <Avatar sx={{ m: 1, bgcolor: "black" }}>
              <LockIcon />
            </Avatar>
            <br />
            <Typography component="h1" variant="h4">
              Sign-Up
            </Typography>
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
                sx={{ border: "1px solid black" }}
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
                sx={{ border: "1px solid black" }}
              />
              <Button className={classes.button} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Sign-Up
              </Button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

              <Typography component="h2" variant="h2" className={classes.typog}>

                Already Have an Account?
              </Typography>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Button onClick={() => navigate(`/signin`)} className={classes.button1}>
                &nbsp; Login &nbsp;
              </Button>
              {/* <NavLink to="/signin" className={classes.textdecoration}>
                <Button sx={{ mt: 3, mb: 2 }} className={classes.button1}>
                  &nbsp; Login &nbsp;
                </Button>
              </NavLink> */}
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </Paper>
  );
}
export default SignUp;
