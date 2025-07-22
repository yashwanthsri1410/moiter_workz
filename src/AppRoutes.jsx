import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Signup from "./pages/Signup";
import Usercreation from "./pages/Usercreation";
import Deptdesig from "./pages/deptdesig";
import Modulescreen from "./pages/module&screen";
import EmployeeRegistration from "./pages/employeeregistration";
import Dashboard from "./pages/MainDashboard";
import Employeelogin from "./pages/employeelogin";
import SendRequestInfo from "./components/SendRequestInfo";
import CustomerKYCForm from "./pages/CustomerKYCForm";
import Makerscreation from "./pages/makerscreation";
import Checkersapproval from "./pages/checkersapproval";
import DepartmentCreation from "./pages/departmentCreation";
import DesignationtCreation from "./pages/designationCreation";
import ModuleCreation from "./pages/ModuleCreation";
import ScreenCreation from "./pages/screenCreation";
import Profile from "./pages/profile";
import ProtectedRoute from "./auth/ProtectedRoute"; // ⬅️ new
import EmployeeApproval from "./pages/employeeapproval";
import CustomerApproval from "./pages/customerapproval";
import Rolecreationfrom from "./pages/rolecreation"
import EmployeeCreationForm from "./pages/employeecreation";
import Productcreation from "./pages/productcreation";

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
        path="/Employee-Registration"
        element={
          <ProtectedRoute allowedRoles={[4]}>
            <EmployeeRegistration />
          </ProtectedRoute>
        }
      />
       <Route
        path="/Employee-creation"
        element={
          <ProtectedRoute allowedRoles={[1,4]}>
            <EmployeeCreationForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkers-approval"
        element={
          <ProtectedRoute allowedRoles={[3]}>
            <Checkersapproval />
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
        path="/Customer-Approval"
        element={
          <ProtectedRoute allowedRoles={[3]}>
            <CustomerApproval />
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
        path="/Role-creation"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <Rolecreationfrom />
          </ProtectedRoute>
        }
      />
      <Route
        path="/deptdesig"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <Deptdesig />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Modulescreen"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <Modulescreen />
          </ProtectedRoute>
        }
      />
       <Route
        path="/Product-creation"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <Productcreation />
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
        path="/Department-Creation"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <DepartmentCreation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Designation-Creation"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <DesignationtCreation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Module-Creation"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <ModuleCreation />
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