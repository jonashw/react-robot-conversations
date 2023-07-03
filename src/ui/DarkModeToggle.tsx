import "./DarkModeToggle.css";
import { useLocalStorage } from "../useLocalStorage";
import React from "react";
export default ({}) => {
  const [darkMode, setDarkMode] = useLocalStorage(
    "darkMode",
    (b) => b.toString(),
    (str) => str === "true",
    false
  );
  React.useLayoutEffect(() => {
    let htmlElement = window.document.querySelector("html");
    if (!htmlElement) {
      return;
    }
    let [k, v] = ["data-bs-theme", "dark"];
    if (darkMode) {
      htmlElement.setAttribute(k, v);
    } else {
      htmlElement.removeAttribute(k);
    }
  }, [darkMode]);
  return (
    <div onClick={() => setDarkMode(!darkMode)}>
      <img
        style={{ height: "1.66em", filter: `invert(${darkMode ? 1 : 0})` }}
        src={"/icons/" + (darkMode ? "dark-mode" : "light-mode") + ".svg"}
      />
    </div>
  );
};
