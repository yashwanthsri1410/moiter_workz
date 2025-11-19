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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getUserTypeSummary, getPendingEmployees } from "../services/service"; // ✅ centralized import

export default function UserManagementSystem() {
  const [users, setUsers] = useState({});
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ✅ Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userSummary = await getUserTypeSummary();
        setUsers(userSummary?.data?.[0] || userSummary);

        const employeeList = await getPendingEmployees();
        setEmployees(employeeList.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // ✅ Filter Employees
  const filteredEmployees = employees?.filter(
    (e) =>
      e.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Paginate filtered results
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees?.slice(
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

  // ✅ Count user types
  const totalUsers = users?.totalUsers || 0;
  const superUsers = users?.superUsers || 0;
  const makers = users?.maker || 0;
  const checkers = users?.checker || 0;

  return (
    <div>
      {/* Header */}
      <div className="form-header">
        <div className="back-title flex flex-col items-center text-center sm:flex-row sm:justify-between sm:items-center sm:text-left">
          {/* Left Section */}
          <div className="header-left flex flex-col items-center sm:flex-row sm:items-center sm:gap-[10px] gap-2">
            <div className="header-icon-box">
              <Shield className="primary-color w-4 h-4" />
            </div>
            <div>
              <h1 className="user-title">User Management System</h1>
              <p className="user-subtitle">
                Monitor and manage your organization’s workforce
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center mt-3 sm:mt-0 gap-4">
            <button className="btn-count">
              <span className="w-2 h-2 rounded-full bg-[#04CF6A] plus"></span>
              {totalUsers} Active Users
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="table-card hover-card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm text-gray-400">Total Users</h2>
            <Users className="w-4 h-4 primary-color" />
          </div>
          <p className="text-2xl font-bold">{totalUsers}</p>
          <span className="text-xs primary-color"> ↑ Active</span>
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
        <div className="table-header flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-center sm:text-left">
          {/* Left (Title + Icon) */}
          <div className="flex items-center gap-2 primary-color">
            <Users className="w-4 h-4" />
            <p className="user-table-header">User Directory</p>
          </div>

          {/* Right (Subtext) */}
          <p className="table-subtext">
            {totalUsers} Total Users • {superUsers} Super Users
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-stretch sm:items-center gap-2 w-full sm:w-auto mb-4">
          {/* Search Bar */}
          <div className="relative flex items-center w-full sm:w-60">
            <Search size="14" className="absolute left-3 top-2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-approval"
            />
          </div>

          {/* Button */}
          <div className="flex justify-center sm:justify-start w-full sm:w-auto">
            <button className="btn-toggle" onClick={exportPDF}>
              <Download color="black" className="w-4 h-4 mr-1" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>User Name</th>
                <th>Email ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees?.length > 0 ? (
                paginatedEmployees.map((e, i) => (
                  <tr key={i}>
                    <td>{e.empId}</td>
                    <td>{e.userName}</td>
                    <td>{e.email}</td>
                    <td>
                      <p
                        className={`px-2 my-1 inline-block py-1 text-[10px] rounded ${getStatusClass(
                          e.status
                        )}`}
                      >
                        {getStatusLabel(e.status)}
                      </p>
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
        <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-between items-center mt-4 px-4 gap-3">
          {/* Prev Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm w-full sm:w-auto justify-center ${
              currentPage === 1
                ? "prev-next-disabled-btn"
                : "prev-next-active-btn"
            }`}
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" /> Prev
          </button>

          {/* Page Numbers */}
          <div className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
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
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm ${
                    currentPage === page
                      ? "active-pagination-btn"
                      : "inactive-pagination-btn"
                  }`}
                >
                  {page}
                </button>
              ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm w-full sm:w-auto justify-center ${
              currentPage === totalPages
                ? "prev-next-disabled-btn"
                : "prev-next-active-btn"
            }`}
          >
            Next <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
