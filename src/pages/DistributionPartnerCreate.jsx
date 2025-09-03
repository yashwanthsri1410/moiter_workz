
import React, { useEffect, useState } from "react";
import axios from "axios";
import usePublicIp from "../hooks/usePublicIp";
import {
    PencilIcon,
    Search,
    ChevronDown,
    ChevronUp,
    Plus,
    ArrowUp
} from "lucide-react";
import "./../styles/commonForm.css";

const partnerTypes = [
    "Retailer",
    "Aggregator",
    "Bank",
    "Fintech",
    "Distributor",
    "SuperDistributor",
    "Corporate",
    "Agent",
    "Franchise"
];
const partnerStatuses = ["Onboarded", "Active", "Inactive", "Suspended"];
const kycStatuses = ["Pending", "Verified", "Rejected"];
const kycLevels = ["Basic", "Full", "Enhanced"];
const riskProfiles = ["Low", "Medium", "High"];
const commissionCurrencies = ["INR", "USD", "EUR", "GBP"];
const settlementFrequencies = [
    "Daily",
    "Weekly",
    "Bi-Weekly",
    "Monthly",
    "Quarterly"
];

// Max file sizes
const MAX_SIZE_AGREEMENT = 5 * 1024 * 1024; // 5MB
const MAX_SIZE_ID = 2 * 1024 * 1024;        // 2MB
const MAX_SIZE_ADDRESS = 2 * 1024 * 1024;   // 2MB

