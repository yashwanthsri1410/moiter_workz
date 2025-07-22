import React, { useEffect, useState } from "react";
import Headers from "../components/Header";
import banner from "../assets/banner.png";
import {
  ArrowDown,
  Mail,
  MapPin,
  HelpCircle,
  Users,
  UserPlus,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
const EmployeeCreateForm = () => {
  
   const navigate = useNavigate();
  const username = localStorage.getItem("username");
const scrollToFooter = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  };

  return (
    <>
      <Headers />
      <div className="flex min-h-screen bg-[#081028] text-white">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0A1330] border-r border-[#1a233a] p-4 flex flex-col justify-between">
          <div>
            <nav className="space-y-2 text-sm">

                <>
                  <div className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-[#151f42] cursor-pointer" onClick={() => navigate("/Employee-creation")}>
                    <UserPlus className="w-4 h-4 text-gray-400" />
                    <span>Employee creation</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-[#151f42] cursor-pointer" onClick={() => navigate("/customer-On-boarding")}>
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>Customer on boarding</span>
                  </div>
                </>
            </nav>
          </div>

        </aside>

        {/* Main content */}
         {/* Main content */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold mb-4">
            Welcome, <span className="text-yellow-300">{username}</span>
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text content */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">
                Seamless Payments, <span className="text-yellow-300">Start to Finish.</span>
              </h2>
              <h3 className="text-3xl font-semibold">
                Powering the Future of Payments
              </h3>
              <p className="text-gray-300 text-lg">
                Delivering secure, scalable, reliable solutions for every step of your organization's payment journey. From issuing and acquiring cards for many nation building, mission critical and innovative use cases and a whole new acquiring platform with UPI acceptance, our solutions enable organizations to offer seamless, modern payment experiences to their employees, customers and other stakeholders.
              </p>
            </div>
            
            {/* Banner image */}
            <div className="flex justify-center lg:justify-end">
              <img 
                src={banner} 
                alt="Payment solutions" 
                className="max-w-full h-auto rounded-lg shadow-xl"
              />
            </div>
          </div>
        </main>
        
        {/* Floating scroll to footer button */}
        <button
          onClick={scrollToFooter}
          className="fixed bottom-6 right-6 bg-[#151f42] p-3 rounded-full shadow-lg hover:bg-[#1e2a5a] transition-colors"
          aria-label="Scroll to footer"
        >
          <ArrowDown className="w-6 h-6 text-white" />
        </button>
      </div>
      
      {/* Footer */}
      <footer className="bg-[#0A1330] text-white border-t border-[#1a233a]">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Contact Info - Horizontal Layout */}
            <div className="flex flex-col md:flex-row gap-8 w-full md:w-auto">
              {/* Help & Support */}
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium">Help & Support</h4>
                  <p className="text-gray-400 text-sm">Available 24/7</p>
                </div>
              </div>
              
              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium">Email</h4>
                  <a href="mailto:sales@moiterworkz.com" className="text-gray-400 hover:text-white transition-colors text-sm">
                    sales@moiterworkz.com
                  </a>
                </div>
              </div>
              
              {/* Address */}
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium">Address</h4>
                  <p className="text-gray-400 text-sm">Guindy, Chennai, Tamil Nadu</p>
                </div>
              </div>
            </div>
            
            {/* Copyright - moves to right on desktop */}
            <div className="text-gray-400 text-sm md:text-base">
              <p>© {new Date().getFullYear()} Moiterworkz. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default EmployeeCreateForm;
