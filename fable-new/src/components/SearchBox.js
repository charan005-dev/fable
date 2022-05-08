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
} from "@mui/material";
import { Link } from "react-router-dom";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
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
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const isValidSearchTerm = (q) => {
  if (!q || typeof q !== "string" || q.length === 0 || q.trim().length === 0) return false;
  return true;
};

export default function SearchBox() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [open, setOpen] = useState(false);

  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
  };

  const performSearch = async () => {
    if (isValidSearchTerm(searchTerm)) {
      const { data } = await axios.post(`/api/stories/search?q=${searchTerm}`);
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
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{ "aria-label": "search" }}
        onChange={(e) => handleSearchInput(e)}
        onBlur={performSearch}
        value={searchTerm}
      />
      {/* <SearchResults /> */}
      <Dialog onClose={handleDialogClose} open={open}>
        <DialogTitle>Search Results</DialogTitle>
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
                  <Card>
                    <CardContent>
                      <CardActionArea>
                        <Link onClick={handleLinkClick} to={`/stories/${res.id}`}>
                          <CardHeader title={res.title}></CardHeader>
                          <br />
                        </Link>
                      </CardActionArea>
                    </CardContent>
                  </Card>
                );
              })}
          </List>
        )}
      </Dialog>
    </Search>
  );
}
