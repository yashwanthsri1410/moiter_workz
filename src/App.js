import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Usercreation from "./pages/Usercreation";

import Manager from "./pages/dashboard/Manager";
import Senior from "./pages/dashboard/Senior";
import Junior from "./pages/dashboard/Junior";
import Financemanager from "./pages/dashboard/Financemanager";
import Budgetanalyst from "./pages/dashboard/Budgetanalyst";
import Costaccountant from "./pages/dashboard/Costaccountant";

function App() {
  const [role, setRole] = useState("");
  const isAuthenticated = !!role;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setRole={setRole} />} />
        <Route path="/Usercreation" element={<Usercreation />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              role === "Manager" ? (
                <Manager />
              ) : role === "Senior Employee" ? (
                <Senior />
              ) : role === "Junior Employee" ? (
                <Junior />
              ) : role === "Finance Manager" ? (
                <Financemanager />
              ) : role === "Budget Analyst" ? (
                <Budgetanalyst />
              ) : role === "Cost Accountant" ? (
                <Costaccountant />
              ) : (
                <Navigate to="/login" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
