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
} from "lucide-react";

const RecentCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Add search + pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch("http://192.168.22.247/fes/api/Export/customer_dashboard_export")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((item) => ({
          id: item.serialNo,
          name: item.fullName,
          email: item.email,
          phone: item.mobileNumber,
          kyc: item.kycStatus,
          risk: item.riskCategory,
          activity: item.lastActivity,
        }));
        setCustomers(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch customers:", err);
        setLoading(false);
      });
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

  return (
    <div className="rc-wrapper corner-box mt-[18px]">
      {/* Header with title + search */}
      <div className="rc-header flex justify-between items-center">
        <h3 className="rc-title flex items-center gap-2">Recent Customers</h3>
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
      </div>

      {/* Table wrapper */}
      <div className="table-wrapper">
        <table className="rc-table w-full text-left">
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
                      className={`rc-badge rc-kyc-${cust.kyc.toLowerCase()}`}
                    >
                      {cust.kyc}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`rc-badge rc-risk-${cust.risk.toLowerCase()}`}
                    >
                      {cust.risk}
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
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded-lg text-sm ${
                currentPage === i + 1
                  ? "bg-[#00d4aa] text-black font-bold"
                  : "bg-[#1c2b45] text-white hover:text-[#00d4aa]"
              }`}
            >
              {i + 1}
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
  );
};

export default RecentCustomer;
