import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { makeStyles, Button, Logout, ListItemIcon, Image } from "@material-ui/core";
import { doSignOut } from "../firebase/FirebaseFunctions";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import SearchBox from "./SearchBox";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

const useStyles = makeStyles({
  card: {
    backgroundColor: "blanchedalmond",
    color: "black",
  },
  button: {
    backgroundColor: "blanchedalmond",
    color: "black",
    border: "4px solid",
  },

  title1: {
    textDecoration: "none",
    color: "black",
    "&:hover": {
      textDecoration: "none",
      color: "black",
    },
  },

  button: {
    backgroundColor: "black",
    color: "blanchedalmond",
    marginLeft: "10px",
    marginRight: "10px",
    width: "100rm",
    paddingLeft: "10px",
    paddingRight: "10px",
    borderRadius: "4px",
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
  menuitem: {
    width: "100%",
    paddingLeft: "20%",
    paddingTop: "10%",
    paddingBottom: "10%",
    paddingRight: "60px",
    fontSize: "25px",
    marginLeft: "0px",
    marginRight: "0px",
    textDecoration: "none",

    "&:hover": {
      textDecoration: "none",
      color: "black",
    },
  },
  button1: {
    backgroundColor: "black",
    color: "blanchedalmond",
    width: "100rm",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingDown: 7,
    borderRadius: "4px",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
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
});

// const StyledMenu = styled((props) => (
//   <Menu
//     elevation={0}
//     anchorOrigin={{
//       vertical: "bottom",
//       horizontal: "right",
//     }}
//     transformOrigin={{
//       vertical: "top",
//       horizontal: "right",
//     }}
//     {...props}
//   />
// ))(({ theme }) => ({
//   "& .MuiPaper-root": {
//     elevation: 20,
//     borderRadius: 8,
//     marginTop: theme.spacing(1),
//     minWidth: 350,
//     color: "black",
//     fontSize:"30px",
//     boxShadow:
//       "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
//     "& .MuiMenu-list": {
//       padding: "20px ",
//     },
//     "& .MuiMenuItem-root": {
//       "& .MuiSvgIcon-root": {
//         fontSize: 18,
//         color: theme.palette.text.secondary,
//         marginRight: theme.spacing(1.5),
//       },
//       "&:active": {
//         backgroundColor: "blanchedalmond"
//       },
//     },
//   },
// }));

export default function NavBar() {
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();
  const { currentUser } = React.useContext(AuthContext);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navigateTo = (page) => {
    return (
      <div>
        <Navigate to={`/users/${currentUser.uid}/`} />
      </div>
    );
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={auth} onChange={handleChange} aria-label="login switch" />}
          label={auth ? "Logout" : "Login"}
        />
      </FormGroup>

      <AppBar position="absolute" className={classes.card}>
        <Toolbar>
          <Link to="/home" className={classes.title1}>
            {" "}
            <Typography variant="h3" component="div" sx={{ flexGrow: 0, textDecoration: "none" }}>
              FABLE
            </Typography>{" "}
          </Link>
          <SearchBox />
          {auth && (
            <div>
              <PopupState variant="popover" popupId="demo-popup-menu">
                {(popupState) => (
                  <React.Fragment>
                    <Button variant="contained" {...bindTrigger(popupState)}>
                      Account
                    </Button>
                    <Menu {...bindMenu(popupState)}>
                      <MenuItem
                        component={Link}
                        className={classes.menuitem}
                        onClick={() => {
                          popupState.close();
                          handleClick();
                        }}
                        to={`/stories/create_story`}
                      >
                        + write
                      </MenuItem>
                      <br />
                      <MenuItem
                        onClick={() => {
                          popupState.close();
                          handleClick();
                        }}
                        className={classes.menuitem}
                        component={Link}
                        to={`/users/${currentUser.uid}`}
                      >
                        My Stories
                      </MenuItem>
                      <br />

                      <MenuItem
                        onClick={() => {
                          popupState.close();
                          handleClick();
                        }}
                        className={classes.menuitem}
                        component={Link}
                        to={`/libraries/me`}
                      >
                        Library
                      </MenuItem>
                      <br />
                      <MenuItem onClick={doSignOut} className={classes.menuitem}>
                        Logout
                      </MenuItem>
                      <br />
                    </Menu>
                  </React.Fragment>
                )}
              </PopupState>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
