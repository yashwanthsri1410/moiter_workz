import { Building2, Eye, File, FileText, Search, SquarePen, Save, SaveAll, EyeClosed, EyeOff, ArrowLeft, RotateCcw, Check, CalculatorIcon, X, Lock, SaveIcon, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import usePublicIp from "../hooks/usePublicIp";
import "../styles/styles.css"
// import { PencilIcon, Plus,SquarePen  } from "lucide-react";

export default function Partnercreate() {
    const [formOpen, setformOpen] = useState(false);
    const [agreementFile, setAgreementFile] = useState(null);
    const [idFile, setIdFile] = useState(null);
    const [addressFile, setAddressFile] = useState(null);
    const [partners, setPartners] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const partnersPerPage = 5;
    const ip = usePublicIp();
    // Fetch API data
    useEffect(() => {
        fetch("http://192.168.22.247:7090/fes/api/Export/partner_summary_export")
            .then((res) => res.json())
            .then((data) => setPartners(data))
            .catch((err) => console.error("Error fetching partners:", err));
    }, []);

    // Filter by search
    const filteredPartners = partners.filter((p) =>
        p.partnerName.toLowerCase().includes(search.toLowerCase())
    );
    // Pagination logic
    const totalPages = Math.ceil(filteredPartners.length / partnersPerPage);
    const indexOfLast = currentPage * partnersPerPage;
    const indexOfFirst = indexOfLast - partnersPerPage;
    const currentPartners = filteredPartners.slice(indexOfFirst, indexOfLast);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const products = [
        "Prepaid Wallet",
        "Payment Gateway",
        "Digital Banking",
        "Bill Payment",
        "Money Transfer",
        "Merchant Services",
        "Mobile Payment",
        "Cryptocurrency Services",
    ];

    const toggleAllowed = (product) => {
        setForm((prev) => {
            const exists = prev.allowedProducts.includes(product);
            return {
                ...prev,
                allowedProducts: exists
                    ? prev.allowedProducts.filter((p) => p !== product)
                    : [...prev.allowedProducts, product],
            };
        });
    };

    const [form, setForm] = useState({
        partnerName: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        partnerType: "",
        partnerStatus: "Active",
        kycLevel: "",
        panNumber: "",
        tanNumber: "",
        gstin: "",
        riskProfile: "",
        cardIssuanceCommissionPercent: 0,
        transactionCommissionPercent: 0,
        monthlyFixedFee: 0,
        commissionCurrency: "INR",
        settlementFrequency: "monthly",
        allowedProducts: "",
        portalAccessEnabled: false,
        portalUrl: "",
        webhookUrl: "default",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Prepare the payload according to your API schema
            const payload = {
                partnerName: form.partnerName,
                partnerType: form.partnerType,
                productName: form.productName,
                contactName: form.contactName,
                contactEmail: form.contactEmail,
                contactPhone: form.contactPhone,
                partnerStatus: form.partnerStatus,
                portalAccessEnabled: form.portalAccessEnabled,
                portalUrl: form.portalUrl,
                kycStatus: form.kycStatus,
                kycLevel: form.kycLevel,
                kycSubmittedAt: new Date().toISOString(),
                kycVerifiedAt: new Date().toISOString(),
                kycVerifiedBy: form.kycVerifiedBy || "system",
                panNumber: form.panNumber,
                tanNumber: form.tanNumber,
                gstin: form.gstin,
                address: form.address,
                financialStatementsJson: form.financialStatementsJson || "{}",
                riskProfile: form.riskProfile,
                pepCheck: form.pepCheck,
                sanctionsScreening: form.sanctionsScreening,
                blacklisted: form.blacklisted,
                allowedProducts: form.allowedProducts, // string or array depending on API
                webhookUrl: form.webhookUrl,
                cardIssuanceCommissionPercent: form.cardIssuanceCommissionPercent,
                transactionCommissionPercent: form.transactionCommissionPercent,
                monthlyFixedFee: form.monthlyFixedFee,
                revenueShareModel: form.revenueShareModel,
                commissionCurrency: form.commissionCurrency,
                settlementFrequency: form.settlementFrequency,
                lastSettlementDate: new Date().toISOString(),
                nextSettlementDue: new Date().toISOString(),
                commissionConfig: form.commissionConfig,
                status: form.status,
                pincode: form.pincode,
                state: form.state,
                city: form.city,
                agreementDocument: form.agreementDocument,
                idProofDocument: form.idProofDocument,
                addressProofDocument: form.addressProofDocument,
                metadata: {
                    createdBy: "system",
                    createdDate: new Date().toISOString(),
                    modifiedBy: "system",
                    modifiedDate: new Date().toISOString(),
                    header: {}
                },
                requestInfo: {
                    ipAddress: "",
                    userAgent: "",
                    headers: "",
                    channel: "",
                    auditMetadata: {
                        createdBy: "system",
                        createdDate: new Date().toISOString(),
                        modifiedBy: "system",
                        modifiedDate: new Date().toISOString(),
                        header: {}
                    }
                }
            };

            console.log("Payload ready:", payload);

            const response = await axios.post(
                "http://192.168.22.247/ps/DistributionPartner-Create",
                payload,
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("Partner created successfully:", response.data);
            alert("Partner created successfully!");
        } catch (error) {
            console.error("Error creating partner:", error.response || error);
            alert("Error creating partner: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="config-forms">
            {/* Header */}
            <div className="card-header">
                <div className="card-header-left">
                    <div className="flex items-center gap-[10px]">


                        <div className="header-icon-box">
                            <CalculatorIcon className="text-[#00d4aa] w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <h1 className="header-title">Distribution Partner Management</h1>
                        <p className="header-subtext">Onboard and manage distribution partners</p>
                    </div>
                </div>

                <div className="card-header-right">
                    <button
                        className="btn-outline"
                        onClick={() => setformOpen(prev => !prev)}
                    >
                        {formOpen ? (<><span className="btn-icon"><EyeOff className="w-4 h-4" /></span>Hide Form</>) : (<>  <span className="btn-icon"><Eye className="w-4 h-4" /></span> Show Form</>)}
                    </button>
                    <div className="portal-info">
                        <p className="portal-label">Content Creation</p>
                        <p className="portal-link">Maker Portal</p>
                    </div>
                </div>
            </div>

            {formOpen && (
                <form className="department-form mt-[18px]" onSubmit={handleSubmit}>
                    <div className="page-header">
                        <h2 className="form-title flex ">
                            <CalculatorIcon className="text-[#00d4aa] w-5 h-5 mr-[10px]" />
                            Create Partner Configuration
                        </h2>
                    </div>
                    {/* Grid Layout */}
                    <div className="grid grid-cols-2 gap-2 mt-6">
                        <div className="form-group">
                            <label>Partner Name</label>
                            <input
                                type="text"
                                name="partnerName"
                                className="form-input"
                                placeholder="Enter partner name"
                                value={form.partnerName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Contact Name</label>
                            <input
                                type="text"
                                name="contactName"
                                className="form-input"
                                placeholder="Enter contact name"
                                value={form.contactName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Contact Email</label>
                            <input
                                type="email"
                                name="contactEmail"
                                className="form-input"
                                placeholder="Enter contact email"
                                value={form.contactEmail}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Contact Phone</label>
                            <input
                                type="text"
                                name="contactPhone"
                                className="form-input"
                                placeholder="Enter contact phone"
                                value={form.contactPhone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                className="form-input"
                                placeholder="Enter address"
                                value={form.address}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>City</label>
                            <input
                                type="text"
                                name="city"
                                className="form-input"
                                placeholder="Enter city"
                                value={form.city}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>State</label>
                            <input
                                type="text"
                                name="state"
                                className="form-input"
                                placeholder="Enter state"
                                value={form.state}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Pincode</label>
                            <input
                                type="text"
                                name="pincode"
                                className="form-input"
                                placeholder="Enter pincode"
                                value={form.pincode}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Partner Type</label>
                            <select
                                name="partnerType"
                                value={form.partnerType}
                                onChange={handleChange}
                                className="form-input"
                            >
                                <option value="">Select partner type</option>
                                <option value="Retailer">Retailer</option>
                                <option value="Aggregator">Aggregator</option>
                                <option value="Bank">Bank</option>
                                <option value="Fintech">Fintech</option>
                                <option value="Distributor">Distributor</option>
                                <option value="SuperDistributor">SuperDistributor</option>
                                <option value="Corporate">Corporate</option>
                                <option value="Agent">Agent</option>
                                <option value="Franchise">Franchise</option>
                            </select>
                        </div>


                        <div className="form-group">
                            <label>Partner Status</label>
                            <select name="partnerStatus"
                                value={form.partnerStatus}
                                onChange={handleChange}
                                className="form-input">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-8">
                        <h3 className="section-title">Allowed Products</h3>
                        <div className="grid grid-cols-3 gap-4 mt-3">
                            {products.map((item) => {
                                const checked = form.allowedProducts?.includes(item); // ✅ check if selected
                                return (
                                    <label
                                        key={item}
                                        className="flex items-center gap-2 cursor-pointer text-gray-300"
                                    >
                                        <div
                                            onClick={() => toggleAllowed(item)} // ✅ toggle function
                                            className={`w-3 h-3 flex items-center justify-center border rounded-sm
              ${checked ? "bg-teal-500 border-teal-500" : "bg-[#0d1220] border-teal-700/50"}
              transition-colors duration-200`}
                                        >
                                            {checked && <Check size={14} className="text-[#0d1220]" />}
                                        </div>
                                        <span className="text-[12px]">{item}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>


                    <div className="portal-access flex items-center gap-2 text-gray-300">
                        {/* Status Dot */}
                        <div className="status-dot"></div>

                        {/* Custom Checkbox */}
                        <div
                            onClick={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    portalAccessEnabled: !prev.portalAccessEnabled,
                                }))
                            }
                            className={`w-3 h-3 flex items-center justify-center border rounded-sm cursor-pointer
      ${form.portalAccessEnabled ? "bg-teal-500 border-teal-500" : "bg-[#0d1220] border-teal-700/50"}
      transition-colors duration-200`}
                        >
                            {form.portalAccessEnabled && <Check size={14} className="text-[#0d1220]" />}
                        </div>

                        {/* Label */}
                        <span className="text-[13px]">Portal Access Enabled</span>

                        {/* ✅ Input appears only if checked */}
                        {form.portalAccessEnabled && (
                            <div className="form-group w-[1/2]">
                                <input
                                    name="portalUrl"
                                    value={form.portalUrl}
                                    onChange={handleChange}
                                    className="form-input"
                                    type="text"
                                    placeholder="Enter portal details"
                                />
                            </div>
                        )}
                    </div>


                    <div className="documents-section mt-8">
                        <h3 className="section-title">Documents</h3>
                        <div className="grid grid-cols-3 gap-6 mt-4">
                            {/* Agreement */}
                            <div>
                                <label className="text-[#00d4aa] text-[15px]">Agreement Document</label>
                                <p className="text-[10px] text-gray-400">(PDF/JPG/PNG, Max 5MB)</p>
                                <div className="file-upload mt-2">
                                    <label className="choose-btn cursor-pointer">
                                        Choose File
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            className="hidden"
                                            onChange={(e) => setAgreementFile(e.target.files[0])}
                                        />
                                    </label>
                                    <span className="file-name">
                                        {agreementFile ? agreementFile.name : "No file chosen"}
                                    </span>
                                </div>
                            </div>

                            {/* ID Proof */}
                            <div>
                                <label className="text-[#00d4aa] text-[15px]">ID Proof Document</label>
                                <p className="text-[10px] text-gray-400">(PDF/JPG/PNG, Max 2MB)</p>
                                <div className="file-upload mt-2">
                                    <label className="choose-btn cursor-pointer">
                                        Choose File
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            className="hidden"
                                            onChange={(e) => setIdFile(e.target.files[0])}
                                        />
                                    </label>
                                    <span className="file-name">
                                        {idFile ? idFile.name : "No file chosen"}
                                    </span>
                                </div>
                            </div>

                            {/* Address Proof */}
                            <div>
                                <label className="text-[#00d4aa] text-[15px]">Address Proof Document</label>
                                <p className="text-[10px] text-gray-400">(PDF/JPG/PNG, Max 2MB)</p>
                                <div className="file-upload mt-2">
                                    <label className="choose-btn cursor-pointer">
                                        Choose File
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            className="hidden"
                                            onChange={(e) => setAddressFile(e.target.files[0])}
                                        />
                                    </label>
                                    <span className="file-name">
                                        {addressFile ? addressFile.name : "No file chosen"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Advanced Configuration Section */}
                    <div className="advanced-config mt-10">
                        <h3 className="section-title text-[#00d4aa]">Advanced Configuration</h3>

                        {/* Compliance & KYC */}
                        <div className="mt-6">
                            <h4 className="text-sm font-semibold text-[#00d4aa] mb-4">Compliance & KYC</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label>KYC Level</label>
                                    <select name="kycLevel" className="form-input" value={form.kycLevel || ""}
                                        onChange={handleChange}>
                                        <option value="">Select KYC level</option>
                                        <option value="min">Min</option>
                                        <option value="medium">Medium</option>
                                        <option value="full">Full</option>
                                        <option value="video">Video</option>
                                        <option value="nil">Nil</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>PAN Number</label>
                                    <input type="text" name="panNumber" className="form-input" placeholder="Enter PAN number" value={form.panNumber || ""} onChange={handleChange} />
                                </div>

                                <div className="form-group">
                                    <label>TAN Number</label>
                                    <input type="text" name="tanNumber" className="form-input" placeholder="Enter TAN number" value={form.tanNumber || ""} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>GSTIN</label>
                                    <input type="text" name="gstin" className="form-input" placeholder="Enter GSTIN" value={form.gstin || ""}
                                        onChange={handleChange} />
                                </div>

                                <div className="form-group">
                                    <label>Risk Profile</label>
                                    <select name="riskProfile" className="form-input" value={form.riskProfile || ""}   // ✅ controlled value
                                        onChange={handleChange}    >
                                        <option value="">Select risk profile</option>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Financial Configuration */}
                        <div className="mt-8">
                            <h4 className="text-sm font-semibold text-[#00d4aa] mb-4">Financial Configuration</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label>Card Issuance Commission %</label>
                                    <input type="number" name="cardIssuanceCommissionPercent" className="form-input" placeholder="0" defaultValue={0} value={form.cardIssuanceCommissionPercent || 0}
                                        onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Transaction Commission %</label>
                                    <input type="number" name="transactionCommissionPercent" className="form-input" placeholder="0" defaultValue={0} value={form.transactionCommissionPercent || 0}
                                        onChange={handleChange} />
                                </div>

                                <div className="form-group">
                                    <label>Monthly Fixed Fee</label>
                                    <input type="number" name="monthlyFixedFee" className="form-input" placeholder="0" defaultValue={0} value={form.monthlyFixedFee || 0}
                                        onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Commission Currency</label>
                                    <select name="commissionCurrency" className="form-input" value={form.commissionCurrency || "INR"}
                                        onChange={handleChange}>
                                        <option value="INR">INR</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Settlement Frequency</label>
                                    <select name="settlementFrequency" className="form-input" value={form.settlementFrequency || "monthly"}
                                        onChange={handleChange}>
                                        <option value="monthly">Monthly</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="daily">Daily</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="partner-form-footer mt-10 flex items-center gap-3">
                        <button
                            type="submit"
                            className="flex items-center px-5 py-2 bg-[#00d4aa] hover:bg-[#00b896] text-black  rounded-md shadow-md transition"
                            disabled={loading}
                        >
                            <SaveIcon className="w-4 h-4 mr-2" />
                            {loading ? "Saving..." : "Save Partner"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setformOpen(false)} // 👈 closes form
                            className="flex items-center px-5 py-2 bg-transparent border border-[#00d4aa]/40 text-gray-400 hover:text-white hover:border-[#00d4aa] rounded-md transition"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                        </button>
                    </div>
                </form>
            )}
            <div className="partner-network">
                <div className="table-card">
                    {/* Header */}
                    <div className="table-header">
                        <h2 className="table-title flex items-center gap-2">
                            <Building2 className="text-[#00d4aa] w-5 h-5" />
                            Partner Network
                        </h2>
                        <div className="search-box">
                            <Search className="absolute left-3 top-2 text-gray-400 w-3 h-3" />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search partners..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1); // reset to first page when searching
                                }}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="table-wrapper">
                        <table className="w-full text-sm text-left">
                            <thead className="table-head">
                                <tr>
                                    <th className="table-cell">Partner Name</th>
                                    <th className="table-cell">Type</th>
                                    <th className="table-cell">Contact</th>
                                    <th className="table-cell">Status</th>
                                    <th className="table-cell">KYC Status</th>
                                    <th className="table-cell">Agreement</th>
                                    <th className="table-cell">ID Proof</th>
                                    <th className="table-cell">Address Proof</th>
                                    <th className="table-cell">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPartners.map((partner, index) => (
                                    <tr key={index} className="table-row">
                                        <td className="table-cell-name">{partner.partnerName}</td>
                                        <td className="p-3">{partner.partnerType}</td>
                                        <td className="p-3">
                                            {partner.contactName} ({partner.contactPhone})
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`px-2 py-1 rounded text-[10px] ${partner.partnerStatus === "Active"
                                                    ? "checker"
                                                    : partner.partnerStatus === "Onboarded"
                                                        ? "maker"
                                                        : partner.partnerStatus === "Inactive"
                                                            ? "superuser"
                                                            : ""
                                                    }`}
                                            >
                                                {partner.partnerStatus}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`px-2 py-1 rounded text-[10px] ${partner.kycStatus === "Verified"
                                                    ? "checker"
                                                    : "superuser"
                                                    }`}
                                            >
                                                {partner.kycStatus}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            {partner.agreementDocumentBase64 ? (
                                                <span className="px-2 py-1 rounded text-[10px] checker">
                                                    Completed
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded text-[10px] infra">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            {partner.idProofDocumentBase64 ? (
                                                <span className="px-2 py-1 rounded text-[10px] checker">
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded text-[10px] infra">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            {partner.addressProofDocumentBase64 ? (
                                                <span className="px-2 py-1 rounded text-[10px] checker">
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded text-[10px] infra">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-3 text-[#00d4aa] cursor-pointer flex items-center gap-2">
                                            <SquarePen className="w-3 h-3" /> Edit
                                        </td>
                                    </tr>
                                ))}

                                {currentPartners.length === 0 && (
                                    <tr>
                                        <td colSpan="9" className="text-center py-4 text-gray-500">
                                            No partners found.
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
            </div>
            {/* Guidelines */}
            <div className="guidelines-card">
                <h3 className="guidelines-title">Partner Management Guidelines</h3>
                <div className="guidelines-grid">
                    <p>🏢 <span>Partner Onboarding:</span>Collect complete business and contact information</p>
                    <p>📋 <span> Document Verification:</span> Ensure all required documents are uploaded and verified</p>
                </div>
                <div className="guidelines-grid">
                    <p>🤝 <span >Product Access:</span> Configure allowed products and services for each partner</p>
                    <p>✅ <span> Portal Access:</span> Enable partner portal access for self-service capabilities</p>

                </div>
            </div>
        </div>

    );
}
