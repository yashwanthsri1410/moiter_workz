import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from './AppRoutes';
import { AlertProvider, useAlert } from "./components/AlertProvider";

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

  return (
    <Router>
      <AppRoutes setRole={setRole} />
    </Router>
  );
}

export default AppWrapper;
