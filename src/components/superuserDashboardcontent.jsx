// UserManagementSystem.jsx
import React, { useEffect, useState } from "react";
import {
  Users,
  Shield,
  PenTool,
  CheckCircle2,
  Search,
  TrendingUp,
} from "lucide-react";
import axios from "axios";

export default function UserManagementSystem() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([]);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
      fetch(`${API_BASE_URL}/fes/api/Export/user-type-summary`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data?.[0]);
      })
      .catch((err) => console.error("Error fetching users:", err));

    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await axios.get(
      `${API_BASE_URL}/fes/api/Export/pending-employees`
    );
    setEmployees(res.data);
  };
  const filteredEmployees = employees.filter((e) =>
    e.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Count different user types
  const totalUsers = users.totalUsers;
  const superUsers = users.superUsers;
  const makers = users.maker;
  const checkers = users.checker;

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
          <span className="text-xs text-[#00d4aa]"> ↑ Active</span>
        </div>

        <div className="table-card hover-card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm text-gray-400">Super Users</h2>
            <Shield className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold">{superUsers}</p>
          <span className="text-xs text-red-500 flex gap-[5px]">
            {" "}
            <TrendingUp className="w-4 h-4 text-[#00d4aa]" />
            Admin Level
          </span>
        </div>

        <div className="table-card hover-card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm text-gray-400">Makers</h2>
            <PenTool className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">{makers}</p>
          <span className="text-xs text-blue-500 flex gap-[5px]">
            {" "}
            <TrendingUp className="w-4 h-4 text-[#00d4aa]" />
            Content Creators
          </span>
        </div>

        <div className="table-card hover-card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm text-gray-400">Checkers</h2>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold">{checkers}</p>
          <span className="text-xs text-green-500 flex gap-[5px]">
            {" "}
            <TrendingUp className="w-4 h-4 text-[#00d4aa]" />
            Reviewers
          </span>
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
                <th className="table-cell">Emp ID</th>
                <th className="table-cell">userName</th>
                <th className="table-cell">Email ID</th>
                <th className="table-cell">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((e, i) => (
                  <tr key={i} className="table-row">
                    <td className="table-cell-name">{e.empId}</td>
                    <td className="table-cell-name">{e.userName}</td>
                    <td className="table-cell-name">{e.email}</td>
                    <td className="table-cell-name">
                      <span
                        className={`px-2 py-1 text-[9px] rounded ${e.status === 0
                            ? "checker"
                            : e.status === 1
                              ? "infra"
                              : e.status === 2
                                ? "inactive"
                                : "maker"
                          } `}
                      >
                        {e.status === 1
                          ? "Pending"
                          : e.status === 0
                            ? "Approved"
                            : e.status === 2
                              ? "Rejected"
                              : "Recheck"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
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
