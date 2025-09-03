// components/Sidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Users,
  Layers,
  UserPlus,
  Boxes,
  PackagePlus,
  SlidersHorizontal,
  LayoutGrid,
  ChevronDown,
} from "lucide-react";
import sidebarPattern from "../assets/background.svg";
import "../styles/common.css";

const Sidebar = ({
  isExpanded,
  setIsExpanded,
  isProductDropdownOpen,
  setIsProductDropdownOpen,
  isProductConfigDropdownOpen,
  setIsProductConfigDropdownOpen,
}) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("userType");

  const handleNavigate = (to) => navigate(to);

  const SidebarItem = ({ icon: Icon, label, to }) => (
    <div
      onClick={() => handleNavigate(to)}
      className="flex items-center gap-4 px-3 py-3 text-grey-100 hover:bg-white/5 hover:text-[#00ffc3] cursor-pointer transition-all duration-200"
    >
      <Icon className="w-5 h-5" />
      {isExpanded && <span className="text-sm font-medium">{label}</span>}
    </div>
  );

  const SidebarDropdown = ({ icon: Icon, label, children, isOpen, onClick }) => (
    <div>
      <div
        onClick={onClick}
        className="flex items-center justify-between px-3 py-3 text-grey-100 hover:bg-white/5 hover:text-[#00ffc3] cursor-pointer transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          {isExpanded && <span className="text-sm font-medium">{label}</span>}
        </div>
        {isExpanded && (
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180 text-[#00ffc3]" : ""}`}
          />
        )}
      </div>
      {isOpen && isExpanded && <div className="ml-6 mt-1 space-y-1">{children}</div>}
    </div>
  );
  // console.log(role)
  return (
    <aside
      className={`aside-custom custom-scrollbar ${isExpanded ? "aside-expanded" : "aside-collapsed"
        }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => {
        const isRight = pos.includes("right-0");
        return (
          <div
            key={i}
            className={`glow-corner ${pos} ${isRight ? "glow-corner-right" : "glow-corner-left"}`}
          />
        );
      })}
      {role === "1" && (
        <>
          <nav className="space-y-2">
            <SidebarItem icon={ShieldCheck} label="Department Creation" to="/Department-Creation" />
            <SidebarItem icon={Users} label="Designation Creation" to="/Designation-Creation" />
            <SidebarItem icon={Boxes} label="Module Creation" to="/Module-Creation" />
            <SidebarItem icon={Layers} label="Screen Creation" to="/Screen-Creation" />
            <SidebarItem icon={UserPlus} label="Role Creation" to="/role-Creation" />
            {/* <SidebarItem icon={Users} label="User Creation" to="/userCreation" /> */}
            <SidebarItem icon={Users} label="Employee Creation" to="/Employee-creation" />

          </nav>
        </>
      )}
      {role === "3" && (
        <>
          <nav className="space-y-2">
            <SidebarItem icon={Users} label="Employee Pendings" to="/Employee-Approval" />
            <SidebarItem icon={Users} label="Customer Pendings" to="/Customer-Approval" />
            <SidebarItem icon={Boxes} label="Products Pendings" to="/productcreation-approval" />
            <SidebarItem icon={ShieldCheck} label="Partners Pendings" to="/Partners-approval" />
          </nav>
        </>
      )}
      {role === "4" && (
        <>
          <nav className="space-y-2">
            <SidebarItem icon={Users} label="Customer Onboarding" to="/customer-On-boarding" />
            <SidebarItem icon={PackagePlus} label="Product Creation" to="/Product-creation" />
            <SidebarItem icon={LayoutGrid} label="Distribution Partner creation" to="/distributionPartner-creation" />
            <SidebarItem icon={SlidersHorizontal} label="RBI guidelines confiq" to="/RBI-confiq" />
          </nav>
        </>
      )}

    </aside>
  );
};

export default Sidebar;
