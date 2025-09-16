// UserManagementSystem.jsx
import React, { useEffect, useState } from "react";
import {
  Users,
  Shield,
  PenTool,
  CheckCircle2,
  Search,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function UserManagementSystem() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetch(`${API_BASE_URL}/fes/api/Export/user-type-summary`)
      .then((res) => res.json())
      .then((data) => setUsers(data?.[0]))
      .catch((err) => console.error("Error fetching users:", err));

    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/fes/api/Export/pending-employees`
      );
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  // ✅ Pagination
  const filteredEmployees = employees.filter(
    (e) =>
      e.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ✅ Status helpers
  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return "Approved";
      case 1:
        return "Pending";
      case 2:
        return "Rejected";
      case 3:
        return "Recheck";
      default:
        return "Unknown";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 0:
        return "checker";
      case 1:
        return "infra";
      case 2:
        return "inactive";
      case 3:
        return "maker";
      default:
        return "maker";
    }
  };

  // ✅ Export PDF function
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("User Management System - Users", 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [["Emp ID", "User Name", "Email ID", "Status"]],
      body: filteredEmployees.map((e) => [
        e.empId,
        e.userName,
        e.email,
        getStatusLabel(e.status),
      ]),
    });
    doc.save("user_management_users.pdf");
  };

  // Count user types
  const totalUsers = users.totalUsers || 0;
  const superUsers = users.superUsers || 0;
  const makers = users.maker || 0;
  const checkers = users.checker || 0;

  return (
    <div className="department-page">
      {/* Header */}
      <div className="form-header">
        <div className="back-title flex justify-between items-center">
          <div className="header-left flex items-center gap-[10px]">
            <div className="header-icon-box">
              <Shield className="text-[#00d4aa] w-4 h-4 " />
            </div>
            <div>
              <h1 className="header-title">User Management System</h1>
              <p className="header-subtext">
                Monitor and manage your organization’s workforce
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
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
            <TrendingUp className="w-4 h-4 text-red-500" /> Admin Level
          </span>
        </div>
        <div className="table-card hover-card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm text-gray-400">Makers</h2>
            <PenTool className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">{makers}</p>
          <span className="text-xs text-blue-500 flex gap-[5px]">
            <TrendingUp className="w-4 h-4 text-blue-500" /> Content Creators
          </span>
        </div>
        <div className="table-card hover-card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm text-gray-400">Checkers</h2>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold">{checkers}</p>
          <span className="text-xs text-green-500 flex gap-[5px]">
            <TrendingUp className="w-4 h-4 text-green-500" /> Reviewers
          </span>
        </div>
      </div>

      {/* User Directory */}
      <div className="table-card">
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
          <div className="flex items-center bg-[#0a1625] px-3 py-2 rounded-lg w-[90%]">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-sm text-white w-full ml-2"
            />
          </div>
          <button className="filter-btn" onClick={exportPDF}>
            <Download className="filter-icon" />
            Export PDF
          </button>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="w-full text-sm text-left">
            <thead className="table-head">
              <tr>
                <th className="table-cell">Emp ID</th>
                <th className="table-cell">User Name</th>
                <th className="table-cell">Email ID</th>
                <th className="table-cell">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.length > 0 ? (
                paginatedEmployees.map((e, i) => (
                  <tr key={i} className="table-row">
                    <td className="table-cell-name">{e.empId}</td>
                    <td className="table-cell-name">{e.userName}</td>
                    <td className="table-cell-name">{e.email}</td>
                    <td className="table-cell-name">
                      <span
                        className={`px-2 py-1 text-[9px] rounded ${getStatusClass(
                          e.status
                        )}`}
                      >
                        {getStatusLabel(e.status)}
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

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 px-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm ${
              currentPage === 1
                ? "bg-[#1c2b45] text-gray-500 cursor-not-allowed"
                : "bg-[#0a1625] text-white hover:text-[#00d4aa]"
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === currentPage ||
                  page === currentPage - 1 ||
                  page === currentPage + 1
              )
              .map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    currentPage === page
                      ? "bg-[#00d4aa] text-black font-bold"
                      : "bg-[#1c2b45] text-white hover:text-[#00d4aa]"
                  }`}
                >
                  {page}
                </button>
              ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm ${
              currentPage === totalPages
                ? "bg-[#1c2b45] text-gray-500 cursor-not-allowed"
                : "bg-[#0a1625] text-white hover:text-[#00d4aa]"
            }`}
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
