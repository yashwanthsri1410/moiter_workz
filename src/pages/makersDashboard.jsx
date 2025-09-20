import React, { useEffect, useState } from "react";
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
import Regulatoryconfiguration from "../components/regulatoryconfiguration";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Productcreate from "../components/productcreate";
import Partnercreate from "../components/partnercreate";
import Maincheckerdashboard from "../components/maincheckerdashboard";
import Infra from "../features/infra";
import CustomerManagement from "../features/customerManagement/CustomerManagement";
import Walletranscation from "../features/Walletoperation/Walletranscation";
import ComplianceKYC from "../features/Compliance&KYC/Compliance&KYC";
import Productperformance from "../features/productperformance/productperformance";
import RiskManagement from "../features/riskManagement";
import PartnerMangement from "../features/partnerManagement";
import ReportsAndAnalytics from "../features/reportsAnalytics";
import SystemSettings from "../features/systemSettings";
import TransactionsAnalystics from "../features/TransactionsManagement/TransactionsAnalystics";

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState("0");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modules, setModules] = useState([]);
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const stored = localStorage.getItem("userData");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setModules(parsed?.moduleAccess || []);
      } catch (err) {
        console.error("Invalid localStorage data", err);
      }
    }
  }, []);
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
      navigate("/Login");
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.clear();
      navigate("/Login");
    }
  };

  const toggleDropdown = (menu, modIdx) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
    setActiveTab(modIdx)
  };

  const renderContent = () => {
    switch (activeTab) {
      case "0":
      case "1":
        return (
          <div className="content">
            {" "}
            <Maincheckerdashboard />
          </div>
        );
      case "0-0":
        return (
          <div className="content">
            <CustomerManagement />
          </div>
        );
      case "0-1":
        return (
          <div className="content">
            {" "}
            <Walletranscation />
          </div>
        );
      case "0-2":
        return (
          <div className="content">
            <TransactionsAnalystics />
          </div>
        );
      case "0-3":
        return (
          <div className="content">
            {" "}
            <ComplianceKYC />
          </div>
        );
      case "0-4":
        return (
          <div className="content">
            <RiskManagement />
          </div>
        );
      case "0-5":
        return (
          <div className="content">
            {" "}
            <Productperformance />
          </div>
        );
      case "0-6":
        return (
          <div className="content">
            <PartnerMangement />
          </div>
        );
      case "0-7":
        return (
          <div className="content">
            <ReportsAndAnalytics />
          </div>
        );
      case "0-8":
        return (
          <div className="content">
            <SystemSettings />
          </div>
        );
      case "0-9":
        return (
          <div className="content">
            <Infra />
          </div>
        );

      case "1-0":
        return (
          <div className="content">
            <Regulatoryconfiguration />
          </div>
        );
      case "1-1":
        return (
          <div className="content">
            <Productcreate />
          </div>
        );
      case "1-2":
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
            {modules.map((mod, modIdx) => {
              const tabKey = `${modIdx}`;
              return (
                <div key={modIdx}>
                  <button
                    onClick={() => toggleDropdown(mod.module.trim(), tabKey)}
                    className={`menu-header ${openDropdown === mod.module.trim() ? "active" : ""
                      }`}
                  >
                    <LayoutGrid size={16} className="menu-icon" />
                    {!isCollapsed && (
                      <>
                        <span>{mod.module.trim()}</span>
                        <span className="arrow-icon">
                          {openDropdown === mod.module.trim() ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )}
                        </span>
                      </>
                    )}
                  </button>

                  {openDropdown === mod.module.trim() && !isCollapsed && (
                    <div className="submenu submenu-open">
                      {mod.screens.map((screen, screenIdx) => {
                        // unique id combining module index + screen index
                        const tabKey = `${modIdx}-${screenIdx}`;
                        return (
                          <button
                            key={tabKey}
                            onClick={() => setActiveTab(tabKey)}
                            className={activeTab === tabKey ? "submenu-active" : ""}
                          >
                            <ChevronRight size={14} /> {screen}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )
            })}
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
