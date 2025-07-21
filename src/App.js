import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signup from "./pages/Signup";
// import Login from "./pages/Login";
import Usercreation from "./pages/Usercreation";
import Deptdesig from "./pages/deptdesig";
import Modulescreen from "./pages/module&screen";
import EmployeeRegistration from "./pages/employeeregistration";
import Dashboard from "./pages/MainDashboard";
import Employeelogin from "./pages/employeelogin";
import SendRequestInfo from "./components/SendRequestInfo";

function AppRoutes({ setRole }) {
  return (
    <>
      <SendRequestInfo />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/login" element={<Login setRole={setRole} />} /> */}
        <Route path="/Usercreation" element={<Usercreation />} />
        <Route path="/deptdesig" element={<Deptdesig />} />
        <Route path="/Modulescreen" element={<Modulescreen />} />
        <Route path="/Employee-Registration" element={<EmployeeRegistration />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Employee-Login" element={<Employeelogin />} />
      </Routes>
    </>
  );
}

function App() {
  const [role, setRole] = useState("");
  return (
    <Router>
      <AppRoutes setRole={setRole} />
    </Router>
  );
}

export default App;
