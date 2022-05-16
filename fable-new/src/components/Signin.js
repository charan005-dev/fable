import React, { useContext } from "react";
import SocialSignIn from "./SocialSignIn";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import { NavLink } from "react-router-dom";
import {
  doSignInWithEmailAndPassword,
  doPasswordReset,
} from "../firebase/FirebaseFunctions";
import {
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
  TextField,
  Paper,
} from "@material-ui/core";
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
    textDecoration: "black",
    fontWeight: "bold",
    marginLeft: "10%",
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
     
    },
  },

  button1: {
    backgroundColor: "#ececec",
    color: "black",
    textDecoration: "#ececec",
    marginLeft: "1%",
    marginTop: "4%",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "black",
      color: "white",
      textDecoration: "black",
      fontWeight: "bold",
    },
  },

  button2: {
    backgroundColor: "#ececec",
    color: "black",
    textDecoration: "#ececec",
    marginLeft: "-4%",
    marginTop: "4%",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "black",
      color: "white",
      textDecoration: "black",
      fontWeight: "bold",
    },
  },
  paper: {
    marginLeft: "35%",
    marginRight: "35%",
    paddingBottom: "1%",
  },
});

function Signin() {
  const classes = useStyles();
  const navigate = useNavigate();
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
      toast.success(
        "Password reset email will be sent if the entered email is in our system.",
        {
          theme: "dark",
          position: "top-center",
          autoClose: 1500,
        }
      );
    } else {
      toast.error(
        "Please enter an email address before triggering the password reset email!",
        {
          theme: "dark",
          position: "top-center",
          autoClose: 1500,
        }
      );
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
              Login
            </Typography>
            <Box
              component="form"
              onSubmit={handleLogin}
              noValidate
              sx={{ mt: 1 }}
            >
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
                sx={{ border: "1px solid black" }}
              />
              <Button
                className={classes.button}
                type="submit"
                fullWidth
                variant="contained"
              >
                Login
              </Button>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <Button onClick={() => navigate(`/signup`)} className={classes.button1}> 
                &nbsp; Sign Up &nbsp;
              </Button>


              {/* <NavLink to="/signup" className={classes.textdecoration}>
                {" "}
                <Button className={classes.button1}>
                  &nbsp; Sign Up &nbsp;
                </Button>
              </NavLink> */}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Button className={classes.button2} onClick={passwordReset}>
                &nbsp; Forgot Password &nbsp;
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </Paper>
  );
}

export default Signin;
