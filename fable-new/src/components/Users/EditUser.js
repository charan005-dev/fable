import { FormGroup, TextField, Button, Typography, FormHelperText, FormControl, Tooltip } from "@material-ui/core";
import axios from "axios";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../firebase/Auth";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Alert, ButtonGroup, InputLabel } from "@mui/material";
import Input from "@mui/material/Input";
import { makeStyles } from "@material-ui/core";
import { toast } from "react-toastify";

const useStyles = makeStyles({
  card1: {
    width: "30%",
    paddingLeft: "300px",
  },
  headertext: {
    color: "grey",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: "20px",
  },
  headertext1: {
    color: "black",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: "30px",
  },
  button2: {
    backgroundColor: "black",
    color: "blanchedalmond",
    width: "auto",
    fontSize: "20px",
    marginLeft: "auto",
    marginRight: "auto",

    "&:hover": {
      backgroundColor: "blanchedalmond",
      color: "black",
    },
  },

  button3: {
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
  media: {
    height: "auto",
    width: "450px",
  },
  media1: {
    height: "auto",
    width: "150px",
  },
});

const EditUser = () => {
  const { currentUser } = useContext(AuthContext);
  const { userId } = useParams();
  const [displayName, setDisplayName] = useState("");
  const [nameError, setNameError] = useState({ error: false, text: "" });
  const [wpm, setWpm] = useState(200);
  const [wpmError, setWpmError] = useState({ error: false, text: "" });
  const [userAvatar, setUserAvatar] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const classes = useStyles();
  const navigate = useNavigate();

  const handleDispNameChange = async (e) => {
    // make sure the entered value is valid
    let displayName = e.target.value;
    // if (!displayName || typeof displayName !== "string" || displayName.length === 0) {
    //   setNameError({
    //     error: false,
    //     text: "",
    //   });
    //   return;
    // }
    if (
      !displayName ||
      typeof displayName !== "string" ||
      displayName.length === 0 ||
      displayName.trim().length === 0 ||
      displayName.length < 6
    ) {
      setNameError({
        error: true,
        text: "Please make sure the username exceeds 6 characters.",
      });
      return;
    }
    let dnameRegex = new RegExp(`^(?![-])[- '0-9A-Za-z]+(?<![-])$`, "g");
    if (!dnameRegex.test(displayName)) {
      setNameError({
        error: true,
        text: "It's really catchy but make sure it contains only alphanumerics and hyphens (can't end with one).",
      });
      return;
    }
    // and then - if valid, constantly poll the backend to check if displayName is available
    try {
      const { data } = await axios.get(`/api/users/check?tentative=${e.target.value}`, {
        headers: {
          authtoken: await currentUser.getIdToken(),
        },
      });
      setNameError({ error: false, text: "Available!" });
    } catch (e) {
      // server throws a 409 when the username already exists in the database
      setNameError({
        error: true,
        text: `🎸You can't always get what you want!🎸 This username is taken.`,
      });
    }
    setDisplayName(e.target.value);
  };

  const handleFileUpload = (e) => {
    setUserAvatar(e.target.files[0]);
  };

  const handleWpmChange = (e) => {
    let value = parseInt(e.target.value);
    console.log(value);
    if (!value) {
      setWpmError({ error: false, text: "Start entering your input" });
      return;
    }
    if (isNaN(value)) {
      setWpmError({ error: true, text: "Invalid input value for wpm." });
      return;
    }
    if (value < 30) {
      setWpmError({ error: true, text: "Surely, you don't read that slow! Enter a value between 30 and 500." });
      return;
    }
    if (value > 500) {
      setWpmError({ error: true, text: "Surely, you don't read that fast! Enter a value between 30 and 500." });
      return;
    }
    setWpmError({ error: false, text: "Good Input!" });
    setWpm(value);
  };

  const performEditUser = async () => {
    if (nameError.error || wpmError.error) {
      toast.dark("Your inputs are invalid. Please check them before performing the action.");
      return;
    }
    const formData = new FormData();
    formData.append("userId", currentUser.uid);
    formData.append("displayName", displayName);
    formData.append("wpm", wpm);
    formData.append("userAvatar", userAvatar);
    const { data } = await axios.put(`/api/users/${currentUser.uid}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        authtoken: await currentUser.getIdToken(),
      },
    });
    if (data.success) {
      setUpdateSuccess(true);
    }
  };

  if (userId !== currentUser.uid) {
    toast.dark("You don't have access to perform this action!");
    setTimeout(() => navigate(`/users/${currentUser.uid}`), 100);
  }

  if (updateSuccess) {
    return (
      <div>
        <Navigate to={`/users/${currentUser.uid}`} />
      </div>
    );
  }

  return (
    <div>
      <br />
      <FormGroup>
        <Typography variant="h3" component={"h4"} className={classes.headertext1}>
          Edit Your Details Here!
        </Typography>
        <br /> <br /> <br /> <br /> <br />
        <Typography variant="h3" component={"h4"} className={classes.headertext}>
          Display Name
        </Typography>
        <TextField
          sx={{
            width: "20%",
            marginLeft: "auto",
            marginRight: "auto",
            paddingTop: "35px",
            border: "4px black",
          }}
          error={nameError.error}
          helperText={nameError.error ? nameError.text : ""}
          id="displayName"
          variant="outlined"
          InputLabelProps={{ shrink: false }}
          required
          onChange={(e) => handleDispNameChange(e)}
        />
        <br />
        <br />
        <Tooltip
          arrow
          placement="right"
          title="Number of words that you usually read per minute. Enter a value within 30 and 500 (the human average is 200). If you leave this empty, we'll assume that you're an average human 😁"
        >
          <Typography variant="h3" component={"h4"} className={classes.headertext}>
            Words Per Minute ⓘ
          </Typography>
        </Tooltip>
        <TextField
          sx={{
            width: "20%",
            marginLeft: "auto",
            marginRight: "auto",
            paddingTop: "35px",
            border: "4px black",
          }}
          type={"number"}
          error={wpmError.error}
          helperText={wpmError.error ? wpmError.text : ""}
          id="wordsPerMinute"
          variant="outlined"
          InputLabelProps={{ shrink: false }}
          required
          onChange={(e) => handleWpmChange(e)}
        />
        <br />
        <br />
        <Typography variant="h3" component={"h4"} className={classes.headertext}>
          Upload Your Avatar
        </Typography>
        <br />
        <Button variant="contained" component="label" className={classes.button3}>
          <input type="file" accept="image/jpeg, image/png, .jpeg, .jpg, .png" onChange={(e) => handleFileUpload(e)} />
        </Button>
        <br />
        <br />
        <br />
        <ButtonGroup>
          <Button variant="contained" color="primary" onClick={performEditUser} className={classes.button2}>
            Update User
          </Button>
          <Button variant="contained" color="primary" onClick={() => window.history.back()} className={classes.button2}>
            Back
          </Button>
        </ButtonGroup>
        <br />
        <img src="/undraw2.png" className={classes.media} alt="edit text"></img>
      </FormGroup>
    </div>
  );
};

export default EditUser;