export default function DistributionPartnerManagement() {
    const [partners, setPartners] = useState([]);
    const [editingPartnerId, setEditingPartnerId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAdvancedConfig, setShowAdvancedConfig] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [productList, setProductList] = useState([]);
    // console.log(productList)
    const [productDropdownVisible, setProductDropdownVisible] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // File previews (images or file names)
    const [previews, setPreviews] = useState({
        agreementDocument: "",
        idProofDocument: "",
        addressProofDocument: ""
    });

    const ip = usePublicIp();
    const username = localStorage.getItem("username");

    const initialFormState = {
        pincode: "",
        state: "",
        city: "",
        address: "",
        partnerName: "",
        partnerType: "Retailer",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        partnerStatus: "Active",
        portalAccessEnabled: false,
        portalUrl: "",
        kycStatus: "Pending",
        kycLevel: "Basic",
        kycSubmittedAt: "",
        kycVerifiedAt: "",
        panNumber: "",
        tanNumber: "",
        gstin: "",
        addressProofJson: "",
        riskProfile: "Low",
        pepCheck: false,
        sanctionsScreening: false,
        blacklisted: false,
        allowedProducts: "",
        webhookUrl: "",
        cardIssuanceCommissionPercent: 0,
        transactionCommissionPercent: 0,
        monthlyFixedFee: 0,
        revenueShareModel: "",
        commissionCurrency: "INR",
        settlementFrequency: "Monthly",
        lastSettlementDate: "",
        nextSettlementDue: "",
        // New document fields (bytea/base64)
        agreementDocument: "",
        idProofDocument: "",
        addressProofDocument: "",
        metadata: {
            createdBy: username || "system",
            createdDate: new Date().toISOString(),
            modifiedBy: username || "system",
            modifiedDate: new Date().toISOString()
        },
        requestInfo: {
            ipAddress: ip,
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "web",
            headers: "frontend",
            channel: "web",
            auditMetadata: {
                createdBy: username || "system",
                createdDate: new Date().toISOString(),
                modifiedBy: username || "system",
                modifiedDate: new Date().toISOString()
            }
        }
    };

    const [form, setForm] = useState(initialFormState);

    useEffect(() => {
        fetchPartners();
        fetchProducts();
    }, []);

    const fetchPartners = async () => {
        try {
            const res = await axios.get(
                "http://192.168.22.247:7090/api/Export/partner_summary_export"
            );
            setPartners(res.data || []);
        } catch (err) {
            console.error("Error fetching partners:", err);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await axios.get(
                "http://192.168.22.247:7090/api/Export/product_export"
            );
            const filtered = (res.data || []).filter((p) => p.status === 0);
            setProductList(filtered);
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 300);
        };
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".select-container")) {
                setProductDropdownVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const scrollToHeader = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) || 0 : value
        }));
    };

    // File to Base64 helper
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(",")[1]); // return only base64 part
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(file);
        });
    };

    const handleFileChange = async (e) => {
        const { name, files } = e.target;
        if (!files || files.length === 0) return;
        const file = files[0];

        // Size validation
        let maxSize = MAX_SIZE_ADDRESS;
        if (name === "agreementDocument") maxSize = MAX_SIZE_AGREEMENT;
        if (name === "idProofDocument") maxSize = MAX_SIZE_ID;
        if (name === "addressProofDocument") maxSize = MAX_SIZE_ADDRESS;

        if (file.size > maxSize) {
            const mb = (maxSize / (1024 * 1024)).toFixed(0);
            alert(`${name} exceeds the maximum size of ${mb} MB`);
            // clear file input
            e.target.value = "";
            return;
        }

        try {
            const base64 = await fileToBase64(file);
            setForm((prev) => ({ ...prev, [name]: base64 }));

            // Preview (image -> show image; others -> show filename)
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = () => {
                    setPreviews((prev) => ({ ...prev, [name]: reader.result }));
                };
                reader.readAsDataURL(file);
            } else {
                setPreviews((prev) => ({ ...prev, [name]: file.name }));
            }
        } catch (err) {
            console.error("File read error:", err);
            alert("Failed to read the selected file.");
        }
    };

    const toggleAllowedProduct = (productName) => {
        setForm((prev) => {
            const current = prev.allowedProducts
                ? prev.allowedProducts.split(",")
                : [];
            const updated = current.includes(productName)
                ? current.filter((name) => name !== productName)
                : [...current, productName];
            return { ...prev, allowedProducts: updated.join(",") };
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.partnerName.trim()) return alert("Partner name is required");

        const formatDate = (d) => (d ? new Date(d).toISOString() : null);
        const currentIsoDate = new Date().toISOString();

        // Construct payload
        const payload = {
            ...form,
            kycSubmittedAt: formatDate(form.kycSubmittedAt),
            kycVerifiedAt: formatDate(form.kycVerifiedAt),
            lastSettlementDate: formatDate(form.lastSettlementDate),
            nextSettlementDue: formatDate(form.nextSettlementDue),
            allowedProducts: Array.isArray(form.allowedProducts)
                ? form.allowedProducts.join(",")
                : form.allowedProducts,
            metadata: {
                ...form.metadata,
                createdDate: currentIsoDate,
                modifiedDate: currentIsoDate,

                pincode: form.pincode,
                state: form.state,
                city: form.city,
                address: form.address,
            },
            requestInfo: {
                ...form.requestInfo,
                auditMetadata: {
                    ...form.requestInfo.auditMetadata,
                    createdDate: currentIsoDate,
                    modifiedDate: currentIsoDate
                }
            }
        };

        // Do not send empty document strings (avoid overwriting on update)
        ["agreementDocument", "idProofDocument", "addressProofDocument"].forEach((k) => {
            if (!payload[k]) delete payload[k];
        });

        const config = {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            }
        };
        try {
            let response;

            if (editingPartnerId) {
                response = await axios.put(
                    `http://192.168.22.247/ps/DistributionPartner-Update?id=${editingPartnerId}`,
                    payload,
                    config
                );
            } else {
                response = await axios.post(
                    "http://192.168.22.247/ps/DistributionPartner-Create",
                    payload,
                    config
                );
            }

            const resData = response.data;
            console.log("API Response:", resData);

            if (
                resData?.success === false ||
                resData?.status === "FAILURE" ||
                resData?.error ||
                (typeof resData?.message === "string" && resData.message.toLowerCase().includes("error"))
            ) {
                const errorMessage = resData.message || resData.error || "Something went wrong";
                console.error("API Error Message:", errorMessage);
                return alert("Error: " + errorMessage);
            }

            alert(editingPartnerId ? "Partner updated successfully!" : "Partner created successfully!");
            resetForm();
            await fetchPartners();
        } catch (err) {
            console.error("API Error:", err);
            const errorMessage =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Failed to save partner.";
            alert("Error: " + errorMessage);
        }
    };

    const handleEdit = (partner) => {
        const formatDate = (date) =>
            date ? new Date(date).toISOString().split("T")[0] : "";

        setForm({
            ...initialFormState,
            pincode: partner.pincode || "",
            state: partner.state || "",
            city: partner.city || "",
            address: partner.address || "",
            ...partner,
            // keep existing documents empty by default; user can re-upload to replace
            agreementDocument: "",
            idProofDocument: "",
            addressProofDocument: "",
            blacklisted: Boolean(partner.blacklisted),
            kycSubmittedAt: formatDate(partner.kycSubmittedAt),
            kycVerifiedAt: formatDate(partner.kycVerifiedAt),
            lastSettlementDate: formatDate(partner.lastSettlementDate),
            nextSettlementDue: formatDate(partner.nextSettlementDue)
        });
        setPreviews({
            agreementDocument: partner.agreementDocument ? "Existing file" : "",
            idProofDocument: partner.idProofDocument ? "Existing file" : "",
            addressProofDocument: partner.addressProofDocument ? "Existing file" : ""
        });
        setEditingPartnerId(partner.partnerName);
        setShowForm(true);
        setShowAdvancedConfig(true);
        scrollToHeader();
    };

    const handleDelete = async (partner) => {
        if (!window.confirm(`Delete partner "${partner.partnerName}"?`)) return;
        try {
            await axios.delete(`http://192.168.22.247/ps/DistributionPartner-Delete?id=${encodeURIComponent(partner.partnerName)}`);
            alert("Partner deleted.");
            await fetchPartners();
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete partner.");
        }
    };
    const handleClone = (partner) => {
        const formatDate = (date) =>
            date ? new Date(date).toISOString().split("T")[0] : "";

        setForm({
            ...initialFormState,
            ...partner,
            partnerName: `${partner.partnerName}_copy`,
            agreementDocument: "",
            idProofDocument: "",
            addressProofDocument: "",
            blacklisted: Boolean(partner.blacklisted),
            kycSubmittedAt: formatDate(partner.kycSubmittedAt),
            kycVerifiedAt: formatDate(partner.kycVerifiedAt),
            lastSettlementDate: formatDate(partner.lastSettlementDate),
            nextSettlementDue: formatDate(partner.nextSettlementDue)
        });

        setPreviews({
            agreementDocument: partner.agreementDocument ? "Existing file" : "",
            idProofDocument: partner.idProofDocument ? "Existing file" : "",
            addressProofDocument: partner.addressProofDocument ? "Existing file" : ""
        });

        setEditingPartnerId(null); // create mode
        setShowForm(true);
        setShowAdvancedConfig(true);
        scrollToHeader();
    };

    const resetForm = () => {
        setForm(initialFormState);
        setPreviews({
            agreementDocument: "",
            idProofDocument: "",
            addressProofDocument: ""
        });
        setEditingPartnerId(null);
        setShowForm(false);
        setShowAdvancedConfig(false);
    };

    const filteredPartners = partners.filter((p) =>
        (p.partnerName || "").toLowerCase().includes((searchTerm || "").toLowerCase())
    );

    const renderBooleanField = (label, field) => (
        <div>
            <label className="block mb-1 font-semibold text-white">{label}</label>
            <div className="flex gap-4">
                <label className="text-white">
                    <input
                        type="radio"
                        name={field}
                        checked={!!form[field]}
                        onChange={() => setForm((prev) => ({ ...prev, [field]: true }))}
                    /> Yes
                </label>
                <label className="text-white">
                    <input
                        type="radio"
                        name={field}
                        checked={!form[field]}
                        onChange={() => setForm((prev) => ({ ...prev, [field]: false }))}
                    /> No
                </label>
            </div>
        </div>
    );

    const renderInputField = (label, field, type = "text") => (
        <div className="nester-form-input-text">
            <label>{label}</label>
            <input
                type={type}
                name={field}
                value={form[field] ?? ""}
                onChange={handleChange}
            />
        </div>
    );

    const renderSelectField = (label, field, options) => (
        <div className="select-container">
            <label className="select-label">{label}</label>
            <select
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="nested-form-input"
            >
                {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );

    const renderCheckboxField = (label, field) => (
        <div className="form-checkbox">
            <label className="option-label">
                <input
                    type="checkbox"
                    name={field}
                    checked={!!form[field]}
                    onChange={handleChange}
                />
                {label}
            </label>
        </div>
    );

    // Render file input matching the theme
    const renderFileInput = (label, name, hint) => (
        <div className="nester-form-input-text">
            <label>{label} <span className="text-gray-400" style={{ fontSize: "12px" }}>({hint})</span></label>
            <input
                type="file"
                name={name}
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="file-input"
            />
            {/* Preview zone */}
            {previews[name] && (
                previews[name].startsWith("data:") ? (
                    <img
                        src={previews[name]}
                        alt={`${name} preview`}
                        className="mt-2"
                        style={{ width: 100, borderRadius: 8, border: "1px solid rgba(0,255,195,0.3)", boxShadow: "0 0 10px rgba(0,255,195,0.4)" }}
                    />
                ) : (
                    <div className="mt-2 product-dropdown-text">{previews[name]}</div>
                )
            )}
        </div>
    );

    // helper: build data: link for download
    const dataHref = (base64, mime = "application/octet-stream") =>
        base64 ? `data:${mime};base64,${base64}` : null;

    return (
        <div className="page-container">
            <div className="product-container">
                <div className="header-section">
                    <h2>Distribution Partner Management</h2>
                    <button onClick={() => setShowForm((prev) => !prev)} className="btn-green">
                        <Plus size={18} /> Create Partner
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="product-form">
                        <h3>{editingPartnerId ? `Edit Partner (${editingPartnerId})` : "Create New Partner"}</h3>

                        <div className="form-grid">
                            <div>
                                <label>Partner Name</label>
                                <input
                                    name="partnerName"
                                    value={form.partnerName}
                                    onChange={handleChange}
                                    disabled={!!editingPartnerId}
                                    className={editingPartnerId ? "disabled-input" : ""}
                                />
                            </div>
                            <div><label>Contact Name</label><input name="contactName" value={form.contactName} onChange={handleChange} /></div>
                            <div><label>Contact Email</label><input type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange} /></div>
                            <div><label>Contact Phone</label><input name="contactPhone" value={form.contactPhone} onChange={handleChange} /></div>
                            <div>
                                <label>Address</label>
                                <textarea
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    onInput={(e) => {
                                        e.target.style.height = "auto"; // reset height
                                        e.target.style.height = `${e.target.scrollHeight}px`; // set to scroll height
                                    }}
                                    rows={1}
                                    style={{
                                        overflow: "hidden",
                                        resize: "none"
                                    }}
                                    className="text-area mt-[10px]"
                                />
                            </div>
                            <div><label>City</label><input name="city" value={form.city} onChange={handleChange} /></div>
                            <div><label>State</label><input name="state" value={form.state} onChange={handleChange} /></div>
                            <div><label>Pincode</label><input type="number" name="pincode" value={form.pincode} onChange={handleChange} /></div>
                            <div className="select-container">
                                <label>Partner Type</label>
                                <select
                                    className="nested-form-input"
                                    name="partnerType"
                                    value={form.partnerType}
                                    onChange={handleChange}
                                    disabled={!!editingPartnerId}
                                >
                                    {partnerTypes.map((t) => (
                                        <option key={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="select-container"><label>Partner Status</label><select className="nested-form-input" name="partnerStatus" value={form.partnerStatus} onChange={handleChange}>{partnerStatuses.map((s) => <option key={s}>{s}</option>)}</select></div>

                            {/* Allowed Products with checkboxes */}
                            <div className="select-container relative">
                                <label className="select-label">Allowed Products</label>
                                <div
                                    className="dropdown-toggle nested-form-input cursor-pointer"
                                    onClick={() => setProductDropdownVisible(!productDropdownVisible)}
                                >

                                    {form.allowedProducts.length > 0
                                        ? `Selected: ${form.allowedProducts}`
                                        : "Select Products"}
                                </div>

                                {productDropdownVisible && (
                                    <div className="absolute z-50 mt-2 border rounded w-full max-h-48 overflow-y-auto shadow-lg bg-[#0f2c26]">
                                        {productList.map((product) => (
                                            <label
                                                key={product.productId}
                                                className="flex items-center space-x-2 px-4 py-1"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={String(form.allowedProducts)
                                                        .split(",")
                                                        .includes(product.productName)}
                                                    onChange={() => toggleAllowedProduct(product.productName)}
                                                    className="product-checkbox"
                                                />
                                                <span className="product-dropdown-text">
                                                    {product.productName}
                                                </span>

                                            </label>
                                        ))}

                                        {productList.length === 0 && (
                                            <div className="px-4 py-2 text-sm text-gray-500">
                                                No available products
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Selected products section */}
                            <div>
                                {form.allowedProducts && String(form.allowedProducts).trim() !== "" && (
                                    <div className="mb-2 p-2 border rounded bg-[#0f2c26] text-white">
                                        <h4 className="text-sm font-semibold mb-1">Selected Products:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {String(form.allowedProducts).split(",").map((id) => {
                                                const trimmedId = id.trim();
                                                const product = productList.find((p) => String(p.productId) === trimmedId);
                                                return (
                                                    <span
                                                        key={trimmedId}
                                                        className="flex items-center space-x-1 bg-green-900 px-2 py-1 rounded text-sm"
                                                    >
                                                        <span>{product ? `${product.productId} - ${product.productName}` : trimmedId}</span>
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex">
                                <div>
                                    <div className="radio-group">
                                        <label className="custom-radio">
                                            <input
                                                type="checkbox"
                                                name="portalAccessEnabled"
                                                checked={form.portalAccessEnabled}
                                                onChange={handleChange}
                                            />
                                            <span className="radio-indicator"></span> Portal Access Enabled
                                        </label>
                                    </div>
                                </div>

                                {form.portalAccessEnabled && <div><label>Portal URL</label><input name="portalUrl" value={form.portalUrl} onChange={handleChange} /></div>}
                            </div>

                            {/* --- New: Document Uploads (bytea/base64) --- */}
                            <div className="select-container" style={{ gridColumn: "1 / -1" }}>
                                <label className="select-label">Documents</label>
                                <div className="form-grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
                                    {renderFileInput("Agreement Document", "agreementDocument", "PDF/JPG/PNG, Max 5MB")}
                                    {renderFileInput("ID Proof Document", "idProofDocument", "PDF/JPG/PNG, Max 2MB")}
                                    {renderFileInput("Address Proof Document", "addressProofDocument", "PDF/JPG/PNG, Max 2MB")}
                                </div>
                            </div>

                        </div>

                        {/* Advanced Config Toggle */}
                        <div className="advanced-toggle">
                            <button type="button" onClick={() => setShowAdvancedConfig(!showAdvancedConfig)}>
                                {showAdvancedConfig ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                {showAdvancedConfig ? "Hide Advanced Configuration" : "Show Advanced Configuration"}
                            </button>
                        </div>

                        {/* Advanced Configuration */}
                        {showAdvancedConfig && (
                            <div className="advanced-section">
                                <div className="config-block">
                                    <h3>Compliance & KYC</h3>
                                    {renderSelectField("KYC Level", "kycLevel", kycLevels)}
                                    {renderInputField("PAN Number", "panNumber")}
                                    {renderInputField("TAN Number", "tanNumber")}
                                    {renderInputField("GSTIN", "gstin")}
                                    {renderSelectField("Risk Profile", "riskProfile", riskProfiles)}
                                    {/* <div className="flex gap-4">
                                        {renderCheckboxField("PEP Check", "pepCheck")}
                                        {renderCheckboxField("Sanctions Screening", "sanctionsScreening")}
                                        {renderCheckboxField("Blacklisted", "blacklisted")}
                                    </div> */}
                                </div>

                                <div className="config-block">
                                    <h3>Financial Configuration</h3>
                                    {renderInputField("Card Issuance Commission %", "cardIssuanceCommissionPercent", "number")}
                                    {renderInputField("Transaction Commission %", "transactionCommissionPercent", "number")}
                                    {renderInputField("Monthly Fixed Fee", "monthlyFixedFee", "number")}
                                    {renderSelectField("Commission Currency", "commissionCurrency", commissionCurrencies)}
                                    {renderSelectField("Settlement Frequency", "settlementFrequency", settlementFrequencies)}
                                </div>
                            </div>
                        )}

                        <div className="form-actions">
                            <button type="submit" className="btn-green">{editingPartnerId ? "Update Partner" : "Create Partner"}</button>
                            <button type="button" className="btn-gray" onClick={resetForm}>Cancel</button>
                        </div>
                    </form>
                )}

                <div className="search-bar">
                    <Search className="search-icon" />
                    <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search partners..." />
                </div>

                <table className="product-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Partner Name</th>
                            <th>Type</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th>KYC Status</th>
                            <th>Agreement</th>
                            <th>ID Proof</th>
                            <th>Address Proof</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPartners.map((p, idx) => {
                            const aHref = dataHref(p.agreementDocument);
                            const iHref = dataHref(p.idProofDocument);
                            const adHref = dataHref(p.addressProofDocument);
                            return (
                                <tr key={p.partnerId || idx}>
                                    <td>{idx + 1}</td>
                                    <td>{p.partnerName}</td>
                                    <td>{p.partnerType}</td>
                                    <td>{p.contactName}</td>
                                    <td>{p.partnerStatus}</td>
                                    <td>{p.kycStatus}</td>
                                    <td>{aHref ? <a className="link-download" href={aHref} download={`${p.partnerName}_agreement`}>Download</a> : "—"}</td>
                                    <td>{iHref ? <a className="link-download" href={iHref} download={`${p.partnerName}_idproof`}>Download</a> : "—"}</td>
                                    <td>{adHref ? <a className="link-download" href={adHref} download={`${p.partnerName}_addressproof`}>Download</a> : "—"}</td>
                                    <td className="flex gap-2">
                                        <button onClick={() => handleEdit(p)} className="edit-btn">
                                            <PencilIcon className="w-4 h-4" /> Edit
                                        </button>
                                        {/* <button onClick={() => handleDelete(p)} className="btn-gray">Delete</button> */}
                                        <button onClick={() => handleClone(p)} className="btn-green">Clone</button>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredPartners.length === 0 && (
                            <tr>
                                <td colSpan={10} className="no-data">No partners found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isVisible && (
                <button onClick={scrollToHeader} className="scroll-top">
                    <ArrowUp size={22} />
                </button>
            )}
        </div>
    );
}
