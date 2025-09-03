import React, { useEffect, useState } from "react";
import axios from "axios";
import { EyeIcon, Power, FileText, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Partnerview from "../components/partnerview"

export default function PartnerApproval() {
    const [partners, setPartners] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPartner, setSelectedPartner] = useState(null);

    // ✅ Fetch partner data
    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            const res = await axios.get(
                "http://192.168.22.247:7090/fes/api/Export/partner_summary_export"
            );
            setPartners(res.data);
        // console.log(typeof res.data, res.data);
        } catch (err) {
            console.error("Error fetching partners:", err);
        }
    };

    // ✅ Search filter
    const filteredPartners = partners.filter((partner) =>
        Object.values(partner).some(
            (value) =>
                value &&
                value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

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
    // console.log(selectedPartner)
    return (
        <div className="config-forms">

            {selectedPartner ? (<>
                <Partnerview
                    selectedPartner={selectedPartner}
                    setSelectedPartner={setSelectedPartner}

                />
            </>) : (<>
                {/* Header */}
                <div className="card-header">
                    <div className="card-header-left">
                        <div className="header-icon-box">
                            <FileText className="text-[#00d4aa] w-4 h-4" />
                        </div>
                        <div>
                            <h1 className="header-title">Pending Partner Applications</h1>
                            <p className="header-subtext">Review and manage partner onboarding</p>
                        </div>
                    </div>
                    <div className="card-header-right">
                        <div className="portal-info">
                            <p className="portal-label">{partners.length} total</p>
                            <p className="portal-link">Checker Portal</p>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-[#0c0f16] border border-[#1a1f2e] rounded-xl p-3 flex flex-col gap-3 mt-6">
                    <div className="flex items-center gap-2">
                        <div className="search-box relative">
                            <Search className="absolute left-3 top-2 text-gray-400 w-3 h-3" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="search-input-approval"
                                placeholder="Search partners..."
                            />
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`w-6 h-6 flex items-center justify-center rounded-md transition ${currentPage === 1
                                ? "bg-[#0f131d] text-gray-500 cursor-not-allowed"
                                : "bg-[#0f131d] text-white hover:border hover:border-[#00d4aa]"
                                }`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="w-6 h-6 flex items-center justify-center rounded-md bg-[#00d4aa] text-black text-[12px]">
                            {currentPage}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`w-6 h-6 flex items-center justify-center rounded-md transition ${currentPage === totalPages
                                ? "bg-[#0f131d] text-gray-500 cursor-not-allowed"
                                : "bg-[#0f131d] text-white hover:border hover:border-[#00d4aa]"
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
                            <FileText className="w-5 h-5" />
                            Pending Partner Applications
                        </p>
                    </div>

                    <div className="table-wrapper mt-5">
                        <table className="w-full text-left">
                            <thead className="table-head">
                                <tr>
                                    <th className="table-cell">Partner Name</th>
                                    <th className="table-cell">Partner Type</th>
                                    <th className="table-cell">KYC Status</th>
                                    <th className="table-cell">Partner Status</th>
                                    <th className="table-cell">Remarks</th>
                                    <th className="table-cell">Partner Accessibility</th>
                                    <th className="table-cell">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedPartners.map((partner, idx) => (
                                    <tr key={idx} className="table-row">
                                        <td className="table-content text-[#00d4aa]">{partner.partnerName}</td>
                                        <td className="table-content">{partner.partnerType}</td>
                                        <td className="table-content">
                                            <span
                                                className={`px-2 py-1 rounded text-[10px] ${partner.kycStatus === "Verified"
                                                    ? "checker"
                                                    : partner.kycStatus === "Under Review"
                                                        ? "infra"
                                                        : partner.kycStatus === "Rejected"
                                                            ? "superuser"
                                                            : partner.kycStatus === "Incomplete"
                                                                ? "maker"
                                                                : ""
                                                    }`}
                                            >
                                                {partner.kycStatus}
                                            </span>
                                        </td>
                                        <td className="table-content">
                                            <span className="px-2 py-1 rounded text-[10px] infra">
                                                {partner.partnerStatus}
                                            </span>
                                        </td>
                                        <td className="table-content">{partner.remarks || "-"}</td>
                                        <td className="table-content">
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
                                                <EyeIcon className="text-[#00d4aa] w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedPartners.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4 text-gray-500">
                                            No partners found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>)}

        </div>
    );
}
