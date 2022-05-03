import { ThemeContext } from "./ThemeContext";
import React from 'react';
import '../App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Account from './Account';
import Home from './Home';
import Landing from './Landing';
import Navigation from './Navigation';
import SignIn from './SignIn';
import SignUp from './SignUp';
import {AuthProvider} from '../firebase/Auth';
import PrivateRoute from './PrivateRoute';
import SignOutButton from './SignOut'; 
import Splash from './Splash';

function App() {
  const context = useContext(ThemeContext);
  const darkMode = context.theme.darkMode;
  return (
    <AuthProvider>
      <Router>
        <div className="container">
          <header className="App-header">
            <Navigation />
          </header>
        </div>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/home" element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
          </Route>
          <Route path="/account" element={<PrivateRoute />}>
            <Route path="/account" element={<Account />} />
          </Route>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
