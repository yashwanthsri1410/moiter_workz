import React, { useState, useEffect } from "react";
import axios from "axios";
import usePublicIp from "../hooks/usePublicIp";



export default function Profile() {


  const ip = usePublicIp();

  const username = localStorage.getItem("username");
  const Role = localStorage.userType === "1" ? "super user" : localStorage.userType === "3" ? "Checker" : localStorage.userType === "4" ? "Maker" : ""
  const [users, setUsers] = useState([]);
  const [passwords, setPasswords] = useState({
    old: "",
    new: "",
    confirm: "",
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwords.new !== passwords.confirm) {
      alert("New password and confirmation do not match.");
      return;
    }
    console.log(e)

    const payload = {
      username: username,
      newPassword: passwords.new,
      metadata: {
        ipAddress: ip,
        userAgent: navigator.userAgent,
        headers: "Custom-Header",
        channel: "Web",
        auditMetadata: {
          createdBy: username,
          createdDate: new Date().toISOString(),
          modifiedBy: username,
          modifiedDate: new Date().toISOString(),
          header: {
            additionalProp1: {
              options: { propertyNameCaseInsensitive: true },
              parent: "user",
              root: "root"
            }
          }
        }
      }
    };

    try {
      const res = await axios.post(
        "http://192.168.22.247:5229/ums/api/UserManagement/user_update-password",
        payload,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (res.status === 200) {
        alert("Password updated successfully!");
        setPasswords({ old: "", new: "", confirm: "" });
      } else {
        alert("Password update failed.");
      }
    } catch (error) {
      console.error("Update password error:", error);
      alert("Something went wrong while updating the password.");
    }
  };

  return (
    <div className="bg-[#0d0f24] text-white min-h-screen p-6">
      {/* Profile Info Card */}
      <div className="bg-[#0f122d] p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">👤 Profile Info</h2>
        <p className="mb-1"><span className="font-medium text-gray-400">Name:</span> {username}</p>
        <p><span className="font-medium text-gray-400">Role:</span> {Role}</p>
      </div>


      {/* Password Change */}
      <div className="bg-[#0f122d] p-6 rounded-xl shadow-lg mb-8 max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">🔒 Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {["Old", "New", "Confirm New"].map((label, index) => (
            <div key={index}>
              <label className="block mb-1">{label} Password</label>
              <input
                type="password"
                className="w-full p-2 rounded bg-[#1a1d3b] border border-gray-700 text-white placeholder-gray-400"
                placeholder={`${label} Password`}
                value={passwords[label.toLowerCase().replace(" ", "")]}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    [label.toLowerCase().replace(" ", "")]: e.target.value,
                  })
                }
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md font-medium hover:opacity-90"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* User List */}
      <div className="bg-[#0f122d] p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">👥 User List</h2>
        <ul className="divide-y divide-gray-700">
          {Array.isArray(users) && users.length > 0 ? (
            users.map((u) => (
              <li key={u.id} className="py-3">
                <p className="text-base font-medium">{u.name}</p>
                <p className="text-sm text-gray-400">{u.email}</p>
              </li>
            ))
          ) : (
            <p className="text-gray-400">No users available</p>
          )}
        </ul>
      </div>
    </div>

  );
}
