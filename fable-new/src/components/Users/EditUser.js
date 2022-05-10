import { FormGroup, TextField, Button, Typography } from "@material-ui/core";
import axios from "axios";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../firebase/Auth";
import { Navigate, useParams } from "react-router-dom";
import { Alert } from "@mui/material";
import Input from "@mui/material/Input";
import { makeStyles } from "@material-ui/core";

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
  const [userAvatar, setUserAvatar] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const classes = useStyles();

  const handleDispNameChange = (e) => {
    setDisplayName(e.target.value);
  };

  const handleFileUpload = (e) => {
    setUserAvatar(e.target.files[0]);
  };

  const performEditUser = async () => {
    const formData = new FormData();
    formData.append("userId", currentUser.uid);
    formData.append("displayName", displayName);
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
    return (
      <div>
        <Alert severity="error">{"You don't have access to perform this action."}</Alert>
      </div>
    );
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
        <Input
          sx={{
            width: "20%",
            marginLeft: "auto",
            marginRight: "auto",
            paddingTop: "35px",
            border: "4px black",
          }}
          id="displayName"
          label="Display Name"
          variant="filled"
          required
          onChange={(e) => handleDispNameChange(e)}
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
        <Button variant="contained" color="primary" onClick={performEditUser} className={classes.button2}>
          Update User
        </Button>
        <br />
        <img src="undraw2.png" className={classes.media}></img>
      </FormGroup>
    </div>
  );
};

export default EditUser;
