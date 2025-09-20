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
          <div className="card-header flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            {/* Left section */}
            <div className="card-header-left flex items-center gap-3 justify-center sm:justify-start">
              <div className="header-icon-box">
                <UserCheck2Icon className="text-[#00d4aa] w-4 h-4" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="header-title">Employee Approvals</h1>
                <p className="header-subtext">
                  Review and approve employee configurations
                </p>
              </div>
            </div>

            {/* Right section */}
            <div className="card-header-right flex justify-center sm:justify-end w-full">
              <div className="portal-info text-center sm:text-right">
                <p className="portal-label text-center sm:text-right">
                  {configurations.length} total
                </p>
                <p className="portal-link">Checker Portal</p>
              </div>
            </div>
          </div>

          {/* Filters & Pagination */}
          <div className="bg-[#0c0f16] border border-[#1a1f2e] rounded-xl p-3 flex flex-col gap-3 items-center md:items-start mt-2.5">
            {/* Search + Reset */}
            <div
              className="flex flex-col items-center md:items-start md:flex-row gap-2 w-full"
              style={{ alignItems: "center" }}
            >
              {/* Search */}
              <div className="search-box relative flex-1">
                <Search className="absolute left-3 top-2 text-gray-400 w-3 h-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="search-input-approval !w-full md:w-auto"
                  placeholder="Search employees..."
                />
              </div>

              {/* Reset Filters */}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="filter-btn flex items-center gap-1 px-3 py-1 shrink-0 max-w-[100px] md:max-w-none"
              >
                <Filter className="filter-icon w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center md:justify-start gap-2 w-full">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-6 h-6 flex items-center justify-center rounded-md transition ${
                  currentPage === 1
                    ? "bg-[#0f131d] text-gray-500 cursor-not-allowed"
                    : "bg-[#0f131d] text-white hover:border hover:border-[#00d4aa]"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="w-6 h-6 flex items-center justify-center rounded-md bg-[#00d4aa] text-black text-[12px]">
                {currentPage}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-6 h-6 flex items-center justify-center rounded-md transition ${
                  currentPage === totalPages
                    ? "bg-[#0f131d] text-gray-500 cursor-not-allowed"
                    : "bg-[#0f131d] text-white hover:border hover:border-[#00d4aa]"
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

            <div className="table-wrapper mt-5 overflow-x-auto table-scrollbar">
              <table className="w-full text-left min-w-[800px]">
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
                        <td className="table-content">
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
                            <EyeIcon className="text-[#00d4aa] w-4 h-4" />
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
