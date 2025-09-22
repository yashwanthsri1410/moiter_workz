import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  EyeIcon,
  FileText,
  Filter,
  PackagePlus,
  Power,
  Search,
} from "lucide-react";
import Productview from "./productview";
import { paginationStyle } from "../constants";

export default function ProductApproval() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [configurations, setConfigurations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgramType, setSelectedProgramType] = useState(""); // filter state
  const [selectedPriority, setSelectedPriority] = useState(""); // filter state
  const [id, setid] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null); // ✅ New
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  // filter data by search + dropdowns
  const filteredConfigurations = configurations.filter((cfg) => {
    if (cfg.status !== 1) return false; // ✅ only show pending items

    const matchesSearch = Object.values(cfg).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );

    const matchesProgramType =
      !selectedProgramType ||
      cfg.programType?.toLowerCase() === selectedProgramType.toLowerCase();

    const matchesPriority =
      !selectedPriority ||
      cfg.priority?.toLowerCase() === selectedPriority.toLowerCase();

    return matchesSearch && matchesProgramType && matchesPriority;
  });

  // compute total pages (based on filtered results)
  const totalPages = Math.ceil(filteredConfigurations.length / itemsPerPage);

  // compute paginated data
  const paginatedConfigurations = filteredConfigurations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/fes/api/Export/product_Config_export`
      );
      setConfigurations(res.data);
    } catch (err) {
      console.error("Error fetching configurations:", err);
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

  const getproductacessLabel = (value) => {
    switch (value) {
      case 1:
        return "Enable";
      case 2:
        return "Disable";
      default:
        return "Unknown";
    }
  };
  const submitAction = async (cfg) => {
    try {
      const newProductAccess = cfg.productAccess === 1 ? 2 : 1;

      const payload = {
        productId: cfg.id,
        actionStatus: 0,
        checker: "checkerUser",
        remarks: "remarks",
        productAccess: newProductAccess,
      };

      await axios.post(
        `${API_BASE_URL}/ps/approveProductConfiguration`,
        payload
      );

      alert("Action submitted successfully!");
    } catch (err) {
      console.error("Error submitting action:", err);
      alert("Failed to submit action");
    }
  };
  return (
    <div className="config-forms">
      {selectedProduct ? (
        <>
          <Productview
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            fetchConfigurations={fetchConfigurations}
          />
        </>
      ) : (
        <>
          <div className="card-header flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            {/* Left section */}
            <div className="card-header-left flex items-center gap-3 justify-center sm:justify-start">
              <div className="header-icon-box">
                <PackagePlus className="primary-color w-4 h-4" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="header-title">Product Approvals</h1>
                <p className="header-subtext">
                  Review and approve product configurations
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

          <div className="tables-search-card rounded-xl p-3 flex flex-col gap-3 mt-6">
            {/* Top row: Search + Filters */}
            <div
              className="flex flex-col md:flex-row md:items-center gap-2 w-full"
              style={{ alignItems: "center" }}
            >
              {/* Search Box */}
              <div className="search-box relative flex-1 w-full md:w-auto">
                <Search className="absolute left-3 top-2 text-gray-400 w-3 h-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // reset to page 1 when searching
                  }}
                  className="search-input-approval !w-full md:w-auto"
                  placeholder="Search configurations..."
                />
              </div>

              {/* Program Type Filter */}
              <div className="form-group w-full md:w-auto">
                <select
                  name="programType"
                  value={selectedProgramType}
                  onChange={(e) => {
                    setSelectedProgramType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="form-input w-full md:w-auto"
                >
                  <option value="">All Program Types</option>
                  <option value="Closed">Closed</option>
                  <option value="Open">Open</option>
                  <option value="Semi-Closed">Semi-Closed</option>
                </select>
              </div>

              {/* Reset Filters */}
              <button
                onClick={() => {
                  setSelectedProgramType("");
                  setSelectedPriority("");
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
            <div className="flex items-center justify-center md:justify-start gap-2 w-full mt-2">
              {/* Prev Button */}
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

              {/* Active Page */}
              <span className="w-6 h-6 flex items-center justify-center rounded-md bg-[#00d4aa] text-black text-[12px]">
                {currentPage}
              </span>

              {/* Next Button */}
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
                <PackagePlus className="w-5 h-5" />
                Pending Product Approvals
              </p>
            </div>

            <div className="table-wrapper mt-5 overflow-x-auto table-scrollbar">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="table-head sticky top-0 bg-[#0c0f16] z-10">
                  <tr>
                    <th className="table-cell">ID</th>
                    <th className="table-cell">Configuration Name</th>
                    <th className="table-cell">Program Type</th>
                    <th className="table-cell">Sub Category</th>
                    <th className="table-cell">Status</th>
                    <th className="table-cell">Remarks</th>
                    {/* <th className="table-cell">Product Accessibility</th> */}
                    <th className="table-cell">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedConfigurations.length > 0 ? (
                    paginatedConfigurations.map((cfg, idx) => (
                      <tr key={cfg.productId || idx} className="table-row">
                        <td className="table-content primary-color whitespace-nowrap">
                          {cfg.productId}
                        </td>
                        <td className="table-content whitespace-nowrap">
                          {cfg.productName}
                        </td>
                        <td className="table-content whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded text-[10px] ${
                              cfg.programType === "Closed"
                                ? "checker"
                                : cfg.programType === "Semi-Closed"
                                ? "infra"
                                : cfg.programType === "Open"
                                ? "superuser"
                                : cfg.programType === "open"
                                ? "maker"
                                : ""
                            }`}
                          >
                            {cfg.programType}
                          </span>
                        </td>
                        <td className="table-content whitespace-nowrap">
                          {cfg.subCategory}
                        </td>
                        <td className="table-content whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded text-[10px] ${
                              cfg.status === 0
                                ? "checker"
                                : cfg.status === 1
                                ? "infra"
                                : cfg.status === 2
                                ? "superuser"
                                : cfg.status === 3
                                ? "maker"
                                : ""
                            }`}
                          >
                            {getStatusLabel(cfg.status)}
                          </span>
                        </td>
                        <td className="table-content whitespace-nowrap">
                          {cfg.remarks || "-"}
                        </td>

                        {/* Product Accessibility (optional) */}
                        {/* <td>
              <span
                className={`w-[70px] gap-[5px] flex items-center px-2 py-1 rounded text-[10px] leading-none ${
                  cfg.productAccess === 1
                    ? "checker"
                    : cfg.productAccess === 2
                    ? "superuser"
                    : ""
                }`}
                onClick={() => {
                  submitAction(cfg);
                  setid(cfg?.productId);
                }}
              >
                <Power className="w-3 h-3" />
                {getproductacessLabel(cfg.productAccess)}
              </span>
            </td> */}

                        <td className="table-content flex gap-2">
                          <button
                            className="header-icon-box"
                            onClick={() => setSelectedProduct(cfg)}
                          >
                            <EyeIcon className="primary-color w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-4 text-gray-500"
                      >
                        No products found for Approval.
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
