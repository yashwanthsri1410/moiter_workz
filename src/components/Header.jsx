import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/favicon.png";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut, Menu, X, } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({ isExpanded, setIsExpanded }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const role = localStorage.getItem("userType");
  const username = localStorage.getItem("username");
  const [menuOpen, setMenuOpen] = useState(false);
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
  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
  };
  return (
    <>
      <header
        className="header-custom"
      >
        {/* Left: Logo + Role */}
        <div className="flex items-center gap-3">
          <motion.img
            whileHover={{ rotate: 10, scale: 1.1 }}
            src={logo}
            alt="Logo"
            className="w-10 h-10 rounded-full"
          />

          <h1 className="text-xl font-semibold tracking-wide flex items-center gap-5">
            <span>
              {role === "1" && "Admin Panel"}
              {role === "3" && "Checkers Panel"}
              {role === "4" && "Makers Panel"}
            </span>

            {/* Hamburger / Close Icon */}
            <motion.button
              whileTap={{ scale: 0.85, rotate: 90 }}
              whileHover={{ scale: 1.1 }}
              onClick={toggleSidebar}
              className="ml-2 text-white p-2 rounded-full"
            >
              {isExpanded ? <X size={22} strokeWidth={1} /> : <Menu size={22} strokeWidth={1} />}
            </motion.button>
          </h1>
        </div>
        {/* 
        <h1 className="text-2xl font-semibold mb-6">
          Welcome, <span className="text-yellow-300">{username}</span>
        </h1> */}
        {/* Right: Avatar & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <motion.img
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1, boxShadow: "0 0 12px rgba(0, 255, 195, 0.7)" }}
            transition={{ type: "spring", stiffness: 300 }}
            src="https://demo.spruko.com/html/bootstrap/scifi/dist/assets/images/faces/22.jpg"
            alt="User Avatar"
            className="w-9 h-9 rounded-full border border-cyan-400 cursor-pointer"
            onClick={toggleDropdown}
          />

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute right-0 top-12 bg-[#091c18] rounded-lg  border-[0_0_10px_#00ffc3] p-3 w-44 z-50 shadow-[0_0_10px_#00ffc3]"
              >
                {[
                  {
                    label: "Profile",
                    icon: <User className="w-5 h-5 mr-2" />,
                    action: () => navigate("/profile"),
                  },
                  {
                    label: "Settings",
                    icon: <Settings className="w-5 h-5 mr-2" />,
                    action: () => navigate("/settings"),
                  },
                  {
                    label: "Logout",
                    icon: <LogOut className="w-5 h-5 mr-2" />,
                    action: handleLogout,
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "#0f3344",
                      boxShadow: "0 0 12px rgba(0, 255, 195, 0.5)",
                    }}
                    className="flex items-center px-4 py-2 text-white text-sm cursor-pointer rounded-md mb-1"
                    onClick={item.action}
                  >
                    {item.icon}
                    {item.label}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}
