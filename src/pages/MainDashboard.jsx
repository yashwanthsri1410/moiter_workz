// pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import DashboardMain from "../components/DashboardMain";
import sidebarPattern from "../assets/background.svg";
import "../styles/common.css"

const Dashboard = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isProductConfigDropdownOpen, setIsProductConfigDropdownOpen] = useState(false);

  useEffect(() => {
    if (!isExpanded) {
      setIsProductDropdownOpen(false);
      setIsProductConfigDropdownOpen(false);
    }
  }, [isExpanded]);

  const username = localStorage.getItem("username") || "Guest";

  return (
   <div
      className="bg-custom"
    >
      <Header isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <div className="flex min-h-screen  text-white">
        <Sidebar
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          isProductDropdownOpen={isProductDropdownOpen}
          setIsProductDropdownOpen={setIsProductDropdownOpen}
          isProductConfigDropdownOpen={isProductConfigDropdownOpen}
          setIsProductConfigDropdownOpen={setIsProductConfigDropdownOpen}
        />
        <DashboardMain username={username} />
      </div>
    </div>
  );
};

export default Dashboard;
