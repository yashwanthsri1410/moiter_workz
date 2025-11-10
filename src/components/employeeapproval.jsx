import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  EyeIcon,
  Filter,
  Search,
  UserCheck2Icon,
} from "lucide-react";
import EmployeeView from "./employeeview";
import { paginationStyle } from "../constants";
import { getPendingEmployeeData } from "../services/service";

export default function EmployeeApproval() {
  const [configurations, setConfigurations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgramType, setSelectedProgramType] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const itemsPerPage = 8;

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      const res = await getPendingEmployeeData();
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
    <>
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
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="header-icon-box">
                <UserCheck2Icon className="primary-color w-4 h-4" />
              </div>
              <div>
                <h1 className="user-title">Employee Approvals</h1>
                <p className="user-subtitle text-nowrap">
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
          <div className="tables-search-card rounded-xl p-3 flex flex-col gap-3 items-center md:items-start mt-6">
            {/* Search + Reset */}
            <div
              className="flex flex-col items-center md:items-start md:flex-row gap-2 w-full"
              style={{ alignItems: "center" }}
            >
              {/* Search */}
              <div className=" relative flex-1">
                <Search
                  size="14"
                  className="absolute left-3 top-2 text-gray-400"
                />
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
                className="reset-btn"
              >
                <Filter className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center md:justify-start gap-2 w-full">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-6 h-6 flex items-center justify-center rounded-md transition ${currentPage === 1
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
                className={`w-6 h-6 flex items-center justify-center rounded-md transition ${currentPage === totalPages
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
              <div className="flex items-center gap-2 primary-color">
                <UserCheck2Icon className="w-4 h-4" />
                <p className="user-table-header">Pending Employee Approvals</p>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>DEPARTMENT</th>
                    <th>DESIGNATION</th>
                    <th>ROLE</th>
                    <th>USER STATUS</th>
                    <th>REMARKS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedConfigurations.length > 0 ? (
                    paginatedConfigurations.map((cfg, idx) => (
                      <tr key={idx}>
                        <td>{cfg.empId}</td>
                        <td>{cfg.userName}</td>
                        <td>{cfg.email}</td>
                        <td>{cfg.deptName}</td>
                        <td>{cfg.designationDesc}</td>
                        <td>{cfg.roleDescription}</td>
                        <td>
                          <span
                            className={`px-2 py-1 rounded text-[10px] ${cfg.status === 0
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
                        <td>{cfg.remarks || "-"}</td>
                        <td className="table-content">
                          <div className="flex gap-2">
                            <button
                              className="header-icon-box"
                              onClick={() => setSelectedEmployee(cfg)}
                            >
                              <EyeIcon className="primary-color w-4 h-4" />
                            </button>
                          </div>
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
    </>
  );
}
