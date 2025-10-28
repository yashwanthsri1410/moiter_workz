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
      <div className="rc-header flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        {/* Heading */}
        <h3 className="card-root-label flex items-center gap-2">
          KYC Review Queue
        </h3>

        {/* Search + Export container */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative flex items-center w-full sm:w-60">
            <Search size="14" className="absolute left-5 top-2 text-gray-400" />
            <input
              type="text"
              className="search-input-approval ml-2"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Export Button */}
          <div className="flex justify-center sm:justify-start w-full sm:w-auto">
            <button onClick={exportPDF} className="btn-toggle">
              <Download color="black" className="w-4 h-4 mr-1" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Table wrapper */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>KYC ID</th>
              <th>Customer Name</th>
              <th>Submit Date</th>
              <th>Status</th>
              <th>Documents</th>
              <th>Risk Score</th>
              {/* <th className="rc-th">Priority</th> */}
              {/* <th className="rc-th">	Actions</th> */}
            </tr>
          </thead>
          <tbody className="rc-tbody">
            {paginatedCustomers.length > 0 ? (
              paginatedCustomers.map((cust, i) => (
                <tr key={cust.serialNo || i}>
                  <td>{cust.serialNo}</td>
                  <td>{cust.customerName}</td>
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
                    <p
                      className={`px-2 py-1 inline-block text-[12px] rounded ${getRiskClass(
                        cust.risk
                      )}`}
                    >
                      {cust.risk}
                    </p>
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
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm  ${
                  currentPage === page
                    ? "active-pagination-btn"
                    : "inactive-pagination-btn"
                }`}
              >
                {page}
              </button>
            ))}
        </div>

        {/* <div className="flex gap-2">
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
        </div> */}

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
  );
};

export default KYCReviewQueue;
