import React, { useEffect, useState } from "react";
import "../../styles/styles.css";
import {
  Eye,
  FileText,
  Search,
  SquarePen,
  Save,
  EyeOff,
  ArrowLeft,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const KYCReviewQueue = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  // ✅ Add search + pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch(`${API_BASE_URL}/fes/api/Export/customer_Kyc_dashboard_export`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((item) => ({
          id: item.serialNo,
          serialNo: item.serialNo,
          customerName: item.customerName,
          submitDate: new Date(item.submitDate).toLocaleDateString(), // Formatting the date
          status: item.status,
          risk: item.riskCategory,
          documents: item.documents,
        }));
        setCustomers(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch customers:", err);
        setLoading(false);
      });
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.text("KYC Review Queue", 14, 15);

    // Create table
    autoTable(doc, {
      startY: 25,
      head: [
        [
          "KYC ID",
          "Customer Name",
          "Submit Date",
          "Status",
          "Documents",
          "Risk Score",
        ],
      ],
      body: filteredCustomers.map((cust) => [
        cust.serialNo,
        cust.customerName,
        cust.submitDate,
        cust.status,
        cust.documents,
        cust.risk,
      ]),
    });

    // Save file
    doc.save("kyc_review_queue.pdf");
  };

  // ✅ Filter customers by search
  const filteredCustomers = customers.filter(
    (cust) =>
      cust.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // cust.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // cust.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.id.toString().includes(searchTerm)
  );

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return <p>Loading recent customers...</p>;
  if (customers.length === 0) return <p>No customers found.</p>;
  // Status label formatter
  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "pending":
        return "Pending";
      default:
        return status || "Unknown";
    }
  };

  // Status class mapper
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "checker"; // green
      case "rejected":
        return "superuser"; // red
      case "pending":
        return "infra"; // yellow
      default:
        return "maker"; // gray
    }
  };

  // Risk class mapper
  const getRiskClass = (risk) => {
    switch (risk?.toLowerCase()) {
      case "high":
        return "superuser"; // red
      case "medium":
        return "maker"; // orange
      case "low":
        return "checker"; // green
      default:
        return "infra"; // yellow/neutral
    }
  };

  return (
    <div className="rc-wrapper corner-box mt-[18px]">
      {/* Header with title + search */}
      <div className="rc-header flex justify-between items-center">
        <h3 className="rc-title flex items-center gap-2">KYC Review Queue</h3>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {/* Search */}
          <div className="search-box relative">
            <Search className="absolute left-3 top-2 text-gray-400 w-3 h-3" />
            <input
              type="text"
              className="search-input pl-8"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Export PDF */}
          <button className="filter-btn" onClick={exportPDF}>
            <Download className="filter-icon" />
            Export PDF
          </button>
        </div>
        {/* <div className="search-box relative">
          <Search className="absolute left-3 top-2 text-gray-400 w-3 h-3" />
          <input
            type="text"
            className="search-input pl-8"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div> */}
      </div>

      {/* Table wrapper */}
      <div className="table-wrapper">
        <table className="rc-table w-full text-left">
          <thead className="rc-thead">
            <tr className="rc-tr-head">
              <th className="rc-th">KYC ID</th>
              <th className="rc-th">Customer Name</th>
              <th className="rc-th">Submit Date</th>
              <th className="rc-th">Status</th>
              <th className="rc-th">Documents</th>
              <th className="rc-th">Risk Score</th>
              {/* <th className="rc-th">Priority</th> */}
              {/* <th className="rc-th">	Actions</th> */}
            </tr>
          </thead>
          <tbody className="rc-tbody">
            {paginatedCustomers.length > 0 ? (
              paginatedCustomers.map((cust, i) => (
                <tr className="rc-tr-body" key={cust.serialNo || i}>
                  <td className="rc-id">{cust.serialNo}</td>
                  <td>
                    <div className="rc-info">
                      <div className="rc-name">{cust.customerName}</div>
                    </div>
                  </td>
                  <td>
                    <span>{cust.submitDate}</span>
                  </td>
                  <td>
                    <span>{cust.status}</span>
                  </td>
                  <td>
                    <span>{cust.documents}</span>
                  </td>
                  <td>
                    <span
                      className={`px-2 py-1 text-[12px] rounded ${getRiskClass(
                        cust.risk
                      )}`}
                    >
                      {cust.risk}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 px-4">
        {/* Prev Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm ${
            currentPage === 1
              ? "bg-[#1c2b45] text-gray-500 cursor-not-allowed"
              : "bg-[#0a1625] text-white hover:primary-color"
          }`}
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>

        {/* Page Numbers (show only current, prev, next) */}
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
                    ? "primary-bg text-black font-bold"
                    : "bg-[#1c2b45] text-white hover:primary-color"
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
          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm ${
            currentPage === totalPages
              ? "bg-[#1c2b45] text-gray-500 cursor-not-allowed"
              : "bg-[#0a1625] text-white hover:primary-color"
          }`}
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default KYCReviewQueue;
