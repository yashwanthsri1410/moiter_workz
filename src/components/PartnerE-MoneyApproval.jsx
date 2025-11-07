import React, { useState, useEffect } from "react";
import {
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    CalculatorIcon,
    Check,
    X,
    DollarSign,
} from "lucide-react";
import usePublicIp from "../hooks/usePublicIp";
import customConfirm from "./reusable/CustomConfirm";
import { approvePartnerEmoneyAction, getpartnerData, getpartnerledgerData } from "../services/service";

const PartnerLedger = () => {
    const [partners, setPartners] = useState([]);
    const [ledgerData, setLedgerData] = useState([]);
    const [filteredLedger, setFilteredLedger] = useState([]);
    const username = localStorage.getItem("username");
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    const [loading, setLoading] = useState(false);
    const [noLedgerData, setNoLedgerData] = useState(false); // ✅ new state

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
    const ip = usePublicIp();
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Fetch partner list
    const fetchPartners = async () => {
        try {
            const res = await getpartnerData();
            setPartners(res.data);
        } catch (err) {
            console.error("Error fetching partners:", err);
        }
    };

    // Fetch ledger by partner ID
    const fetchLedgerByPartner = async (partnerId) => {
        try {
            setLoading(true);
            setNoLedgerData(false);
            const res = await getpartnerledgerData(partnerId);
            const data = res.data || [];

            if (data.length === 0) {
                setNoLedgerData(true);
            }

            setLedgerData(data);
            setFilteredLedger(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching ledger:", err);
            setLoading(false);
            setNoLedgerData(true);
        }
    };

    useEffect(() => {
        fetchPartners();
    }, []);

    // Handle Partner Change
    const handlePartnerSelect = (e) => {
        const value = e.target.value;
        const selected = partners.find(
            (p) => String(p.partnerId) === String(value)
        );

        setSelectedPartner(selected || null);
        if (value) fetchLedgerByPartner(value);
    };

    // Extract unique payment methods dynamically
    const paymentMethods = Array.from(
        new Set(ledgerData.map((item) => item.paymentMethod))
    );

    // Filter Ledger
    useEffect(() => {
        let filtered = ledgerData.filter((item) => {
            const query = searchQuery.toLowerCase();

            const matchesSearch =
                item.partnerName?.toLowerCase().includes(query) ||
                item.transactionId?.toLowerCase().includes(query) ||
                item.paymentMethod?.toLowerCase().includes(query) ||
                item.status?.toLowerCase().includes(query) ||
                item.remarks?.toLowerCase().includes(query);

            const matchesPayment =
                !selectedPaymentMethod ||
                item.paymentMethod?.toLowerCase() ===
                selectedPaymentMethod.toLowerCase();

            return matchesSearch && matchesPayment;
        });

        setFilteredLedger(filtered);
        setCurrentPage(1);
    }, [searchQuery, selectedPaymentMethod, ledgerData]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredLedger.length / itemsPerPage);
    const paginatedData = filteredLedger.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const handleAction = async (transactionId, status, remarks, item) => {
        const confirmAction = await customConfirm(
            `Are you sure you want to ${status} this transaction?<br/><br/>
             <b>Payment Method:</b> ${item.paymentMethod || "N/A"}<br/>
             <b>Amount:</b> ₹${item.amount?.toLocaleString() || "0"}<br/>
             <b>Transaction ID:</b> ${item.transactionId}`
        );

        if (!confirmAction) return;

        try {
            const payload = {
                transactionId,
                partnerId: Number(selectedPartner?.partnerId),
                status,
                remarks: remarks || "",
                modifiedBy: username || "",
            };

            // ✅ Call API through service
            await approvePartnerEmoneyAction(payload);

            // ✅ Instantly update UI
            setLedgerData((prev) =>
                prev.map((i) =>
                    i.transactionId === transactionId ? { ...i, status } : i
                )
            );

            alert(`Ledger ${status === 0 ? "Approved" : status === 2 ? "Rejected" : ""} successfully!`);
        } catch (err) {
            console.error("Error updating ledger status:", err);
            alert("Failed to update ledger status.");
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="card-header flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4">
                {/* Left Section */}
                <div className="card-header-left flex items-center gap-3 text-center sm:text-left">
                    <div className="header-icon-box flex-shrink-0">
                        <DollarSign className="primary-color w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                        <h1 className="user-title">Pending Partner E-money approvals</h1>
                        <p className="user-subtitle">
                            Review and manage Partner E-money ledger onboarding
                        </p>
                    </div>
                </div>

                {/* Right Section */}
                <div className="card-header-right text-center sm:text-right">
                    <div className="portal-info">
                        <p className="portal-label text-[13px] sm:text-[15px] font-medium  text-center sm:text-right">
                            {ledgerData.length} total
                        </p>
                        <p className="portal-link text-[12px] sm:text-sm text-[#00d4aa] cursor-pointer">
                            Checker Portal
                        </p>
                    </div>
                </div>
            </div>
            {/* Search + Filter */}
            <div className="tables-search-card rounded-xl p-3 flex flex-col gap-3 items-center md:items-start mt-6">
                <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                    {/* Search */}
                    <div className="search-box relative flex-1 w-full md:w-auto">
                        <Search size="14" className="absolute left-3 top-2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input-approval !w-full md:w-64 pl-8 py-1 text-sm md:text-base"
                            placeholder="Search ledger..."
                        />
                    </div>

                    {/* Payment Method Dropdown */}
                    <select
                        value={selectedPaymentMethod}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="bg-[#0f172a] border border-gray-700 text-gray-300 px-3 py-1.5 rounded-md text-sm focus:outline-none w-full md:w-48"
                    >
                        <option value="">All Payment Methods</option>
                        {paymentMethods.map((method, idx) => (
                            <option key={idx} value={method}>
                                {method}
                            </option>
                        ))}
                    </select>

                    {/* Reset */}
                    <button
                        onClick={() => {
                            setSearchQuery("");
                            setSelectedPaymentMethod("");
                        }}
                        className="reset-btn flex items-center gap-1 text-sm px-3 py-1.5 rounded-md bg-[#0f131d] hover:border hover:border-[var(--primary-color)] transition text-white"
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
                        className={`w-6 h-6 flex items-center justify-center rounded-md transition ${currentPage === 1
                            ? "bg-[#0f131d] text-gray-500 cursor-not-allowed"
                            : "bg-[#0f131d] text-white hover:border hover:border-[var(--primary-color)]"
                            }`}
                    >
                        <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>

                    <span className="w-6 h-6 flex items-center justify-center rounded-md primary-bg text-black text-[12px] sm:text-[14px]">
                        {currentPage}
                    </span>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`w-6 h-6 flex items-center justify-center rounded-md transition ${currentPage === totalPages
                            ? "bg-[#0f131d] text-gray-500 cursor-not-allowed"
                            : "bg-[#0f131d] text-white hover:border hover:border-[var(--primary-color)]"
                            }`}
                    >
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="table-card mt-[18px]">
                <div className="table-header">
                    <div className="flex items-center gap-2 primary-color">
                        <DollarSign className="w-4 h-4" />
                        <p className="user-table-header">Partner Ledger Details</p>
                    </div>
                </div>

                {/* Partner Dropdown */}
                <div className="flex flex-wrap items-center gap-3 mt-4 ">
                    <select
                        className="bg-[#0f172a] border border-gray-700 text-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none w-72"
                        onChange={handlePartnerSelect}
                        defaultValue=""
                    >
                        <option value="" disabled>
                            Select Partner...
                        </option>
                        {partners.map((partner) => (
                            <option key={partner.partnerId} value={partner.partnerId}>
                                {partner.partnerName}
                            </option>
                        ))}
                    </select>

                    {selectedPartner && (
                        <p className="text-gray-400 text-sm">
                            Showing ledger for:{" "}
                            <span className="text-cyan-400 font-medium">
                                {selectedPartner.partnerName}
                            </span>
                        </p>
                    )}
                </div>

                {/* Table */}
                <div className="table-container mt-4">
                    <table>
                        <thead>
                            <tr>
                                <th>Partner Name</th>
                                <th>Transaction ID</th>
                                <th>Payment Method</th>
                                <th>Amount (₹)</th>
                                <th>Date</th>
                                <th>Remarks</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-4 text-gray-400">
                                        Loading ledger data...
                                    </td>
                                </tr>
                            ) : noLedgerData ? (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="text-center py-4 text-gray-500 text-sm sm:text-base"
                                    >
                                        This partner doesn’t have ledger payments.
                                    </td>
                                </tr>
                            ) : paginatedData.length > 0 ? (
                                paginatedData.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.partnerName}</td>
                                        <td>{item.transactionId}</td>
                                        <td>{item.paymentMethod}</td>
                                        <td>₹{item.amount.toLocaleString()}</td>
                                        <td>{item.date}</td>
                                        <td>{item.remarks || "-"}</td>
                                        <td>
                                            <span
                                                className={`px-2 py-1 rounded text-[10px] ${item.status === 0
                                                    ? "checker"
                                                    : item.status === 1
                                                        ? "infra"
                                                        : item.status === 2
                                                            ? "superuser"
                                                            : item.status === 3
                                                                ? "maker"
                                                                : ""
                                                    }`}
                                            >
                                                {getStatusLabel(item.status)}
                                            </span>
                                        </td>
                                        <td className="flex items-center gap-2">
                                            {item.status === 1 ? (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            handleAction(item.transactionId, 0, item.remarks, item)
                                                        }
                                                        className="checker px-3 py-1.5 rounded-full flex items-center gap-1"
                                                    >
                                                        <Check size={12} /> Approve
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleAction(item.transactionId, 2, item.remarks, item)
                                                        }
                                                        className="superuser px-3 py-1.5 rounded-full flex items-center gap-1"
                                                    >
                                                        <X size={12} /> Reject
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-gray-400 text-xs ">
                                                    <span
                                                        className={`px-2 py-1 text-[10px] rounded-full  ${item.status === 0
                                                            ? "checker"
                                                            : item.status === 1
                                                                ? "infra"
                                                                : item.status === 2
                                                                    ? "superuser"
                                                                    : item.status === 3
                                                                        ? "maker"
                                                                        : ""
                                                            }`}
                                                    >
                                                        {getStatusLabel(item.status)}
                                                    </span>
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="text-center py-4 text-gray-500 text-sm sm:text-base"
                                    >
                                        {selectedPartner
                                            ? "No matching ledger records found."
                                            : "Please select a partner to view ledger details."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-3 mt-4 text-xs">
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full checker"></span> Approved
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full infra"></span> Pending
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full superuser"></span> Rejected
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerLedger;
