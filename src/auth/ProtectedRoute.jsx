// src/auth/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const userType = Number(localStorage.getItem("userType"));
  const isAuthenticated = !!localStorage.getItem("username");

  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(userType)) {
    return <Navigate to="/Login" replace />;
  }

  return children;
};

export default ProtectedRoute;
