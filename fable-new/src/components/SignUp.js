import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { doCreateUserWithEmailAndPassword } from "../firebase/FirebaseFunctions";
import { AuthContext } from "../firebase/Auth";
import { NavLink } from "react-router-dom";
import SocialSignIn from "./SocialSignIn";
function SignUp() {
  const { currentUser } = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState("");
  const handleSignUp = async (e) => {
    e.preventDefault();
    const { displayName, email, passwordOne, passwordTwo } = e.target.elements;
    if (passwordOne.value !== passwordTwo.value) {
      setPwMatch("Passwords do not match");
      return false;
    }

    try {
      await doCreateUserWithEmailAndPassword(
        email.value,
        passwordOne.value,
        displayName
      );
    } catch (error) {
      alert(error);
    }
  };

  if (currentUser) {
    return <Navigate to="/home" />;
  }

  return (
    <div class="centertest">
      <h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sign up</h1>
      {pwMatch && <h4 className="error">{pwMatch}</h4>}
      <form onSubmit={handleSignUp}>
        <div className="form-group">
          <label>
            <input
              className="input"
              required
              name="displayName"
              type="text"
              placeholder="Name"
            />
          </label>
        </div>
        <br />
        <div className="form-group">
          <label>
            <input
              className="input"
              required
              name="email"
              type="email"
              placeholder="Email"
            />
          </label>
        </div>
        <br />
        <div className="form-group">
          <label>
            <input
              className="input"
              id="passwordOne"
              name="passwordOne"
              type="password"
              placeholder="Password"
              autoComplete="off"
              required
            />
          </label>
        </div>
        <br />
        <div className="form-group">
          <label>
            <input
              className="input"
              name="passwordTwo"
              type="password"
              placeholder="Confirm Password"
              autoComplete="off"
              required
            />
          </label>
        </div>
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button
          id="submitButton"
          name="submitButton"
          type="submit"
          class="button"
        >
          Sign Up
        </button>
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button class="button">
          <NavLink to="/signin">
            <span class="linktext">Sign-In</span>
          </NavLink>
        </button>
      </form>
    </div>
  );
}

export default SignUp;
