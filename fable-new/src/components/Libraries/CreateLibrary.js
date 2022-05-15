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
  headertext1: {
    color: "black",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: "30px",
    backgroundColor: "#ecece",
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
  paper: {
    width: "25.3%",
    marginLeft: "38.5%",
    paddingLeft: "2%",
    paddingRight: "2%",
  },

  headertext: {
    color: "black",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: "20px",
  },
  buttonupdate: {
    backgroundColor: "black",
    color: "white",
    width: "auto",
    marginLeft: "28.5%",
    marginRight: "auto",
    paddingRight: "5%",
    paddingLeft: "5%",
    paddingTop: "3%",
    paddingBottom: "3%",
    borderRadius: "6px",
    "&:hover": {
      backgroundColor: "black",
      color: "white",
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
      if (!libraryName || typeof libraryName !== "string" || libraryName.trim().length === 0) {
        toast.error("Please make sure that you enter a valid library name(only characters)", {
          theme: "dark",
          position: "top-center",
        });
        return;
      }
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

        toast.success("A new library has been created", {
          theme: "dark",
          position: "top-center",
        });
      }
    } catch (e) {
      console.log(e);
      toast.dark(e.response.data.error);
    }
  };

  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      <Paper className={classes.paper} elevation={24}>
        {creationSuccess && <Alert severity="success">Library Creation Successful!</Alert>}
        <Grid container justifyContent="center" alignItems="center">
          <Typography variant="h3" component={"h4"} className={classes.headertext1}>
            Create your own library here!
          </Typography>
          <br />
          <br />
          <br />
          <br />
          <FormControl variant="standard" sx={{ m: 2, minWidth: "98.5%" }}>
            <br />
            <Typography variant="h3" className={classes.headertext}>
              Library Name *
            </Typography>
            <br />
            <TextField
              fullWidth
              className={classes.textfield}
              id="displayName"
              variant="outlined"
              value={libraryName}
              onChange={(e) => {
                setLibraryName(e.target.value);
              }}
              color="primary"
              label={isPrivate ? "Public" : "Private"}
            />

            <br />
            <br />

            <Typography className={classes.headertext} variant={"h3"}>
              Want everyone to view your library? Make it public *
              <Switch
                checked={!isPrivate}
                onChange={() => {
                  setIsPrivate(!isPrivate);
                }}
                color="primary"
                label={isPrivate ? "Public" : "Private"}
              />
            </Typography>
            <br />
            <br />
            <Button variant="contained" onClick={createLibrary} className={classes.buttonupdate}>
              Create Library
            </Button>
            <br />
          </FormControl>
        </Grid>
      </Paper>
    </div>
  );
};

export default CreateLibrary;
