import React, { useState } from "react";
import {
  LogOut,
  ChevronRight,
  ChevronLeft,
  LayoutGrid,
  PackagePlus,
  ShieldCheck,
  CalculatorIcon,
  User,
  Wallet,
  BarChart2,
  FileCheck,
  Shield,
  Activity,
  FileText,
  Users,
  Settings,
  ChevronDown,
  ChevronUp,
  FileTextIcon,
  Database,
  LoaderCircle,
} from "lucide-react";
import "../styles/styles.css";
import logo from "../assets/logo.png";
import ModuleCreation from "../components/modulecreate";
import CreateDesignationForm from "../components/designationcreate";
import Regulatoryconfiguration from "../components/regulatoryconfiguration";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Productcreate from "../components/productcreate";
import Partnercreate from "../components/partnercreate";
import Maincheckerdashboard from "../components/maincheckerdashboard";
import Infra from "../features/infra";

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="content">
            {" "}
            <Maincheckerdashboard />
          </div>
        );
      case "customer":
        return <div className="content">👤 Customer Management</div>;
      case "wallet":
        return <div className="content">💰 Wallet Operations</div>;
      case "transactions":
        return <div className="content">📈 Transaction Analytics</div>;
      case "compliance":
        return <div className="content">📜 Compliance & KYC</div>;
      case "risk":
        return <div className="content">🛡️ Risk Management</div>;
      case "productperformance":
        return <div className="content">📦 Product Performance</div>;
      case "partner":
        return <div className="content">🤝 Partner Management</div>;
      case "reports":
        return <div className="content">📑 Reports & Analytics</div>;
      case "system":
        return <div className="content">⚙️ System Settings</div>;
      case "infra":
        return (
          <div className="content">
            <Infra />
          </div>
        );

      case "Regulatory":
        return (
          <div className="content">
            <Regulatoryconfiguration />
          </div>
        );
      case "Product":
        return (
          <div className="content">
            <Productcreate />
          </div>
        );
      case "partnercreation":
        return (
          <div className="content">
            <Partnercreate />
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
                    {/* <button
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
                    </button> */}
                    <button
                      onClick={() => setActiveTab("infra")}
                      className={activeTab === "infra" ? "submenu-active" : ""}
                    >
                      <Database size={14} /> Infra
                    </button>
                  </div>
                )}
            </div>

            {/* Maker Console Dropdown */}
            <div>
              <button
                onClick={() => toggleDropdown("makerconsole")}
                className={`menu-header ${
                  openDropdown === "makerconsole" ? "active" : ""
                }`}
              >
                <ShieldCheck size={16} className="menu-icon" />
                {!isCollapsed && (
                  <>
                    <span>Maker Console</span>
                    <span className="arrow-icon">
                      {openDropdown === "makerconsole" ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </span>
                  </>
                )}
              </button>

              {openDropdown === "makerconsole" && !isCollapsed && (
                <div className="submenu submenu-open">
                  <button
                    onClick={() => setActiveTab("Regulatory")}
                    className={
                      activeTab === "Regulatory" ? "submenu-active" : ""
                    }
                  >
                    <FileTextIcon size={14} /> Regulatory
                  </button>
                  <button
                    onClick={() => setActiveTab("Product")}
                    className={activeTab === "Product" ? "submenu-active" : ""}
                  >
                    <PackagePlus size={14} /> Product
                  </button>
                  <button
                    onClick={() => setActiveTab("partnercreation")}
                    className={
                      activeTab === "partnercreation" ? "submenu-active" : ""
                    }
                  >
                    <CalculatorIcon size={14} /> Partner Creation
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
