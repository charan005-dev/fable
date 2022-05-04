import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import SignOutButton from "./SignOut";
import "../App.css";
import NavBar from "./NavBar";
import NavBarloggedout from "./NavBarloggedout";

const Navigation = () => {
  const { currentUser } = useContext(AuthContext);
  return <div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
};

const NavigationAuth = () => {
  return (
    <div>
      <NavBar />
    </div>
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
    <div>
      <NavBarloggedout />
    </div>
  );
};

export default Navigation;
