import { Alert, AlertTitle } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";

const useStyles = makeStyles({
  notificationContainer: {
    marginLeft: 1450,
    position: "absolute",
    zIndex: 2,
    maxWidth: 320,
  },
});

const NotificationContainer = ({ severity, message, title }) => {
  const classes = useStyles();
  return (
    <div>
      <br />
      <br />
      <br />
      <div className={classes.notificationContainer}>
        <Alert color={severity} severity={severity}>
          <AlertTitle>{title}</AlertTitle>
          {message}
        </Alert>
      </div>
    </div>
  );
};

export default NotificationContainer;
