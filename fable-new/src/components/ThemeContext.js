import React, { createContext, useReducer } from "react";
export const ThemeContext = createContext();
const initialState = { darkMode: false };

const reducer = (state, action) => {
  const { type } = action;
  switch (type) {
    case "LIGHT_MODE":
      return { darkMode: false };
    case "DARK_MODE":
      return { darkMode: true };
    default:
      return state;
  }
};

export function ThemeProvider(props) {
  const [theme, themeDispatch] = useReducer(reducer, initialState);
  return <ThemeContext.Provider value={{ theme, themeDispatch }}>{props.children}</ThemeContext.Provider>;
}
