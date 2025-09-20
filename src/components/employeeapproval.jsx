import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  EyeIcon,
  FileText,
  Filter,
  Search,
  SquarePen,
  User2Icon,
  UserCheck2Icon,
} from "lucide-react";
import EmployeeView from "./employeeview";
import { paginationStyle } from "../constants";

export default function EmployeeApproval() {
  const [configurations, setConfigurations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgramType, setSelectedProgramType] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const itemsPerPage = 8;

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/fes/api/Export/pending-employees`
      );
      setConfigurations(res.data);
    } catch (err) {
      console.error("Error fetching configurations:", err);
    }
  };

  // ✅ Filter + Search logic
  const filteredConfigurations = configurations.filter((cfg) => {
    if (cfg.status !== 1) return false; // Only include pending employees

    const query = searchQuery.toLowerCase();
    const matchesSearch = Object.values(cfg).some(
      (value) => value && value.toString().toLowerCase().includes(query)
    );

    const matchesProgramType =
      !selectedProgramType ||
      cfg.programType?.toLowerCase() === selectedProgramType.toLowerCase();

    const matchesPriority =
      !selectedPriority ||
      cfg.priority?.toLowerCase() === selectedPriority.toLowerCase();

    return matchesSearch && matchesProgramType && matchesPriority;
  });

  const totalPages = Math.ceil(filteredConfigurations.length / itemsPerPage);

  const paginatedConfigurations = filteredConfigurations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusLabel = (value) => {
    switch (value) {
      case 0:
        return "Approved";
      case 1:
        return "Pending";
      case 2:
        return "Disapproved";
      case 3:
        return "Recheck";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="config-forms">
      {selectedEmployee ? (
        <>
          <EmployeeView
            selectedEmployee={selectedEmployee}
            setSelectedEmployee={setSelectedEmployee}
            fetchConfigurations={fetchConfigurations}
          />
        </>
      ) : (
        <>
          {/* Header */}
          <div className="card-header">
            <div className="card-header-left">
              <div className="flex items-center gap-[10px]">
                <div className="header-icon-box">
                  <UserCheck2Icon className="primary-color w-4 h-4" />
                </div>
              </div>
              <div>
                <h1 className="header-title">Employee Approvals</h1>
                <p className="header-subtext">
                  Review and approve employee configurations
                </p>
              </div>
            </div>
            <div className="card-header-right">
              <div className="portal-info">
                <p className="portal-label">{configurations.length} total</p>
                <p className="portal-link">Checker Portal</p>
              </div>
            </div>
          </div>

          {/* Filters & Pagination */}
          <div className="tables-search-card rounded-xl p-3 flex flex-col gap-3 mt-6">
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="search-box relative">
                <Search className="absolute left-3 top-2 text-gray-400 w-3 h-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="search-input-approval"
                  placeholder="Search employees..."
                />
              </div>

              {/* Reset Filters */}
              <button
                onClick={() => {
                  setSelectedProgramType("");
                  setSelectedPriority("");
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="filter-btn"
              >
                <Filter className="filter-icon" />
                Reset
              </button>
            </div>

            {/* Pagination */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-6 h-6 flex items-center justify-center rounded-md transition ${
                  currentPage === 1
                    ? "bg-[#0f131d] text-gray-500 cursor-not-allowed"
                    : "bg-[#0f131d] text-white hover:border hover:border-[var(--primary-color)]"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className={paginationStyle}>{currentPage}</span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-6 h-6 flex items-center justify-center rounded-md transition ${
                  currentPage === totalPages
                    ? "bg-[#0f131d] text-gray-500 cursor-not-allowed"
                    : "bg-[#0f131d] text-white hover:border hover:border-[var(--primary-color)]"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="table-card mt-[18px]">
            <div className="table-header">
              <p className="table-title">
                <UserCheck2Icon className="w-5 h-5" />
                Pending Employee Approvals
              </p>
            </div>

            <div className="table-wrapper mt-5">
              <table className="w-full text-left">
                <thead className="table-head">
                  <tr>
                    <th className="table-cell">ID</th>
                    <th className="table-cell">NAME</th>
                    <th className="table-cell">EMAIL</th>
                    <th className="table-cell">DEPARTMENT</th>
                    <th className="table-cell">DESIGNATION</th>
                    <th className="table-cell">ROLE</th>
                    <th className="table-cell">USER STATUS</th>
                    <th className="table-cell">REMARKS</th>
                    <th className="table-cell">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedConfigurations.length > 0 ? (
                    paginatedConfigurations.map((cfg, idx) => (
                      <tr key={idx} className="table-row">
                        <td className="table-content">{cfg.empId}</td>
                        <td className="table-content">{cfg.userName}</td>
                        <td className="table-content">{cfg.email}</td>
                        <td className="table-content">{cfg.deptName}</td>
                        <td className="table-content">{cfg.designationDesc}</td>
                        <td className="table-content">{cfg.roleDescription}</td>
                        <td>
                          <span
                            className={`px-2 py-1 rounded text-[10px] ${
                              cfg.status === 0
                                ? "checker"
                                : cfg.status === 1
                                ? "infra"
                                : cfg.status === 2
                                ? "superuser"
                                : "maker"
                            }`}
                          >
                            {getStatusLabel(cfg.status)}
                          </span>
                        </td>
                        <td className="table-content">{cfg.remarks || "-"}</td>
                        <td className="table-content flex gap-2">
                          <button
                            className="header-icon-box"
                            onClick={() => setSelectedEmployee(cfg)}
                          >
                            <EyeIcon className="primary-color w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="9"
                        className="text-center py-4 text-gray-500"
                      >
                        No employees found for Approval.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
