import { ThemeContext } from "./ThemeContext";
import React, { useContext } from "react";
import "../App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Account from "./Account";
import Home from "./Home/HomeImage";
import Navigation from "./Navigation";
import SignUp from "./SignUp";
import { AuthProvider } from "../firebase/Auth";
import PrivateRoute from "./PrivateRoute";
import Splash from "./Splash";
import CreateStory from "./Stories/CreateStory";
import Login from "./Login";

import Story from "./Stories/Story";

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
            <Route path="/" element={<Splash />} />
            <Route path="/home" element={<PrivateRoute />}>
              <Route path="/home" element={<Home />} />
            </Route>
            <Route path="/account" element={<PrivateRoute />}>
              <Route path="/account" element={<Account />} />
            </Route>
            <Route path="/stories/create_story" element={<PrivateRoute />}>
              <Route path="/stories/create_story" element={<CreateStory />} />
            </Route>
            <Route path="/stories/:id" element={<PrivateRoute />}>
              <Route path="/stories/:id" element={<Story />} />
            </Route>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
