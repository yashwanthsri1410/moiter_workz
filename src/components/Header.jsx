import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/favicon.png";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { User, Settings, LogOut } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const role = localStorage.getItem("userType");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/Employee-Login");
  };
  return (
    <>
      <header className="bg-[#0A1330] text-white px-6 py-4 shadow-md flex items-center justify-between relative z-20">
        {/* <div className="flex items-center space-x-3 cursor-pointer" onClick={toggleSidebar}> */}
        <div className="flex items-center space-x-3 cursor-pointer" >
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
          {role === "1" && (<h1 className="text-xl font-semibold tracking-wide">Admin Panel</h1>)}
          {role === "3" && (<h1 className="text-xl font-semibold tracking-wide">checkers Panel</h1>)}
          {role === "4" && (<h1 className="text-xl font-semibold tracking-wide">makers Panel</h1>)}
        </div>

        <div className="flex items-center space-x-4 relative" ref={dropdownRef}>

          <img
            src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
            alt="User Avatar"
            className="w-9 h-9 rounded-full border border-white cursor-pointer"
            onClick={toggleDropdown}
          />

          {dropdownOpen && (
            <div
              className="absolute right-0 top-14 text-white rounded-md shadow-lg py-2 w-40 z-30"
              style={{ backgroundColor: "rgb(10, 19, 48)" }}
            >
              <div
                className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                <User className="w-5 h-5 mr-2" />
                Profile
              </div>
              <div
                className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer"
                onClick={() => navigate("/settings")}
              >
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </div>
              <div
                className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </div>
            </div>
          )}
        </div>
      </header>
      {role === "1" && (<>
        {sidebarOpen && (
          <div className="fixed top-0 left-0 w-64 h-full bg-gray-800 text-white shadow-lg z-10 transition-transform duration-300">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Sidebar Menu</h2>
              <button onClick={toggleSidebar} className="text-white text-xl">&times;</button>
            </div>
            <div className="p-4 space-y-4">
              <div className="cursor-pointer hover:underline" onClick={() => navigate("/Dashboard")}>Dashboard</div>
              <div className="cursor-pointer hover:underline" onClick={() => navigate("/Usercreation")}>User Creation</div>
              <div className="cursor-pointer hover:underline" onClick={() => navigate("/Reports")}>Reports</div>
            </div>
          </div>
        )}</>)}

    </>
  );
}
