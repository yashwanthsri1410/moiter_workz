import React, { useEffect, useState } from "react";
import "../../styles/styles.css";
import { Search, ChevronLeft, ChevronRight, Download } from "lucide-react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";

const RecentCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Search + pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/fes/api/Export/customer_dashboard_export`
        );
        const data = res.data;

        if (Array.isArray(data)) {
          const mapped = data.map((item) => ({
            id: item.serialNo,
            name: item.fullName,
            email: item.email,
            phone: item.mobileNumber,
            kyc: item.kycStatus,
            risk: item.riskCategory,
            activity: item.lastActivity,
          }));
          const removedDuplicates = mapped?.filter(
            (obj, index, self) =>
              index ===
              self.findIndex(
                (t) =>
                  t.name === obj.name &&
                  t.email === obj.email &&
                  t.phone === obj.phone
              )
          );
          setCustomers(removedDuplicates);
        }
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // ✅ Filter customers by search
  const filteredCustomers = customers.filter(
    (cust) =>
      cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.id.toString().includes(searchTerm)
  );

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  // 🔹 If searching, show ALL filtered results (ignore pagination)
  const paginatedCustomers =
    searchTerm.trim() !== ""
      ? filteredCustomers
      : filteredCustomers.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // ✅ Export PDF function
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Recent Customers", 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [
        [
          "Customer ID",
          "Name",
          "Email",
          "Phone",
          "KYC",
          "Risk",
          "Last Activity",
        ],
      ],
      body: filteredCustomers.map((cust) => [
        cust.id,
        cust.name,
        cust.email,
        cust.phone,
        cust.kyc,
        cust.risk,
        cust.activity,
      ]),
    });
    doc.save("recent_customers.pdf");
  };

  if (loading) return <p>Loading recent customers...</p>;
  if (customers.length === 0) return <p>No customers found.</p>;

  // 🔹 KYC status labels + classes
  const getKycLabel = (kyc) => {
    switch (kyc?.toLowerCase()) {
      case "approved":
        return "Approved";
      case "pending":
        return "Pending";
      case "rejected":
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const getKycClass = (kyc) => {
    switch (kyc?.toLowerCase()) {
      case "approved":
        return "checker"; // green
      case "pending":
        return "infra"; // yellow
      case "rejected":
        return "superuser"; // red
      default:
        return "maker"; // gray
    }
  };

  // 🔹 Risk level labels + classes
  const getRiskLabel = (risk) => {
    switch (risk?.toLowerCase()) {
      case "low":
        return "Low";
      case "medium":
        return "Medium";
      case "high":
        return "High";
      default:
        return "Unknown";
    }
  };

  const getRiskClass = (risk) => {
    switch (risk?.toLowerCase()) {
      case "low":
        return "checker"; // green
      case "medium":
        return "infra"; // yellow
      case "high":
        return "superuser"; // red
      default:
        return "maker"; // gray
    }
  };

  return (
    <div className="rc-wrapper corner-box mt-[18px]">
      {/* ✅ Header with title + search + export */}
   <div className="rc-header flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
  {/* Heading */}
  <h3 className="rc-title text-lg font-semibold text-[#00d4aa]">
    Recent Customers
  </h3>

  {/* Search + Export container */}
  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
    {/* Search Bar */}
    <div className="flex items-center bg-[#0a1625] px-3 py-2 rounded-lg w-full sm:w-60">
      <Search className="w-4 h-4 text-gray-400" />
      <input
        type="text"
        placeholder="Search customers..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="bg-transparent outline-none text-sm text-white w-full ml-2"
      />
    </div>

    {/* Export Button */}
    <div className="flex justify-center sm:justify-start w-full sm:w-auto">
      <button
        onClick={exportPDF}
        className="filter-btn sm:w-auto text-center"
      >
        <Download className="filter-icon w-4 h-4 mr-1" />
        Export PDF
      </button>
    </div>
  </div>
</div>



      {/* Table */}
   <div className="w-full overflow-x-auto table-scrollbar">
  <div className="inline-block min-w-full align-middle">
    <table className="min-w-[700px] text-sm text-left border-collapse">
        
          <thead className="rc-thead">
            <tr className="rc-tr-head">
              <th className="rc-th">Customer ID</th>
              <th className="rc-th">Name & Contact</th>
              <th className="rc-th">KYC Status</th>
              <th className="rc-th">Risk Level</th>
              <th className="rc-th">Last Activity</th>
            </tr>
          </thead>
          <tbody className="rc-tbody">
            {paginatedCustomers.length > 0 ? (
              paginatedCustomers.map((cust, i) => (
                <tr className="rc-tr-body" key={cust.id || i}>
                  <td className="rc-id">{cust.id}</td>
                  <td>
                    <div className="rc-info">
                      <div className="rc-name">{cust.name}</div>
                      <div className="rc-email">{cust.email}</div>
                      <div className="rc-phone">{cust.phone}</div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-[10px] ${getKycClass(
                        cust.kyc
                      )}`}
                    >
                      {getKycLabel(cust.kyc)}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-[10px] ${getRiskClass(
                        cust.risk
                      )}`}
                    >
                      {getRiskLabel(cust.risk)}
                    </span>
                  </td>

                  <td className="rc-activity">{cust.activity}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
       </div>

      {/* Pagination - only show if NOT searching */}
      {searchTerm.trim() === "" && (
            <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-between items-center mt-4 px-4 gap-3">
          {/* Prev Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm w-full sm:w-auto justify-center ${
              currentPage === 1
                ? "bg-[#1c2b45] text-gray-500 cursor-not-allowed"
                : "bg-[#0a1625] text-white hover:text-[#00d4aa]"
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
                      ? "bg-[#00d4aa] text-black font-bold"
                      : "bg-[#1c2b45] text-white hover:text-[#00d4aa]"
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
                ? "bg-[#1c2b45] text-gray-500 cursor-not-allowed"
                : "bg-[#0a1625] text-white hover:text-[#00d4aa]"
            }`}
          >
            Next <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      )}
    </div>
   
  );
};

export default RecentCustomer;
