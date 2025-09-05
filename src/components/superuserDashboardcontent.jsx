// UserManagementSystem.jsx
import React, { useEffect, useState } from "react";
import {
  Users,
  Shield,
  PenTool,
  CheckCircle2,
  Search,
  MoreVertical,
  Calendar,
  TrendingUp
} from "lucide-react";

export default function UserManagementSystem() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetch(`${API_BASE_URL}:7090/fes/api/Export/usertypes`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // Count different user types
  const totalUsers = users.length;
  const superUsers = users.filter((u) => u.userType === "super_user").length;
  const makers = users.filter((u) => u.userType === "maker").length;
  const checkers = users.filter((u) => u.userType === "checker").length;

  // Filter for search
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Map colors for user types
  const typeColors = {
    super_user: "superuser",
    maker: "maker",
    checker: "checker",
  };

  return (
    <div className="department-page">
      {/* Header */}
      <div className="form-header">
        <div className="back-title">
          <div className="header-left">
            <div className="flex items-center gap-[10px]">
              <div className="header-icon-box">
                <Shield className="text-[#00d4aa] w-4 h-4 " />
              </div>
            </div>
            <div>
              <h1 className="header-title">User Management System</h1>
              <p className="header-subtext">
                Monitor and manage your organization’s workforce
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Active count */}
            <button className="btn-count">
              <span className="w-2 h-2 rounded-full bg-[#04CF6A] plus"></span>
              {totalUsers} Active Users
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="table-card hover-card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm text-gray-400">Total Users</h2>
            <Users className="w-4 h-4 text-[#00d4aa]" />
          </div>
          <p className="text-2xl font-bold">{totalUsers}</p>
          <span className="text-xs text-[#00d4aa]">   ↑ Active</span>
        </div>

        <div className="table-card hover-card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm text-gray-400">Super Users</h2>
            <Shield className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold">{superUsers}</p>
          <span className="text-xs text-red-500 flex gap-[5px]"> <TrendingUp className="w-4 h-4 text-[#00d4aa]" />Admin Level</span>
        </div>

        <div className="table-card hover-card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm text-gray-400">Makers</h2>
            <PenTool className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">{makers}</p>
          <span className="text-xs text-blue-500 flex gap-[5px]"> <TrendingUp className="w-4 h-4 text-[#00d4aa]" />Content Creators</span>
        </div>

        <div className="table-card hover-card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm text-gray-400">Checkers</h2>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold">{checkers}</p>
          <span className="text-xs text-green-500 flex gap-[5px]"> <TrendingUp className="w-4 h-4 text-[#00d4aa]" />Reviewers</span>
        </div>
      </div>

      {/* User Directory */}
      <div className="table-card ">
        <div className="table-header">
          <h2 className="table-title">
            <Users className="w-5 h-5" /> User Directory
          </h2>
          <p className="table-subtext">
            {totalUsers} Total Users • {superUsers} Super Users
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center bg-[#0a1625] px-3 py-2 rounded-lg w-full">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-sm text-white w-full ml-2"
            />
          </div>
          <button className="px-3 py-2 bg-[#1c2b45] rounded-lg text-sm">
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="w-full text-sm text-left">
            <thead className="table-head">
              <tr>
                <th className="table-cell">User</th>
                <th className="table-cell">User Type</th>
                <th className="table-cell">Joined Date</th>
                <th className="table-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, i) => (
                <tr key={i} className="table-row">
                  <td className="table-cell-name">{u.name}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-[8px] usertype ${typeColors[u.userType]
                        }`}
                    >
                      {u.userType.replace("_", " ").toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 flex items-center gap-1 text-gray-400">
                    <Calendar className="w-4 h-4" /> 2024-01-15
                  </td>
                  <td className="p-3">
                    <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" />
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
