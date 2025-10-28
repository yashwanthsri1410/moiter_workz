import React, { useState } from "react";
import {
  MoreHorizontal,
  Smartphone,
  CreditCard,
  Monitor,
  ShoppingCart,
  MapPin,
  EyeIcon,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "../../styles/styles.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ correct import

const TransactionStream_Trans = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // ✅ show 3 rows per page

  const [transactions] = useState([
    {
      id: "TXN789456",
      customer: "Rajesh Kumar",
      amount: 2500,
      channel: "UPI",
      merchant: "Amazon Pay",
      location: "Mumbai, MH",
      status: "Success",
      time: "12:34:56",
    },
    {
      id: "TXN789457",
      customer: "Priya Sharma",
      amount: 850,
      channel: "POS",
      merchant: "Big Bazaar",
      location: "Delhi, DL",
      status: "Success",
      time: "12:33:45",
    },
    {
      id: "TXN789458",
      customer: "Amit Patel",
      amount: 5000,
      channel: "ATM",
      merchant: "HDFC ATM",
      location: "Ahmedabad, GJ",
      status: "Failed",
      time: "12:32:12",
    },
    {
      id: "TXN789459",
      customer: "Sneha Gupta",
      amount: 1200,
      channel: "ECOM",
      merchant: "Flipkart",
      location: "Bangalore, KA",
      status: "Pending",
      time: "12:30:28",
    },
    {
      id: "TXN789460",
      customer: "Vikram Singh",
      amount: 3500,
      channel: "UPI",
      merchant: "Paytm",
      location: "Pune, MH",
      status: "Success",
      time: "12:28:15",
    },
  ]);

  // ✅ filter logic
  const filteredTransactions = transactions.filter((txn) =>
    Object.values(txn).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  // ✅ pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // ✅ Export to PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Transaction Report", 14, 15);

    autoTable(doc, {
      head: [
        [
          "Transaction ID",
          "Customer",
          "Amount",
          "Channel",
          "Merchant",
          "Location",
          "Status",
          "Time",
        ],
      ],
      body: filteredTransactions.map((txn) => [
        txn.id,
        txn.customer,
        `₹${txn.amount.toLocaleString()}`,
        txn.channel,
        txn.merchant,
        txn.location,
        txn.status,
        txn.time,
      ]),
      startY: 25,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 212, 170] },
    });

    doc.save("transactions.pdf");
  };

  const getStatusLabel = (status) => {
    switch (status.toLowerCase()) {
      case "success":
        return "Success";
      case "failed":
        return "Failed";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "success":
        return "checker";
      case "failed":
        return "superuser";
      case "pending":
        return "infra";
      default:
        return "maker";
    }
  };

  const renderChannelIcon = (channel) => {
    switch (channel.toLowerCase()) {
      case "upi":
        return <Smartphone className="w-4 h-4 text-blue-400" />;
      case "pos":
        return <CreditCard className="w-4 h-4 text-green-400" />;
      case "atm":
        return <Monitor className="w-4 h-4 text-purple-400" />;
      case "ecom":
        return <ShoppingCart className="w-4 h-4 text-orange-400" />;
      default:
        return <Smartphone className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="rc-wrapper corner-box mt-[18px]">
      {/* ✅ Header with title + search + actions */}
      <div className="rc-header flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        {/* Title */}
        <h3 className="card-root-label flex items-center gap-2">
          Real-time Transaction Stream
        </h3>

        {/* Search + Buttons container */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2  sm:w-auto">
          {/* Search Box */}
          <div className="relative flex items-center w-full sm:w-60">
            <Search size="14" className="absolute left-5 top-2 text-gray-400" />
            <input
              type="text"
              className="search-input-approval ml-2"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2  sm:w-auto">
            <button
              style={{ padding: "0 8px" }}
              className="btn-count flex items-center justify-center sm:justify-start w-auto"
            >
              <span className="w-2 h-2 rounded-full bg-[#04CF6A] mr-2"></span>
              Live
            </button>
            <button className="btn-toggle" onClick={exportPDF}>
              <Download color="black" className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Channel</th>
              <th>Merchant</th>
              <th>Location</th>
              <th>Status</th>
              <th>Time</th>
              {/* <th className="rc-th">Actions</th> */}
            </tr>
          </thead>
          <tbody className="rc-tbody">
            {paginatedTransactions.map((txn, i) => (
              <tr key={i}>
                <td>{txn.id}</td>
                <td>{txn.customer}</td>
                <td>₹{txn.amount.toLocaleString()}</td>
                <td>
                  <div className="flex items-center gap-1">
                    {renderChannelIcon(txn.channel)}
                    <span className="text-gray-300 uppercase text-xs">
                      {txn.channel}
                    </span>
                  </div>
                </td>
                <td>{txn.merchant}</td>
                <td>
                  <div className="flex items-center gap-1 text-gray-300">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {txn.location}
                  </div>
                </td>
                <td>
                  <p
                    className={`max-w-[55px] w-full inline-block px-2 py-1 rounded text-center text-[10px] ${getStatusClass(
                      txn.status
                    )}`}
                  >
                    {getStatusLabel(txn.status)}
                  </p>
                </td>

                <td className="text-gray-300">{txn.time}</td>
                {/* <td className="flex items-center gap-2">
                  <button className="header-icon-box">
                    <EyeIcon className="primary-color w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-700 rounded">
                    <MoreHorizontal className="w-5 h-5 text-gray-300" />
                  </button>
                </td> */}
              </tr>
            ))}
            {paginatedTransactions.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center text-gray-400 py-4">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Responsive Pagination */}
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
  );
};

export default TransactionStream_Trans;
