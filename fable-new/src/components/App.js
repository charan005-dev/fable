import React from "react";
import "../App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Account from "./Account";
import Home from "./Home";
import Landing from "./Landing";
import Navigation from "./Navigation";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { AuthProvider } from "../firebase/Auth";
import PrivateRoute from "./PrivateRoute";
import SignOutButton from "./SignOut";
import Splash from "./Splash";
import Footer from "./Footer";
import Carousel from "./Corausel/Corausel";
//import {Carousel} from "react-carousel-minimal";
function App() {
  return (
    <AuthProvider>
      <div className="page-container">
        <div className="content-wrap"></div>

        <div>
          <Router>
            <div className="container">
              <header className="App-header">{/* <Navigation />  */}</header>
              {/* <footer className="Page-container">
            <Footer />
          </footer> */}
            </div>
            <Routes>
              <Route path="/" element={<Splash />} />
              <Route path="/home" element={<PrivateRoute />}>
                <Route path="/home" element={<Home />} />
              </Route>
              <Route  path="/carousel" element={<Carousel />} />
              <Route path="/account" element={<PrivateRoute />}>
                <Route path="/account" element={<Account />} />
              </Route>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
            </Routes>
          </Router>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
