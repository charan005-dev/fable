import React, { useContext } from "react";
import Theme from "./Theme";
import "../App.css";
import { ThemeContext } from "./ThemeContext";

function Home() {
  const context = useContext(ThemeContext);
  const darkMode = context.theme.darkMode;
  return (
    <div className="Home">
      <nav className="navigation">
        <h1></h1>
      </nav>
      <div className={`bg ${darkMode ? "bg-dark" : "bg-light"}`}>
        <h1 className={`heading ${darkMode ? "heading-dark" : "heading-light"}`}>
          {darkMode ? "Dark Mode" : "Light Mode"}
        </h1>
        <p className={`para ${darkMode ? "para-dark" : "para-light"}`}>This is a test for switching theme!!</p>
        <Theme />
      </div>
    </div>
  );
}

export default Home;
