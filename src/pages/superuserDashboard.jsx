import React, { useState } from "react";
import {
  Shield,
  Building2,
  Badge,
  Settings,
  Monitor,
  UserCog,
  Users,
  LogOut,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  User,
  Wallet,
  BarChart2,
  FileCheck,
  Activity,
  FileText,
  LayoutGrid,
  Database,
  LoaderCircle,
} from "lucide-react";
import "../styles/styles.css";
import logo from "../assets/logo.png";
import DepartmentCreation from "../components/departmentcreate";
import ModuleCreation from "../components/modulecreate";
import CreateDesignationForm from "../components/designationcreate";
import ScreenManagement from "../components/screencreate";
import RoleAccessForm from "../components/rolecreate";
import EmployeeCreationForm from "../components/employeecreate";
import Superuserdasboardcontent from "../components/superuserDashboardcontent";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Infra from "../features/infra";
import CustomerManagement from "../features/customerManagement/CustomerManagement";
import Walletranscation from "../features/Walletoperation/Walletranscation";

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const storedUsername = localStorage.getItem("username");

      const payload = {
        username: storedUsername || "Guest",
        metadata: {
          ipAddress: "127.0.0.1",
          userAgent: navigator.userAgent,
          headers: JSON.stringify({}),
          channel: "WEB",
          auditMetadata: {
            createdBy: storedUsername || "system",
            createdDate: new Date().toISOString(),
            modifiedBy: storedUsername || "system",
            modifiedDate: new Date().toISOString(),
            header: {
              additionalProp1: {
                options: { propertyNameCaseInsensitive: true },
                parent: "string",
                root: "string",
              },
            },
          },
        },
      };
      // console.log(JSON.stringify(payload, null, 2));
      // console.log(payload);
      await axios.post(
        `${API_BASE_URL}/ums/api/UserManagement/user_logout`,
        payload
      );

      localStorage.clear();
      navigate("/employee-login");
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.clear();
      navigate("/employee-login");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="content">
            <Superuserdasboardcontent />
          </div>
        );
      case "customer":
        return (
          <div className="content">
            <CustomerManagement />
          </div>
        );
      case "wallet":
        return (
          <div className="content">
            <Walletranscation />
          </div>
        );
      case "departments":
        return (
          <div className="content">
            <DepartmentCreation onBack={() => setActiveTab("dashboard")} />
          </div>
        );
      case "designations":
        return (
          <div className="content">
            <CreateDesignationForm onBack={() => setActiveTab("dashboard")} />
          </div>
        );
      case "modules":
        return (
          <div className="content">
            <ModuleCreation onBack={() => setActiveTab("dashboard")} />
          </div>
        );
      case "screens":
        return (
          <div className="content">
            <ScreenManagement onBack={() => setActiveTab("dashboard")} />
          </div>
        );
      case "roles":
        return (
          <div className="content">
            <RoleAccessForm onBack={() => setActiveTab("dashboard")} />
          </div>
        );
      case "Users":
        return (
          <div className="content">
            <EmployeeCreationForm onBack={() => setActiveTab("dashboard")} />
          </div>
        );
      case "infra":
        return (
          <div className="content">
            <Infra />
          </div>
        );
      default:
        return <div className="content">Select an option</div>;
    }
  };
  // Define dashboard children tabs
  const dashboardTabs = [
    "customer",
    "wallet",
    "transactions",
    "compliance",
    "risk",
    "productperformance",
    "partner",
    "reports",
    "system",
  ];
  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className={`${isCollapsed ? "shrinked" : "notshrinked"}`}>
            <img src={logo} alt="Logo" />
          </div>
          <button
            className="collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>

        <div className="menu-bar">
          <nav className="menu">
            {/* Dashboard Dropdown */}
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab("dashboard");
                  toggleDropdown("dashboard");
                }}
                className={`menu-header ${
                  activeTab === "dashboard" ? "active" : ""
                }`}
              >
                <LayoutGrid size={16} className="menu-icon" />
                {!isCollapsed && (
                  <>
                    <span>Dashboard</span>
                    <span className="arrow-icon">
                      {openDropdown === "dashboard" ||
                      dashboardTabs.includes(activeTab) ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </span>
                  </>
                )}
              </button>

              {(openDropdown === "dashboard" ||
                dashboardTabs.includes(activeTab)) &&
                !isCollapsed && (
                  <div className="submenu submenu-open">
                    <button
                      onClick={() => setActiveTab("customer")}
                      className={
                        activeTab === "customer" ? "submenu-active" : ""
                      }
                    >
                      <User size={14} /> Customer Management
                    </button>
                    <button
                      onClick={() => setActiveTab("wallet")}
                      className={activeTab === "wallet" ? "submenu-active" : ""}
                    >
                      <Wallet size={14} /> Wallet Operations
                    </button>
                    <button
                      onClick={() => setActiveTab("transactions")}
                      className={
                        activeTab === "transactions" ? "submenu-active" : ""
                      }
                    >
                      <BarChart2 size={14} /> Transaction Analytics
                    </button>
                    <button
                      onClick={() => setActiveTab("compliance")}
                      className={
                        activeTab === "compliance" ? "submenu-active" : ""
                      }
                    >
                      <FileCheck size={14} /> Compliance & KYC
                    </button>
                    <button
                      onClick={() => setActiveTab("risk")}
                      className={activeTab === "risk" ? "submenu-active" : ""}
                    >
                      <Shield size={14} /> Risk Management
                    </button>
                    <button
                      onClick={() => setActiveTab("productperformance")}
                      className={
                        activeTab === "productperformance"
                          ? "submenu-active"
                          : ""
                      }
                    >
                      <Activity size={14} /> Product Performance
                    </button>
                    <button
                      onClick={() => setActiveTab("partner")}
                      className={
                        activeTab === "partner" ? "submenu-active" : ""
                      }
                    >
                      <Users size={14} /> Partner Management
                    </button>
                    <button
                      onClick={() => setActiveTab("reports")}
                      className={
                        activeTab === "reports" ? "submenu-active" : ""
                      }
                    >
                      <FileText size={14} /> Reports & Analytics
                    </button>
                    <button
                      onClick={() => setActiveTab("system")}
                      className={activeTab === "system" ? "submenu-active" : ""}
                    >
                      <Settings size={14} /> System Settings
                    </button>
                    <button
                      onClick={() => setActiveTab("infra")}
                      className={activeTab === "infra" ? "submenu-active" : ""}
                    >
                      <Database size={14} /> Infra
                    </button>
                  </div>
                )}
            </div>
            {/* superuser console Dropdown */}
            <div>
              <button
                onClick={() => toggleDropdown("superuserconsole")}
                className={`menu-header ${
                  openDropdown === "superuserconsole" ? "active" : ""
                }`}
              >
                <Shield size={16} className="menu-icon" />
                {!isCollapsed && (
                  <>
                    <span>Super Console</span>
                    <span className="arrow-icon">
                      {openDropdown === "superuserconsole" ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </span>
                  </>
                )}
              </button>

              {openDropdown === "superuserconsole" && !isCollapsed && (
                <div
                  className={`submenu ${
                    openDropdown === "superuserconsole" ? "submenu-open" : ""
                  }`}
                >
                  <button
                    onClick={() => setActiveTab("departments")}
                    className={
                      activeTab === "departments" ? "submenu-active" : ""
                    }
                  >
                    <Building2 size={14} /> Departments
                  </button>
                  <button
                    onClick={() => setActiveTab("designations")}
                    className={
                      activeTab === "designations" ? "submenu-active" : ""
                    }
                  >
                    <Badge size={14} /> Designations
                  </button>
                  <button
                    onClick={() => setActiveTab("modules")}
                    className={activeTab === "modules" ? "submenu-active" : ""}
                  >
                    <Settings size={14} /> Modules
                  </button>
                  <button
                    onClick={() => setActiveTab("screens")}
                    className={activeTab === "screens" ? "submenu-active" : ""}
                  >
                    <Monitor size={14} /> Screens
                  </button>
                  <button
                    onClick={() => setActiveTab("roles")}
                    className={activeTab === "roles" ? "submenu-active" : ""}
                  >
                    <UserCog size={14} /> Roles
                  </button>
                  <button
                    onClick={() => setActiveTab("Users")}
                    className={activeTab === "Users" ? "submenu-active" : ""}
                  >
                    <User size={14} /> Users
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        <div className="logout">
          {!isLoading && (
            <button onClick={handleLogout} className="flex items-center gap-2">
              <LogOut size={16} /> {!isCollapsed && "Logout"}
            </button>
          )}
          {isLoading && (
            <LoaderCircle
              color="red"
              size="18"
              className="ms-10 my-[12px] animate-spin flex"
            />
          )}
        </div>
      </aside>

      {/* Content */}
      <main className="main">{renderContent()}</main>
    </div>
  );
}
