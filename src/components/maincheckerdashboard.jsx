import React from "react";
import App from "../components/OperationsDashboard";
import axios from "axios";
import "../styles/dash.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Set default axios base URL
axios.defaults.baseURL = `${API_BASE_URL}:7090/fes/api/`;

export default function Maincheckerdashboard() {
  return (
    <div>
      <App />
    </div>
  );
}
