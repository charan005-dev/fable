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
import { makeStyles } from "@material-ui/core";
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
});

export default function NavBar() {
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();
  const { currentUser } = React.useContext(AuthContext);

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

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
          control={<Switch checked={auth} onChange={handleChange} aria-label="login switch" />}
          label={auth ? "Logout" : "Login"}
        />
      </FormGroup>
      <AppBar position="absolute" className={classes.card}>
        <Toolbar>
          <Typography variant="h3" component="div" sx={{ flexGrow: 0 }}>
            Fable
          </Typography>
          <SearchBox />
          {auth && (
            <div>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px", paddingLeft: "300px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem component={Link} className={classes.menuItem} to={`/users/${currentUser.uid}/`}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={doSignOut}>Logout</MenuItem>
                </Menu>
              </Box>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
