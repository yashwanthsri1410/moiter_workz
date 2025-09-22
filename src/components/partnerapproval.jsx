import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  EyeIcon,
  Power,
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  CalculatorIcon,
  Filter,
} from "lucide-react";
import Partnerview from "../components/partnerview";
import { paginationStyle } from "../constants";

export default function PartnerApproval() {
  const [partners, setPartners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPartner, setSelectedPartner] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // ✅ Fetch partner data
  useEffect(() => {
    fetchPartners();
  }, []);
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
  const fetchPartners = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/fes/api/Export/partner_summary_export`
      );
      setPartners(res.data);
      // console.log(typeof res.data, res.data);
    } catch (err) {
      console.error("Error fetching partners:", err);
    }
  };

  // ✅ Search filter
  const filteredPartners = partners.filter((partner) => {
    if (partner.status !== 1) return false; // ✅ only show partners with status 1

    return Object.values(partner).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // ✅ Pagination
  const totalPages = Math.ceil(filteredPartners.length / itemsPerPage);
  const paginatedPartners = filteredPartners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  return (
    <div className="config-forms">
      {selectedPartner ? (
        <>
          <Partnerview
            selectedPartner={selectedPartner}
            setSelectedPartner={setSelectedPartner}
            fetchPartners={fetchPartners}
          />
        </>
      ) : (
        <>
          {/* Header */}
          <div className="card-header flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4">
            {/* Left Section */}
            <div className="card-header-left flex items-center gap-3 text-center sm:text-left">
              <div className="header-icon-box flex-shrink-0">
                <CalculatorIcon className="primary-color w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h1 className="header-title text-[14px] sm:text-lg font-semibold">
                  Pending Partner Applications
                </h1>
                <p className="header-subtext text-[12px] sm:text-sm text-gray-400">
                  Review and manage partner onboarding
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="card-header-right text-center sm:text-right">
              <div className="portal-info">
                <p className="portal-label text-[13px] sm:text-[15px] font-medium  text-center sm:text-right">
                  {partners.length} total
                </p>
                <p className="portal-link text-[12px] sm:text-sm text-[#00d4aa] cursor-pointer">
                  Checker Portal
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          {/* <div className="bg-[#0c0f16] border border-[#1a1f2e] rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6">
            
            <div className="search-box relative flex-1 w-full md:w-auto">
              <Search className="absolute left-3 top-2 text-gray-400 w-3 h-3 md:w-4 md:h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); 
                }}
                className="search-input-approval w-full md:w-64 pl-8 py-1 text-sm md:text-base"
                placeholder="Search configurations..."
              />
            </div>

           
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-md transition ${
                  currentPage === 1
                    ? "bg-[#0f131d] text-gray-500 cursor-not-allowed"
                    : "bg-[#0f131d] text-white hover:border hover:border-[#00d4aa]"
                }`}
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>

              <span className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-md bg-[#00d4aa] text-black text-[12px] sm:text-[14px]">
                {currentPage}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-md transition ${
                  currentPage === totalPages
                    ? "bg-[#0f131d] text-gray-500 cursor-not-allowed"
                    : "bg-[#0f131d] text-white hover:border hover:border-[#00d4aa]"
                }`}
              >
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div> */}
          <div className="tables-search-card rounded-xl p-3 flex flex-col gap-3 items-center md:items-start mt-6">
            {/* Search + Reset */}
            <div className="flex flex-col items-center md:items-start md:flex-row gap-2 w-full">
              {/* Search Box */}
              <div className="search-box relative flex-1 w-full md:w-auto">
                <Search className="absolute left-3 top-2 text-gray-400 w-3 h-3 md:w-4 md:h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="search-input-approval !w-full md:w-64 pl-8 py-1 text-sm md:text-base"
                  placeholder="Search configurations..."
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
                <Filter className="filter-icon w-3 h-3 md:w-4 md:h-4" />
                Reset
              </button>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center md:justify-start gap-2 w-full">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-md transition ${
                  currentPage === 1
                    ? "bg-[#0f131d] text-gray-500 cursor-not-allowed"
                    : "bg-[#0f131d] text-white hover:border hover:border-[var(--primary-color)]"
                }`}
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>

              <span className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-md bg-[#00d4aa] text-black text-[12px] sm:text-[14px]">
                {currentPage}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-md transition ${
                  currentPage === totalPages
                    ? "bg-[#0f131d] text-gray-500 cursor-not-allowed"
                    : "bg-[#0f131d] text-white hover:border hover:border-[var(--primary-color)]"
                }`}
              >
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="table-card mt-[18px]">
            <div className="table-header">
              <p className="table-title">
                <CalculatorIcon className="w-5 h-5" />
                Pending Partner Applications
              </p>
            </div>

            {/* <div className="table-wrapper mt-5">
              <table className="w-full text-left">
                <thead className="table-head">
                  <tr>
                    <th className="table-cell">Partner Name</th>
                    <th className="table-cell">Partner Type</th>
                    <th className="table-cell">KYC Status</th>
                    <th className="table-cell">Partner Status</th>
                    <th className="table-cell">Status</th>
                    <th className="table-cell">Remarks</th>
                   
                    <th className="table-cell">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPartners.map((partner, idx) => (
                    <tr key={idx} className="table-row">
                      <td className="table-content text-[#00d4aa]">
                        {partner.partnerName}
                      </td>
                      <td className="table-content">{partner.partnerType}</td>
                      <td className="table-content">
                        <span
                          className={`px-2 py-1 rounded text-[10px] ${
                            partner.kycStatus === "Verified"
                              ? "checker"
                              : partner.kycStatus === "Pending"
                              ? "infra"
                              : partner.kycStatus === "Rejected"
                              ? "superuser"
                              : partner.kycStatus === "Pending"
                              ? "maker"
                              : ""
                          }`}
                        >
                          {partner.kycStatus}
                        </span>
                      </td>
                      <td className="table-content">
                        <span className="px-2 py-1 rounded text-[10px] ">
                          {partner.partnerStatus}
                        </span>
                      </td>
                      <td className="table-content">
                        <span
                          className={`px-2 py-1 rounded text-[10px] ${
                            partner.kycStatus === 0
                              ? "checker"
                              : partner.status === 1
                              ? "infra"
                              : partner.status === 2
                              ? "superuser"
                              : partner.status === 3
                              ? "maker"
                              : ""
                          }`}
                        >
                          {getStatusLabel(partner.status)}
                        </span>
                      </td>
                      <td className="table-content">
                        {partner.remarks || "-"}
                      </td>
                      {/* <td className="table-content">
                                            <span
                                                className={`w-[70px] gap-[5px] flex items-center px-2 py-1 rounded text-[10px] leading-none ${partner.portalAccessEnabled ? "checker" : "superuser"
                                                    }`}
                                            >
                                                <Power className="w-3 h-3" />
                                                {partner.portalAccessEnabled ? "Enabled" : "Disabled"}
                                            </span>
                                        </td> 
                      <td className="table-content">
                        <button
                          className="header-icon-box"
                          onClick={() => setSelectedPartner(partner)}
                        >
                          <EyeIcon className="primary-color w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginatedPartners.length === 0 && (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-4 text-gray-500"
                      >
                        No partners found for Approval.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div> */}

            <div className="table-wrapper mt-5 overflow-x-auto table-scrollbar">
              <table className="w-full text-left min-w-[700px]">
                <thead className="table-head">
                  <tr>
                    <th className="table-cell">Partner Name</th>
                    <th className="table-cell">Partner Type</th>
                    <th className="table-cell">KYC Status</th>
                    <th className="table-cell">Partner Status</th>
                    <th className="table-cell">Status</th>
                    <th className="table-cell">Remarks</th>
                    <th className="table-cell">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPartners.map((partner, idx) => (
                    <tr key={idx} className="table-row">
                      <td className="table-content text-[#00d4aa] text-sm sm:text-base">
                        {partner.partnerName}
                      </td>
                      <td className="table-content text-sm sm:text-base">
                        {partner.partnerType}
                      </td>
                      <td className="table-content">
                        <span
                          className={`px-2 py-1 rounded text-[10px] sm:text-xs ${
                            partner.kycStatus === "Verified"
                              ? "checker"
                              : partner.kycStatus === "Pending"
                              ? "infra"
                              : partner.kycStatus === "Rejected"
                              ? "superuser"
                              : partner.kycStatus === "Pending"
                              ? "maker"
                              : ""
                          }`}
                        >
                          {partner.kycStatus}
                        </span>
                      </td>
                      <td className="table-content text-[10px] sm:text-xs">
                        <span className="px-2 py-1 rounded">
                          {partner.partnerStatus}
                        </span>
                      </td>
                      <td className="table-content text-[10px] sm:text-xs">
                        <span
                          className={`px-2 py-1 rounded ${
                            partner.status === 0
                              ? "checker"
                              : partner.status === 1
                              ? "infra"
                              : partner.status === 2
                              ? "superuser"
                              : partner.status === 3
                              ? "maker"
                              : ""
                          }`}
                        >
                          {getStatusLabel(partner.status)}
                        </span>
                      </td>
                      <td className="table-content text-sm sm:text-base">
                        {partner.remarks || "-"}
                      </td>
                      <td className="table-content text-sm sm:text-base">
                        <button
                          className="header-icon-box"
                          onClick={() => setSelectedPartner(partner)}
                        >
                          <EyeIcon className="text-[#00d4aa] w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginatedPartners.length === 0 && (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-4 text-gray-500 text-sm sm:text-base"
                      >
                        No partners found for Approval.
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
