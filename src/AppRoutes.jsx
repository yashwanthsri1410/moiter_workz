import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Employeelogin from "./pages/employeelogin";
import CustomerKYCForm from "./pages/CustomerKYCForm";
import ProtectedRoute from "./auth/ProtectedRoute";
import MakersDashboard from "./pages/makersDashboard";
import SuperuserDashboard from "./pages/superuserDashboard";
import CheckersDashboardLayout from "./pages/checkersdashboard";

function AppRoutes({ setRole }) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/Employee-Login" />} />
      <Route path="/Employee-Login" element={<Employeelogin setRole={setRole} />} />

      {/* Protected routes based on userType */}
      
      <Route
        path="/Makers-dashboard"
        element={
          <ProtectedRoute allowedRoles={[4]}>
            <MakersDashboard />
          </ProtectedRoute>
        }
      />
       <Route
        path="/Checkers-dashboard"
        element={
          <ProtectedRoute allowedRoles={[3]}>
            <CheckersDashboardLayout />
          </ProtectedRoute>
        }
      />

      {/* Protected routes for multiple or all user types */}
     

       <Route
        path="/Superuser-workplace"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <SuperuserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer-On-boarding"
        element={
          <ProtectedRoute allowedRoles={[4]}>
            <CustomerKYCForm />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
export default AppRoutes;