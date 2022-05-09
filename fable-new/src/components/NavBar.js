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
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import SearchBox from "./SearchBox";

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

  menuItem: {
    textDecoration: "none",

    "&:hover": {
      textDecoration: "none",
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
    <Box sx={{ flexGrow: 1 }}>
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
  
          <Typography variant="h3" component="div" sx={{ flexGrow: 0 }}>
            FABLE
          </Typography>
          <SearchBox />
          {auth && (
            <div>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/2.jpg"
                    />
                  </IconButton>
                </Tooltip>
                <Button
                  component={Link}
                  to={`/users/${currentUser.uid}/`}
                  className={classes.button}
                >
                  Profile
                </Button>
                <Button onClick={doSignOut} className={classes.button}>
                  Logout
                </Button>{" "}
              </Box>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
