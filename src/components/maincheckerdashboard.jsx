import React from "react";
import App from "../components/OperationsDashboard";
import axios from "axios";
import "../styles/dash.css";

// Set default axios base URL
axios.defaults.baseURL = "http://192.168.20.254/fes/api/";

export default function Maincheckerdashboard() {
  return (
    <div>
      <App />
    </div>
  );
}
