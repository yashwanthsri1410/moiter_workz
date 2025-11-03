import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { AlertProvider, useAlert } from "./components/AlertProvider";
import ThemeSwitcher from "./components/themeSwitcher";
// import "leaflet/dist/leaflet.css";
function AppWrapper() {
  return (
    <AlertProvider>
      <App />
    </AlertProvider>
  );
}

function App() {
  const [role, setRole] = useState("");
  const { showAlert } = useAlert();
  // Override default alert
  useEffect(() => {
    window.alert = (message) => {
      showAlert(message, "info"); // default info type
    };
  }, [showAlert]);
  window.history.pushState(null, "", window.location.href);
  window.addEventListener("popstate", function () {
    window.history.pushState(null, "", window.location.href);
  });
  return (
    <>
      <Router basename={"/MW-Prepaid"}>
        <AppRoutes setRole={setRole} />
      </Router>
      <ThemeSwitcher />
    </>
  );
}

export default AppWrapper;
