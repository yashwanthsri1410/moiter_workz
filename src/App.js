import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from './AppRoutes';

function App() {
  const [role, setRole] = useState("");

  return (
    <Router>
      <AppRoutes setRole={setRole} />
    </Router>
  );
}

export default App;
