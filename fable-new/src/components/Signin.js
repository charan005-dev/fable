import React, { useContext } from "react";
import SocialSignIn from "./SocialSignIn";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import { NavLink } from "react-router-dom";
import { doSignInWithEmailAndPassword, doPasswordReset } from "../firebase/FirebaseFunctions";
import { Card, CardContent, Grid, makeStyles, Typography, TextField } from "@material-ui/core";
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
import { toast } from "react-toastify";
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
    "&:hover": {
      color: "blanchedalmond",
      textDecoration: "none",
    },
  },
  button: {
    backgroundColor: "black",
    color: "blanchedalmond",
    textDecoration: "none",
    "&:hover": {
      backgroundColor: "blanchedalmond",
      color: "black",
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

function Signin() {
  const classes = useStyles();
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);
  const handleLogin = async (event) => {
    event.preventDefault();
    let { email, password } = event.target.elements;
    try {
      await doSignInWithEmailAndPassword(email.value, password.value);
    } catch (error) {
      toast.error(error.message, {
        theme: "dark",
        position: "top-center",
        autoClose: 1500,
      });
    }
  };

  const passwordReset = (event) => {
    event.preventDefault();
    let email = document.getElementById("email").value;
    if (email) {
      doPasswordReset(email);
      toast.success("Password reset email will be sent if the entered email is in our system.", {
        theme: "dark",
        position: "top-center",
        autoClose: 1500,
      });
    } else {
      toast.error("Please enter an email address before triggering the password reset email!", {
        theme: "dark",
        position: "top-center",
        autoClose: 1500,
      });
    }
  };
  if (currentUser) {
    return <Navigate to="/home" />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };
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
            Login
          </Typography>
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
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
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              variant="outlined"
              sx={{ border: "4px bold black" }}
            />
            <Button className={classes.button} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Login
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
            <Button className={classes.button1} sx={{ mt: 3, mb: 2 }}>
              &nbsp;
              <NavLink to="/signup" className={classes.textdecoration}>
                {" "}
                Sign Up{" "}
              </NavLink>{" "}
              &nbsp;
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button className={classes.button1} onClick={passwordReset} sx={{ mt: 3, mb: 2 }}>
              &nbsp; Forgot Password &nbsp;
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Signin;
