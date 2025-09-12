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
    return (
        <div className="rc-wrapper corner-box mt-[18px]">
            {/* Header with title + search */}
            <div className="rc-header flex justify-between items-center">
                <h3 className="rc-title flex items-center gap-2">KYC Review Queue</h3>
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
                                        <span className={`px-2 py-1 text-[12px] rounded ${cust.risk === "High"
                                                ? "superuser"
                                                : cust.risk === "Low"
                                                    ? "checker"
                                                    : cust.risk === "Medium"
                                                        ? "maker"
                                                        : "maker"
                                            } `}>{cust.risk}</span>
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
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm ${currentPage === 1
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
                            className={`px-3 py-1 rounded-lg text-sm ${currentPage === i + 1
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
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm ${currentPage === totalPages
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

export default KYCReviewQueue;
