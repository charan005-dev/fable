import React, { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { makeStyles } from "@material-ui/styles";
import axios from "axios";
import {
  Card,
  Dialog,
  DialogTitle,
  List,
  CardContent,
  CardActionArea,
  CardHeader,
  CardMedia,
  Divider,
  Tooltip,
  Button,
} from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../firebase/Auth";
import { ClassNames } from "@emotion/react";

const useStyles = makeStyles({
  card: {
    background: "darkgrey",
    color: "black",
    marginTop: "4%",
    textDecoration: "none",
    paddingBottom: "5%",
    paddingTop: "5%",
    paddingLeft: "2%",
    paddingRight: "15%",
    height: "auto",
    width: "60%",
    marginLeft: "20%",
    marginRight: "20%",
    "&:hover": {
      backgroundColor: "black",
      color: "white",
      textDecoration: "none",
    },
  },
  title: {
    marginLeft: "10%",
  },
  dialog: {
    marginLeft: "33%",
  },
  buttonupdate: {
    background: "black",
    color: "white",
    width: "auto",

    textDecoration: "none",
    "&:hover": {
      backgroundColor: "black",
      color: "white",
      textDecoration: "none",
    },
  },
  link: {
    textDecoration: "none",
    "&:hover": {
      backgroundColor: "black",
      color: "white",
      textDecoration: "none",
    },
  },

  searchbar: {
    textDecoration: "none",
    color: "white",
    "&:hover": {
      backgroundColor: "white",
      color: "black",
      textDecoration: "none",
      borderRadius: "6px",
    },
  },
});

const Search = styled("div")(({ theme }) => ({
  position: "relative",

  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: "0",
  maxWidth: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing("40vw"),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: "100%",
  marginRight: "80%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    paddingRight: "10px",
    [theme.breakpoints.up("sm")]: {
      width: "80%",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const isValidSearchTerm = (q) => {
  if (!q || typeof q !== "string" || q.length === 0 || q.trim().length === 0)
    return false;
  return true;
};

export default function SearchBox() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [open, setOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const classes = useStyles();

  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
  };

  const performSearch = async () => {
    if (isValidSearchTerm(searchTerm)) {
      console.log(await currentUser.getIdToken());
      const { data } = await axios.post(
        `/api/stories/search?q=${searchTerm}`,
        {},
        {
          headers: { authtoken: await currentUser.getIdToken() },
        }
      );
      console.log(data);
      setSearchResults(data.results);
      setOpen(true);
    } else {
      setSearchTerm("");
    }
  };

  const handleDialogClose = () => {
    setOpen(false);
    setSearchTerm("");
  };

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Search sx={{ marginX: "2%" }}>
      
        &nbsp; <SearchIcon /> &nbsp; 
    
      <Tooltip
        title="To search, click outside after typing. Enter at least 3 characters for relevant results."
        placement="bottom-start"
      >
        <StyledInputBase
          placeholder="Click here to search…"
          inputProps={{ "aria-label": "search" }}
          onChange={(e) => handleSearchInput(e)}
          onBlur={performSearch}
          value={searchTerm}
          className={classes.searchbar}
        />
      </Tooltip>
      {/* <SearchResults /> */}
      <Dialog onClose={handleDialogClose} open={open} fullWidth>
        <DialogTitle className={classes.dialog}>Search Results</DialogTitle>
        {searchResults && searchResults.length === 0 && (
          <div>
            <Typography sx={{ p: 2 }} variant="body1">
              Sorry, no search results available. Please try again.
            </Typography>
            <br />
          </div>
        )}
        {searchResults && searchResults.length > 0 && (
          <List sx={{ pt: 0 }}>
            {searchResults &&
              searchResults.map((res) => {
                return (
                  <div>
                    <NavLink to={`/stories/${res.id}`} className={classes.link}>
                      {" "}
                      <Card className={classes.card} onClick={handleLinkClick}>
                        {" "}
                        {res.title.length > 35
                          ? res.title.substring(0, 23) + "..."
                          : res.title}{" "}
                      </Card>
                    </NavLink>
                  </div>
                );
              })}
            <br />
          </List>
        )}
      </Dialog>
    </Search>
  );
}
