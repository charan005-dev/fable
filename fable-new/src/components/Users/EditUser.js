import { FormGroup, TextField, Button } from "@material-ui/core";
import axios from "axios";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../firebase/Auth";
import { Navigate, useParams } from "react-router-dom";
import { Alert } from "@mui/material";

const EditUser = () => {
  const { currentUser } = useContext(AuthContext);
  const { userId } = useParams();
  const [displayName, setDisplayName] = useState("");
  const [userAvatar, setUserAvatar] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

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
        <TextField variant="filled" id="displayName" label="Display Name" onChange={(e) => handleDispNameChange(e)} />
        <br />
        <Button variant="contained" component="label">
          Upload your avatar!
          <input
            type="file"
            accept="image/jpeg, image/png, .jpeg, .jpg, .png"
            onChange={(e) => handleFileUpload(e)}
            hidden
          />
        </Button>
        <br />
        <Button variant="contained" color="primary" onClick={performEditUser}>
          Update User
        </Button>
      </FormGroup>
    </div>
  );
};

export default EditUser;
