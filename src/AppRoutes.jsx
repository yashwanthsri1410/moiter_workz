import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Signup from "./pages/Signup";
import Usercreation from "./pages/Usercreation";
import Dashboard from "./pages/MainDashboard";
import Employeelogin from "./pages/employeelogin";
import CustomerKYCForm from "./pages/CustomerKYCForm";
import Makerscreation from "./pages/makerscreation";
import ScreenCreation from "./pages/screenCreation";
import Profile from "./pages/profile";
import ProtectedRoute from "./auth/ProtectedRoute";
import EmployeeApproval from "./pages/employeeapproval";
import CustomerApproval from "./pages/customerapproval";
import Rolecreationfrom from "./pages/rolecreation"
import EmployeeCreationForm from "./pages/employeecreation";
import Productcreation from "./pages/productcreation";
import Productconfiguration from "./pages/productConfiguration";
import ProductconfigurationUpdation from "./pages/productConfigurationUpdate"
import DistributionPartnerCreate from "./pages/DistributionPartnerCreate";
import Infarmonitor from "./pages/inframonitor";
import ProductcreationApproval from "./pages/productcreationapproval"
import MakersDashboard from "./pages/makersDashboard";
import PartnersApproval from "./pages/partnersapproval";
import SuperuserDashboard from "./pages/superuserDashboard";
import CheckersDashboardLayout from "./pages/checkersdashboard";

function AppRoutes({ setRole }) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/Employee-Login" />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/Employee-Login" element={<Employeelogin setRole={setRole} />} />

      {/* Protected routes based on userType */}
      <Route
        path="/Dashboard"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Makers-dashboard"
        element={
          <ProtectedRoute allowedRoles={[4]}>
            <MakersDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Employee-creation"
        element={
          <ProtectedRoute allowedRoles={[1, 4]}>
            <EmployeeCreationForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/productcreation-approval"
        element={
          <ProtectedRoute allowedRoles={[3]}>
            <ProductcreationApproval />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Employee-Approval"
        element={
          <ProtectedRoute allowedRoles={[3]}>
            <EmployeeApproval />
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

      <Route
        path="/Customer-Approval"
        element={
          <ProtectedRoute allowedRoles={[3]}>
            <CustomerApproval />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Partners-approval"
        element={
          <ProtectedRoute allowedRoles={[3]}>
            <PartnersApproval />
          </ProtectedRoute>
        }
      />

      {/* Protected routes for multiple or all user types */}
      <Route
        path="/Usercreation"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <Usercreation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Infarmonitor"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <Infarmonitor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Role-creation"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <Rolecreationfrom />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Product-creation"
        element={
          <ProtectedRoute allowedRoles={[4]}>
            <Productcreation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/distributionPartner-creation"
        element={
          <ProtectedRoute allowedRoles={[4]}>
            <DistributionPartnerCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Product-creation"
        element={
          <ProtectedRoute allowedRoles={[4]}>
            <Productcreation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Product-configuration"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <Productconfiguration />
          </ProtectedRoute>
        }
      />

       <Route
        path="/Superuser-workplace"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <SuperuserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Product-configuration-updation"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <ProductconfigurationUpdation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Distribution-Partner"
        element={
          <ProtectedRoute allowedRoles={[4]}>
            <DistributionPartnerCreate />
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
      <Route
        path="/Makers-creation"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <Makerscreation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Screen-Creation"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <ScreenCreation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={[1, 4, 3]}>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
export default AppRoutes;