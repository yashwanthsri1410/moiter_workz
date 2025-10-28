import React, { useEffect, useState } from "react";
import { themeColors } from "../constants/themeColor";

const useTheme = () => {
  const [theme, setTheme] = useState("base");

  const toggleTheme = () => {
    const newTheme = theme === "base" ? "red" : "base";
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const applyTheme = (themeName) => {
    const themeVariables = themeColors[themeName];
    Object.keys(themeVariables).forEach((key) => {
      document.documentElement.style.setProperty(key, themeVariables[key]);
    });
  };

  useEffect(() => {
    applyTheme(theme);
  }, []);
  return { toggleTheme };
};

export default useTheme;
