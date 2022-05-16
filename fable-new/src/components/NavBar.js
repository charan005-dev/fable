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
import {
  makeStyles,
  Button,
  Logout,
  ListItemIcon,
  Image,
} from "@material-ui/core";
import { doSignOut } from "../firebase/FirebaseFunctions";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import SearchBox from "./SearchBox";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import LogoutIcon from "@mui/icons-material/Logout";
import CreateIcon from "@mui/icons-material/Create";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FilterListIcon from "@mui/icons-material/FilterList";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import AutoStoriesSharpIcon from "@mui/icons-material/AutoStoriesSharp";
import { Avatar } from "@material-ui/core";

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

const useStyles = makeStyles({
  card: {
    backgroundColor: "black",
    color: "white",
  },
  button: {
    backgroundColor: "blanchedalmond",
    color: "black",
    border: "4px solid",
  },

  title1: {
    textDecoration: "none",
    color: "white",
    "&:hover": {
      textDecoration: "none",
      color: "white",
    },
  },

  button: {
    backgroundColor: "black",
    color: "blanchedalmond",
    marginLeft: "10px",
    marginRight: "10px",
    width: "100%",
    paddingLeft: "10px",
    paddingRight: "10px",
    borderRadius: "4px",
    textDecoration: "none",
    "&:hover": {
      backgroundColor: "blanchedalmond",
      color: "black",
    },
  },
    textbox: {
      border: "5px black",
      "&:hover": {
        backgroundColor: "#5dc2a6",
        border: "5px black",
      },
  },
  menuitem: {
    width: "100%",
    paddingLeft: "20%",
    paddingTop: "10%",
    paddingBottom: "10%",
    paddingRight: "30px",
    fontSize: "20px",
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
    width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    borderRadius: "4px",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
      backgroundColor: "blanchedalmond",
      color: "black",
    },
  },
    textbox: {
      border: "5px black",
      "&:hover": {
        backgroundColor: "#5dc2a6",
        border: "5px black",
      },
    // accountbutton: {
    //   marginLeft: "-100%",
    // },
  },
  search: {
    marginLeft: "100vw",
  },
});

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
          control={
            <Switch
              checked={auth}
              onChange={handleChange}
              aria-label="login switch"
            />
          }
          label={auth ? "Logout" : "Login"}
        />
      </FormGroup>

      <AppBar position="absolute" className={classes.card}>
        <Toolbar>
          
            
            <Typography
              variant="h3"
              component="div"
              sx={{
                textDecoration: "none",
                color: "white",
                paddingRight: "25vw",
              }}
            > 
            <Link to="/home" className={classes.title1}>
              Fable 
              </Link>
            </Typography>
          
          <SearchBox className={classes.search}></SearchBox>
          {auth && (
            <div>
              <PopupState variant="popover" popupId="demo-popup-menu">
                {(popupState) => (
                  <React.Fragment>
                    <Avatar {...bindTrigger(popupState)} variant="contained"></Avatar>

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
                        Write &nbsp; <CreateIcon />
                      </MenuItem>
                      <br />
                      <MenuItem
                        onClick={() => {
                          popupState.close();
                          handleClick();
                        }}
                        className={classes.menuitem}
                        component={Link}
                        to={`/stories/filter`}
                      >
                        Filter &nbsp; <FilterListIcon />
                      </MenuItem>
                      <br />
                      <MenuItem
                        onClick={() => {
                          popupState.close();
                          handleClick();
                        }}
                        className={classes.menuitem}
                        component={Link}
                        to={`/stories/me`}
                      >
                        My Stories &nbsp; <AutoStoriesSharpIcon />
                      </MenuItem>
                      <br />
                      <MenuItem
                        onClick={() => {
                          popupState.close();
                          handleClick();
                        }}
                        className={classes.menuitem}
                        component={Link}
                        to={`/stories/all`}
                      >
                        All Stories &nbsp; <AutoStoriesSharpIcon />
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
                        Profile &nbsp; <AccountCircleIcon />
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
                        Library &nbsp; <LibraryAddIcon />
                      </MenuItem>
                      <br />
                      <MenuItem
                        onClick={doSignOut}
                        className={classes.menuitem}
                      >
                        Logout &nbsp; <LogoutIcon />
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
