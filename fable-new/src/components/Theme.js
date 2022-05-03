import React, { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

const AddTheme = () => {
  const context = useContext(ThemeContext);
  const darkMode = context.theme.darkMode;

  const Theme = () => {
    if (darkMode) {
      console.log("theme", darkMode);
      context.themeDispatch({
        type: "LIGHT_MODE",
      });
    } else {
      console.log("theme", darkMode);
      context.themeDispatch({ type: "DARK_MODE" });
    }
  };

  return (
    <div>
      <button className={`button ${darkMode ? "darkTheme" : "lightTheme"}`} onClick={Theme}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
};

export default AddTheme;
