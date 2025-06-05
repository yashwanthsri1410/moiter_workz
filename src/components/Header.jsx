import React from "react";
import logo from "../assets/favicon.png"; // Make sure this path is correct

export default function Header() {
  return (
    <header className="bg-gray-900 text-white px-6 py-4 shadow-md flex items-center justify-between">
      {/* Left: Logo + App Name */}
      <div className="flex items-center space-x-3">
        <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
        <h1 className="text-xl font-semibold tracking-wide">GI money</h1>
      </div>

      {/* Right: User Profile or Menu */}
      <div className="flex items-center space-x-4">
        {/* Optional user name or avatar */}
        <div className="text-sm text-gray-300">Send money</div>
        <div className="text-sm text-gray-300">Gift card</div>
        <div className="text-sm text-gray-300">Help & Support</div>
        <img
          src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
          alt="User Avatar"
          className="w-9 h-9 rounded-full border border-white"
        />
      </div>
    </header>
  );
}
