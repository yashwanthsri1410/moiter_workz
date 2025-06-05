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
       
      </Routes>
    </Router>
  );
}

export default App;
