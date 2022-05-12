import { FormControlLabel, Grid, OutlinedInput, Paper, Select, Switch, Typography } from "@material-ui/core";
import { Button, MenuItem, TextField, FormControl, Alert, Input } from "@mui/material";
import { makeStyles } from "@material-ui/styles";
import React, { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../firebase/Auth";
import { toast } from "react-toastify";
import axios from "axios";

const useStyles = makeStyles({
  card1: {
    width: "30%",
    paddingLeft: "300px",
  },
  button: {
    backgroundColor: "blanchedalmond",
    color: "black",
    border: "4px solid",
  },
  genre: {
    color: "grey",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },
  story: {
    color: "grey",
    justifyContent: "center",
    fontSize: "25px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  button1: {
    backgroundColor: "black",
    color: "blanchedalmond",
    width: "10%",
    marginLeft: "auto",
    marginRight: "auto",
    "&:hover": {
      backgroundColor: "blanchedalmond",
      color: "black",
    },
  },

  button2: {
    backgroundColor: "blanchedalmond",
    color: "black",
    width: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    "&:hover": {
      backgroundColor: "black",
      color: "blanchedalmond",
    },
  },

  button3: {
    backgroundColor: "blanchedalmond",
    color: "black",
    marginLeft: "auto",
    marginRight: "auto",
    "&:hover": {
      backgroundColor: "black",
      color: "blanchedalmond",
    },
  },

  headertext: {
    backgroundColor: "black",
    color: "blanchedalmond",
    width: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    paddingRight: "30px",
    paddingLeft: "30px",
    paddingTop: "10px",
    paddingBottom: "10px",
    borderRadius: "10px",
    fontSize: "40px",
    "&:hover": {
      backgroundColor: "blanchedalmond",
      color: "black",
    },
  },
});

const CreateLibrary = () => {
  const [libraryName, setLibraryName] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [creationSuccess, setCreationSuccess] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const classes = useStyles();

  const createLibrary = async () => {
    try {
      const { data } = await axios.post(
        `/api/libraries/`,
        {
          userId: currentUser.uid,
          libraryName: libraryName,
          private: isPrivate,
        },
        { headers: { authtoken: await currentUser.getIdToken() } }
      );
      console.log(data);
      if (data.success) {
        setLibraryName("");
        setIsPrivate(true);
        setCreationSuccess(true);
      }
    } catch (e) {
      console.log(e);
      toast.dark(e.response.data.error);
    }
  };

  return (
    <div>
      {creationSuccess && <Alert severity="success">Library Creation Successful!</Alert>}
      <Grid container justifyContent="center" alignItems="center">
        <Typography variant="h3" component={"h1"} className={classes.headertext}>
          Create your own library here!
        </Typography>
        <br />
        <br />
        <br />
        <FormControl variant="standard" sx={{ m: 2, minWidth: "98.5%" }}>
          <Typography className={classes.story}>Library Name *</Typography>
          <br />
          <Input
            sx={{
              width: "30%",
              marginLeft: "auto",
              marginRight: "auto",
              paddingTop: "35px",
              border: "4px black",
            }}
            id="libraryName"
            label="Enter a name for your library"
            variant="filled"
            value={libraryName}
            required
            onChange={(e) => {
              setLibraryName(e.target.value);
            }}
          />

          <br />
          <br />

          <Typography className={classes.story}>
            Want everyone to view your library? Make it public *
            <Switch
              checked={isPrivate}
              onChange={() => {
                setIsPrivate(!isPrivate);
              }}
              label={isPrivate ? "Public" : "Private"}
            />
          </Typography>
          <br />
          <br />
          <Button variant="contained" onClick={createLibrary} className={classes.button1}>
            Create Library
          </Button>
        </FormControl>
      </Grid>
    </div>
  );
};

export default CreateLibrary;
