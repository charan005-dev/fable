import { FormGroup, TextField, Button, Typography, FormHelperText, FormControl, Tooltip } from "@material-ui/core";
import axios from "axios";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../firebase/Auth";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Alert, ButtonGroup, InputLabel } from "@mui/material";
import Input from "@mui/material/Input";
import { makeStyles } from "@material-ui/core";
import { toast } from "react-toastify";
import { Paper } from "@mui/material";
import { useEffect } from "react";

const useStyles = makeStyles({
  card1: {
    width: "30%",
    paddingLeft: "300px",
  },
  headertext: {
    color: "black",
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
  buttonupdate: {
    backgroundColor: "black",
    color: "white",
    width: "auto",
    marginLeft: "26.5%",
    marginRight: "auto",
    "&:hover": {
      backgroundColor: "black",
      color: "white",
    },
  },
  buttonback: {
    backgroundColor: "#ececec",
    color: "grey",
    width: "auto",
    marginLeft: "1%",
    marginRight: "auto",
    "&:hover": {
      color: "black",
    },
  },

  button3: {
    backgroundColor: "black",
    color: "white",
    width: "12vw",
    marginLeft: "auto",
    marginRight: "auto",
    "&:hover": {
      backgroundColor: "black",
      color: "white",
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
  paper: {
    width: "23.3%",
    marginLeft: "38.5%",
    paddingLeft: "2%",
    paddingRight: "2%",
  },
  textfield: {
    width: "19vw",
    marginLeft: "2.3%",
  },
  title: {
    marginLeft: "2.1%",
    fontSize: "25px",
  },
});

const EditUser = () => {
  const { currentUser } = useContext(AuthContext);
  const { userId } = useParams();
  // const [displayName, setDisplayName] = useState("");
  const [existingName, setExistingName] = useState("");
  const [existingWpm, setExistingWpm] = useState(0);
  const [nameError, setNameError] = useState({ error: false, text: "" });
  // const [wpm, setWpm] = useState(200);
  const [changingState, setChangingState] = useState({
    displayName: "",
    wpm: "",
  });
  const [wpmError, setWpmError] = useState({ error: false, text: "" });
  const [userAvatar, setUserAvatar] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const classes = useStyles();
  const navigate = useNavigate();

  // prefetch data
  useEffect(() => {
    async function prefetch() {
      const { data } = await axios.get(`/api/users/public_profile/${userId}`, {
        headers: {
          authtoken: await currentUser.getIdToken(),
        },
      });
      console.log(data);
      setExistingName(data.profile.displayName);
      setExistingWpm(data.profile.wpm);
      let newState = {
        displayName: data.profile.displayName,
        wpm: data.profile.wpm,
      };
      setChangingState(newState);
    }
    prefetch();
  }, [userId]);

  const handleDispNameChange = async (e) => {
    // make sure the entered value is valid
    let displayName = e.target.value;
    setChangingState({
      ...changingState,
      displayName: e.target.value,
    });
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
    console.log(existingName, displayName);
    if (existingName === displayName) {
      setNameError({
        error: false,
        text: "",
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
    // setDisplayName(e.target.value);
    setChangingState({
      ...changingState,
      displayName: e.target.value,
    });
  };

  const handleFileUpload = (e) => {
    setUserAvatar(e.target.files[0]);
  };

  const handleWpmChange = (e) => {
    let value = parseInt(e.target.value);
    console.log(value);
    setChangingState({
      ...changingState,
      wpm: value,
    });
    // if (value === 0) {
    //   setWpmError({ error: false, text: "Start entering your input" });
    //   return;
    // }
    if (isNaN(value)) {
      setWpmError({ error: true, text: "Invalid input value for wpm." });
      return;
    }
    if (value < 30) {
      setWpmError({
        error: true,
        text: "Surely, you don't read that slow! Enter a value between 30 and 500.",
      });
      return;
    }
    if (value > 500) {
      setWpmError({
        error: true,
        text: "Surely, you don't read that fast! Enter a value between 30 and 500.",
      });
      return;
    }
    setWpmError({ error: false, text: "Good Input!" });
    // setWpm(value);
    setChangingState({
      ...changingState,
      wpm: value,
    });
  };

  const performEditUser = async () => {
    if (nameError.error || wpmError.error) {
      toast.dark("Your inputs are invalid. Please check them before performing the action.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("userId", currentUser.uid);
      formData.append("displayName", changingState.displayName);
      formData.append("wpm", changingState.wpm);
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
    } catch (e) {
      console.log(e);
      if (e.response && e.response.data && e.response.data.error) {
        toast.error(e.response.data.error, {
          theme: "dark",
        });
        return;
      } else {
        toast.error("Cannot perform the update. Please check your inputs.", {
          theme: "dark",
        });
        return;
      }
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
      <br />
      <br />
      <br />
      <Paper className={classes.paper} elevation={24}>
        <br />
        <br />
        <FormGroup>
          <Typography variant="h3" component={"h4"} className={classes.headertext1}>
            Edit Your Details Here!
          </Typography>
          <br /> <br /> <br />
          <Typography variant="h3" component={"h4"} className={classes.headertext}>
            Display Name
          </Typography>
          <br />
          <TextField
            fullWidth
            value={changingState.displayName}
            className={classes.textfield}
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
            title="Number of words that you usually read per minute. Enter a value within 30 and 500 (the human average is 200)."
          >
            <Typography variant="h3" component={"h4"} className={classes.headertext}>
              Words Per Minute ⓘ
            </Typography>
          </Tooltip>
          <br />
          <TextField
            fullWidth
            value={changingState.wpm}
            className={classes.textfield}
            type={"number"}
            error={wpmError.error}
            helperText={wpmError.error ? wpmError.text : ""}
            id="wordsPerMinute"
            variant="outlined"
            InputLabelProps={{ shrink: false }}
            onChange={(e) => handleWpmChange(e)}
          />
          <br />
          <br />
          <Typography variant="h3" component={"h4"} className={classes.headertext}>
            Upload Your Avatar
          </Typography>
          <br />
          <Button variant="contained" component="label" className={classes.button3}>
            <input
              type="file"
              accept="image/jpeg, image/png, .jpeg, .jpg, .png"
              onChange={(e) => handleFileUpload(e)}
            />
          </Button>
          <br />
          <br />
          <br />
          <span>
            <Button color="primary" onClick={performEditUser} className={classes.buttonupdate}>
              Update User
            </Button>
            <Button color="primary" onClick={() => window.history.back()} className={classes.buttonback}>
              Back
            </Button>
          </span>
          <br />
        </FormGroup>
      </Paper>
    </div>
  );
};

export default EditUser;
