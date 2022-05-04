import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import SignOutButton from "./SignOut";
import "../App.css";
import { AppBar, Toolbar, Typography } from "@mui/material";

const Navigation = () => {
  const { currentUser } = useContext(AuthContext);
  return <div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
};

const NavigationAuth = () => {
  return (
    <nav class="navigation">
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <code>F A B L E</code>
      <SignOutButton />
    </nav>
  );
  // return (
  //   <div>
  //     <AppBar sx={{ backgroundColor: "black" }}>
  //       <Toolbar>
  //         <Typography variant="h4" component="h1">
  //           <code>F A B L E</code>
  //         </Typography>
  //       </Toolbar>
  //     </AppBar>
  //   </div>
  // );
};

const NavigationNonAuth = () => {
  return (
    <nav class="navigation">
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <code>F A B L E</code>
    </nav>
  );
};

export default Navigation;
