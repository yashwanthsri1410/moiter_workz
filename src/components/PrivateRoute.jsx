// src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedUserTypes }) => {
  const username = localStorage.getItem("username");
  const userType = parseInt(localStorage.getItem("userType"));

  if (!username || !allowedUserTypes.includes(userType)) {
    return <Navigate to="/Employee-Login" replace />;
  }

  return children;
};

export default PrivateRoute;
