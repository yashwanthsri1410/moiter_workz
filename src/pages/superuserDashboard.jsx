import React, { useState, useEffect } from "react";
import {
  Shield,
  Building2,
  Badge,
  Settings,
  Monitor,
  UserCog,
  Users,
  LogOut,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ChevronRight,
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
import ComplianceKYC from "../features/Compliance&KYC/Compliance&KYC";
import Productperformance from "../features/productperformance/productperformance";
import Walletranscation from "../features/Walletoperation/Walletranscation";
import PartnerMangement from "../features/partnerManagement";
import ReportsAndAnalytics from "../features/reportsAnalytics";
import SystemSettings from "../features/systemSettings";
import RiskManagement from "../features/riskManagement";
import TransactionsAnalystics from "../features/TransactionsManagement/TransactionsAnalystics";
import MerchantDiscountRateCreation from "../components/MerchantDiscountRateCreation";

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState("0");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modules, setModules] = useState([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isMobile = window.innerWidth <= 768;
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

  const toggleDropdown = (menu, modIdx) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
    setActiveTab(modIdx);
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
  const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return isMobile;
  };
  const renderContent = () => {
    const isMobile = useIsMobile();

    const tabMap = {
      0: <Superuserdasboardcontent />,
      1: <Superuserdasboardcontent />,
      "0-0": <CustomerManagement />,
      "0-1": <Walletranscation />,
      "0-2": <TransactionsAnalystics />,
      "0-3": <ComplianceKYC />,
      "0-4": <RiskManagement />,
      "0-5": <Productperformance />,
      "0-6": <PartnerMangement />,
      "0-7": <ReportsAndAnalytics />,
      "0-8": <SystemSettings />,

      "1-0": <DepartmentCreation onBack={() => setActiveTab("0")} />,
      "1-1": <CreateDesignationForm onBack={() => setActiveTab("0")} />,
      "1-2": <ModuleCreation onBack={() => setActiveTab("0")} />,
      "1-3": <ScreenManagement onBack={() => setActiveTab("0")} />,
      "1-4": <RoleAccessForm onBack={() => setActiveTab("0")} />,
      "1-5": <EmployeeCreationForm onBack={() => setActiveTab("0")} />,
      "1-6": <MerchantDiscountRateCreation onBack={() => setActiveTab("0")} />,
    };

    if (activeTab === "0-9") {
      return !isMobile ? (
        <div className="content p-5 space-y-5">
          <Infra />
        </div>
      ) : null;
    }

    return (
      <div className="content p-5 space-y-5">
        {tabMap[activeTab] || "Select an option"}
      </div>
    );
  };

  return (
    <div className="layout">
      {/* Mobile toggle button */}
      {/* {isMobile && !isMobileOpen && (
        <button
          className="mobile-sidebar-toggle fixed top-4 left-4 z-50 bg-white border rounded p-1 shadow"
          onClick={() => setIsMobileOpen(true)}
        >
          <ChevronRight size={18} />
        </button>
      )} */}

      {/* Sidebar */}
      <aside
        className={`sidebar 
          ${isCollapsed ? "collapsed" : ""} 
          ${isMobile ? (isMobileOpen ? "open" : "hidden") : ""}
        `}
      >
        <div className="sidebar-header">
          <div className={`${isCollapsed ? "shrinked" : "notshrinked"}`}>
            <img src={logo} alt="Logo" />
          </div>

          {/* Collapse button */}
          <button
            className="collapse-btn"
            onClick={() =>
              isMobile
                ? setIsMobileOpen(!isMobileOpen)
                : setIsCollapsed(!isCollapsed)
            }
          >
            {isCollapsed || (isMobile && !isMobileOpen) ? (
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
                    className={`main-menu-list ${openDropdown === mod.module.trim() ? "active" : ""
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
                        // 🔴 Skip Infra when screen width < 768px
                        if (screen === "Infra" && window.innerWidth < 768) {
                          return null;
                        }
                        return (
                          <button
                            key={tabKey}
                            onClick={() => setActiveTab(tabKey)}
                            className={`submenu-list
                              ${activeTab === tabKey ? "submenu-active" : ""}
                            `}
                          >
                            <ChevronRight size={14} /> {screen}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
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
