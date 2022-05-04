import { ThemeContext, ThemeProvider } from "./ThemeContext";
import { createTheme } from "@mui/material/styles";
import React, { useContext } from "react";
import "../App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Account from "./Account";
import Home from "./Home/HomeImage";
import Landing from "./Landing";
import Navigation from "./Navigation";
import SignUp from "./SignUp";
import { AuthProvider } from "../firebase/Auth";
import PrivateRoute from "./PrivateRoute";
import SignOutButton from "./SignOut";
import Splash from "./Splash";
import CreateStory from "./stories/CreateStory";
import { Button } from "@mui/material";

function App() {
  const context = useContext(ThemeContext);
  const darkMode = context.theme.darkMode;
  return (
    <AuthProvider>
      <Router>
        {/* <div className={`bg ${darkMode ? "dark" : "light"}`}>
          <Theme /> */}
        <div className="container">
          <header className="App-header">
            <Navigation />
          </header>
        </div>
        <div className="App-body">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/splash" element={<Splash />} />
            <Route path="/home" element={<PrivateRoute element={<Home />} />} />
            <Route path="/account" element={<PrivateRoute element={<Account />} />} />
            <Route path="/stories/create_story" element={<PrivateRoute element={<CreateStory />} />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
