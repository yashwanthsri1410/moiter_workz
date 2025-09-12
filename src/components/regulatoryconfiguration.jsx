import {
  Building2,
  Eye,
  File,
  FileText,
  Search,
  SquarePen,
  Save,
  SaveAll,
  EyeClosed,
  EyeOff,
  ArrowLeft,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";
import usePublicIp from "../hooks/usePublicIp";
import "../styles/styles.css";
import { channels, options } from "../constants";
// import { PencilIcon, Plus,SquarePen  } from "lucide-react";

export default function RegulatoryConfig() {
  const [configurations, setConfigurations] = useState([]);
  const [form, setForm] = useState({});
  const [formOpen, setformOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const editingIdRef = useRef(null); // ✅ initialize ref
  const ip = usePublicIp();
  const username = localStorage.getItem("username") || "system";
  const [currentPage, setCurrentPage] = useState(1);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const rowsPerPage = 5;
  const getDefaultForm = (ip, editingId = null) => ({
    programType: "",
    subCategory: "",
    programDescription: "",
    issuerType: "Bank",
    authorizationRequired: false,
    validityMinDays: 0,
    validityMaxDays: 0,
    reloadable: false,
    transferable: false,
    autoBlockOnExpiry: false,
    allowPartialKycActivation: false,
    currency: "INR",
    multiUseAllowed: false,
    minBalance: 0,
    maxBalance: 0,
    maxLoadAmount: 0,
    dailySpendLimit: 0,
    monthlySpendLimit: 0,
    yearlySpendLimit: 0,
    txnCountLimitPerDay: 0,
    refundLimit: 0,
    atmWithdrawalEnabled: false,
    maxCashWithdrawalAmount: 0,
    coBrandingAllowed: false,
    validityPeriodMonths: 0,
    gracePeriodDays: 0,
    autoRenewal: false,
    closureAllowedPostExpiry: false,
    kycRequired: false,
    kycLevelRequired: "",
    aadhaarRequired: false,
    panRequired: false,
    additionalKycDocsNeeded: false,
    amlCftApplicable: false,
    riskProfile: "",
    pepCheckRequired: false,
    blacklistCheckRequired: false,
    ckycUploadRequired: false,
    domesticTransferAllowed: false,
    crossBorderAllowed: false,
    allowedChannels: [],
    allowedMccCodes: undefined,
    geoRestrictions: [],
    merchantWhitelistOnly: false,
    blockOnFailedKycAttempts: false,
    regulatoryReportingRequired: false,
    monthlyBalanceReportRequired: false,
    auditTrailEnabled: false,
    transactionReportableFlags: '{"payroll": true}',
    customerAgeMin: 0,
    customerAgeMax: 0,
    eligibleCustomerTypes: [],
    employmentTypesAllowed: [],
    partnerApiEnabled: false,
    partnerSettlementModel: "Float",
    cashLoadingLimit: 0,
    cardType: "",
    expiryWarningDays: 0,
    expiryPeriod: 0,
    dormantPeriodDays: 0,
    topupMethod: "",
    ...(editingId ? { modifiedBy: username } : { createdBy: username }),
    metadata: {
      ipAddress: ip,
      userAgent: navigator.userAgent,
      headers: "frontend",
      channel: "web",
      auditMetadata: {
        createdBy: "username",
        createdDate: new Date().toISOString(),
        modifiedBy: "username",
        modifiedDate: new Date().toISOString(),
        header: {},
      },
    },
  });
  // Filter configurations based on search
  const filteredConfigurations = useMemo(() => {
    return configurations.filter(
      (cfg) =>
        cfg.subCategory?.toLowerCase().includes(search.toLowerCase()) ||
        cfg.programType?.toLowerCase().includes(search.toLowerCase())
    );
  }, [configurations, search]);

  // Pagination logic
  const totalPages = Math.ceil(filteredConfigurations.length / rowsPerPage);
  const paginatedData = filteredConfigurations.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const typeColors = {
    active: "active",
    inactive: "inactive",
  };
  useEffect(() => {
    fetchConfigurations();
    setForm(getDefaultForm(ip, username));
  }, [ip]);

  const fetchConfigurations = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/fes/api/Export/export_rbi_configuration`
      );
      setConfigurations(res.data);
    } catch (err) {
      console.error("Error fetching configurations:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: numberFields.includes(name)
        ? Number(value)
        : type === "checkbox"
        ? checked
        : value,
    }));
  };

  const handleBooleanSelect = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value === "yes",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEditing = editingIdRef.current !== null;

    // Convert arrays or objects to match API schema
    const payload = {
      ...form,
      productId: editingIdRef.current || form.productId,
      transactionReportableFlags:
        typeof form.transactionReportableFlags === "string"
          ? form.transactionReportableFlags
          : JSON.stringify(form.transactionReportableFlags || {}), // Ensure string
      // ✅ Map UI -> API
      topupMethod: form.topupMethod || "",

      allowedChannels: Array.isArray(form.allowedChannels)
        ? form.allowedChannels
        : form.allowedChannels
        ? [form.allowedChannels]
        : [],

      allowedMccCodes: undefined, // Remove if not part of schema
      ...(isEditing ? { modifiedBy: username } : { createdBy: username }),
      metadata: {
        ...form.metadata,
        ipAddress: ip || "0.0.0.0",
        userAgent: navigator.userAgent,
        headers: "frontend",
        channel: "web",
        auditMetadata: {
          createdBy: username,
          createdDate: isEditing
            ? form.metadata.auditMetadata.createdDate
            : new Date().toISOString(),
          modifiedBy: username,
          modifiedDate: new Date().toISOString(),
          header: form.metadata?.auditMetadata?.header || {
            additionalProp1: {
              options: { propertyNameCaseInsensitive: true },
              parent: "string",
              root: "string",
            },
          },
        },
      },
    };
    // console.log(payload)
    // console.log(JSON.stringify(payload, null, 2));
    try {
      const endpoint = isEditing
        ? `${API_BASE_URL}/ps/updateRbiConfiguration`
        : `${API_BASE_URL}/ps/create-RBI-Config`;

      await axios[isEditing ? "put" : "post"](endpoint, payload);

      alert("Configuration saved successfully!");
      setForm(getDefaultForm(ip, username));
      setEditingId(null);
      editingIdRef.current = null;
      fetchConfigurations();
    } catch (err) {
      console.error("API Error:", err);
      alert("Failed to save configuration");
    }
  };

  const handleEdit = (data) => {
    setForm({
      ...getDefaultForm(ip, username),
      ...data,
      transactionReportableFlags:
        typeof data.transactionReportableFlags === "object"
          ? JSON.stringify(data.transactionReportableFlags, null, 2)
          : data.transactionReportableFlags || "",
    });
    setEditingId(data.productId);
    editingIdRef.current = data.productId; // ✅ store it
  };

  const numberFields = [
    "cashLoadingLimit",
    "maxBalance",
    "minBalance",
    "maxLoadAmount",
    "dailySpendLimit",
    "monthlySpendLimit",
    "yearlySpendLimit",
    "txnCountLimitPerDay",
    "refundLimit",
    "maxCashWithdrawalAmount",
    "validityPeriodMonths",
    "gracePeriodDays",
    "customerAgeMin",
    "customerAgeMax",
    "expiryWarningDays",
    "dormantPeriodDays",
    "expiryPeriod",
  ];

  const toggleLoading = (method) => {
    let current = form.topupMethod || ""; // always a string
    let list = current ? current.split(",") : [];

    if (list.includes(method)) {
      list = list.filter((m) => m !== method);
    } else {
      list.push(method);
    }

    setForm({
      ...form,
      topupMethod: list.join(","), // save as string
    });
  };

  const toggleUnloading = (method) => {
    if (form.allowedChannels?.includes(method)) {
      setForm({
        ...form,
        allowedChannels: form.allowedChannels.filter((m) => m !== method),
      });
    } else {
      setForm({
        ...form,
        allowedChannels: [...(form.allowedChannels || []), method],
      });
    }
  };
  return (
    <div className="config-forms">
      {/* Header */}
      <div className="card-header">
        <div className="card-header-left">
          <div className="flex items-center gap-[10px]">
            <div className="header-icon-box">
              <FileText className="text-[#00d4aa] w-4 h-4" />
            </div>
          </div>
          <div>
            <h1 className="header-title">
              Regulatory Configuration Management
            </h1>
            <p className="header-subtext">
              Configure regulatory compliance and guidelines
            </p>
          </div>
        </div>

        <div className="card-header-right">
          <button
            className="btn-outline"
            onClick={() => setformOpen((prev) => !prev)}
          >
            {formOpen ? (
              <>
                <span className="btn-icon">
                  <EyeOff className="w-4 h-4" />
                </span>
                Hide Form
              </>
            ) : (
              <>
                {" "}
                <span className="btn-icon">
                  <Eye className="w-4 h-4" />
                </span>{" "}
                Show Form
              </>
            )}
          </button>
          <div className="portal-info">
            <p className="portal-label">Content Creation</p>
            <p className="portal-link">Maker Portal</p>
          </div>
        </div>
      </div>

      {formOpen && (
        <form onSubmit={handleSubmit} className="department-form mt-[18px]">
          <div className="page-header">
            <h2 className="form-title flex ">
              <FileText className="text-[#00d4aa] w-5 h-5 mr-[10px]" />
              {editingId
                ? "Update Regulatory Configuration"
                : "Create Regulatory Configuration"}
            </h2>
          </div>

          {/* Basic Program Details */}
          <div className="form-section">
            <h3 className="section-title">Basic Program Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Program Type</label>
                <select
                  name="programType"
                  value={form.programType}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select</option>
                  <option value="Closed">Closed</option>
                  <option value="Semi Closed">Semi-Closed</option>
                  <option value="Open">Open</option>
                </select>
              </div>
              <div className="form-group">
                <label>Sub Category</label>
                <input
                  type="text"
                  name="subCategory"
                  className="form-input"
                  placeholder="Enter sub category"
                  value={form.subCategory}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Card Type</label>
                <select
                  name="cardType"
                  value={form.cardType}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select</option>
                  <option value="Physical">Physical</option>
                  <option value="Virtual">Virtual</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group full-width">
                <label>Program Description</label>
                <textarea
                  name="programDescription"
                  value={form.programDescription}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter program description"
                />
              </div>
            </div>
          </div>

          {/* KYC & Compliance */}
          <div className="form-section">
            <h3 className="section-title">KYC & Compliance</h3>

            <div className="kyc-compliance-grid">
              {/* Left Column - Dropdowns */}
              <div className="kyc-left">
                <div className="form-group">
                  <label>KYC Level Required</label>
                  <select
                    name="kycLevelRequired"
                    value={form.kycLevelRequired}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">Select KYC level</option>
                    <option value="nil">Nil</option>
                    <option value="min">Min</option>
                    <option value="medium">Medium</option>
                    <option value="full">Full</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Risk Profile</label>
                  <select
                    name="riskProfile"
                    value={form.riskProfile}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">Select risk profile</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Right Column - Compliance */}
              <div className="compliance-table">
                {[
                  "kycRequired",
                  "aadhaarRequired",
                  "panRequired",
                  "additionalKycDocsNeeded",
                  "amlCftApplicable",
                  "pepCheckRequired",
                  "blacklistCheckRequired",
                  "ckycUploadRequired",
                ].map((field) => {
                  // Custom labels for specific fields
                  const customLabels = {
                    kycRequired: "KYC Required",
                    aadhaarRequired: "AADHAAR Required",
                    panRequired: "PAN Required",
                    amlCftApplicable: "AML/CFT Applicable",
                    ckycUploadRequired: "CKYC Upload Required",
                  };

                  const label =
                    customLabels[field] ||
                    field
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase());

                  return (
                    <div className="compliance-row" key={field}>
                      <span className="compliance-label">{label}</span>
                      <div className="radio-group">
                        <label>
                          <input
                            type="radio"
                            name={field}
                            value="yes"
                            checked={form[field] === true}
                            onChange={handleBooleanSelect}
                          />{" "}
                          Yes
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={field}
                            value="no"
                            checked={form[field] === false}
                            onChange={handleBooleanSelect}
                          />{" "}
                          No
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Transaction Limits */}
          <div className="form-section bg-[#0d0f13] p-4 rounded-md border border-gray-800">
            <h3 className="section-title text-teal-400 mb-4">
              Transaction Limits
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="form-group flex flex-col">
                <label className="text-sm text-gray-300 mb-1">
                  Cash Loading Limit
                </label>
                <input
                  type="number"
                  name="cashLoadingLimit"
                  value={form.cashLoadingLimit || ""}
                  onChange={handleChange}
                  className="form-input bg-transparent border border-gray-700 text-gray-200 rounded-md p-2 focus:border-teal-400 focus:outline-none"
                  placeholder="Enter amount"
                />
              </div>

              <div className="form-group flex flex-col">
                <label className="text-sm text-gray-300 mb-1">
                  Daily Spend Limit
                </label>
                <input
                  type="number"
                  name="dailySpendLimit"
                  value={form.dailySpendLimit || ""}
                  onChange={handleChange}
                  className="form-input bg-transparent border border-gray-700 text-gray-200 rounded-md p-2 focus:border-teal-400 focus:outline-none"
                  placeholder="Enter amount"
                />
              </div>

              <div className="form-group flex flex-col">
                <label className="text-sm text-gray-300 mb-1">
                  Monthly Spend Limit
                </label>
                <input
                  type="number"
                  name="monthlySpendLimit"
                  value={form.monthlySpendLimit || ""}
                  onChange={handleChange}
                  className="form-input bg-transparent border border-gray-700 text-gray-200 rounded-md p-2 focus:border-teal-400 focus:outline-none"
                  placeholder="Enter amount"
                />
              </div>

              <div className="form-group flex flex-col">
                <label className="text-sm text-gray-300 mb-1">
                  Min Balance
                </label>
                <input
                  type="number"
                  name="minBalance"
                  value={form.minBalance || 0}
                  onChange={handleChange}
                  className="form-input bg-transparent border border-gray-700 text-gray-200 rounded-md p-2 focus:border-teal-400 focus:outline-none"
                  placeholder="Enter amount"
                />
              </div>

              <div className="form-group flex flex-col">
                <label className="text-sm text-gray-300 mb-1">
                  Max Balance
                </label>
                <input
                  type="number"
                  name="maxBalance"
                  value={form.maxBalance || ""}
                  onChange={handleChange}
                  className="form-input bg-transparent border border-gray-700 text-gray-200 rounded-md p-2 focus:border-teal-400 focus:outline-none"
                  placeholder="Enter amount"
                />
              </div>

              <div className="form-group flex flex-col">
                <label className="text-sm text-gray-300 mb-1">
                  Max Load Amount
                </label>
                <input
                  type="number"
                  name="maxLoadAmount"
                  value={form.maxLoadAmount || ""}
                  onChange={handleChange}
                  className="form-input bg-transparent border border-gray-700 text-gray-200 rounded-md p-2 focus:border-teal-400 focus:outline-none"
                  placeholder="Enter amount"
                />
              </div>
            </div>
          </div>

          {/* Features & Validity Settings */}
          <div className="form-section bg-[#0d0f13] p-4 rounded-md border border-gray-800">
            <h3 className="section-title text-teal-400 mb-4">
              Features & Validity Settings
            </h3>

            <div className="grid grid-cols-2 gap-8">
              {/* Left Section - Validity & Age Settings */}
              <div>
                <h4 className="text-teal-400 text-[15px] mb-[5px]">
                  Validity & Age Settings
                </h4>

                {/* <div className="form-group flex flex-col ">
                                    <label className="text-sm text-gray-300 mb-1">Validity Period (Months)</label>
                                    <input
                                        type="number"
                                        name="validityPeriodMonths"
                                        value={form.validityPeriodMonths || ""}
                                        onChange={handleChange}
                                        className="form-input bg-transparent border border-gray-700 text-gray-200 rounded-md p-2 focus:border-teal-400 focus:outline-none"
                                        placeholder="Enter months"
                                    />
                                </div> */}

                <div className="form-group flex flex-col ">
                  <label className="text-sm text-gray-300 mb-1">
                    Grace Period (Days)
                  </label>
                  <input
                    type="number"
                    name="gracePeriodDays"
                    value={form.gracePeriodDays || ""}
                    onChange={handleChange}
                    className="form-input bg-transparent border border-gray-700 text-gray-200 rounded-md p-2 focus:border-teal-400 focus:outline-none"
                    placeholder="Enter days"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group flex flex-col">
                    <label className="text-sm text-gray-300 mb-1">
                      Min Age
                    </label>
                    <input
                      type="number"
                      name="customerAgeMin"
                      value={form.customerAgeMin || ""}
                      onChange={handleChange}
                      className="form-input bg-transparent border border-gray-700 text-gray-200 rounded-md p-2 focus:border-teal-400 focus:outline-none"
                      placeholder="Min age"
                    />
                  </div>

                  {/* <div className="form-group flex flex-col">
                                        <label className="text-sm text-gray-300 mb-1">Max Age</label>
                                        <input
                                            type="number"
                                            name="customerAgeMax"
                                            value={form.customerAgeMax || ""}
                                            onChange={handleChange}
                                            className="form-input bg-transparent border border-gray-700 text-gray-200 rounded-md p-2 focus:border-teal-400 focus:outline-none"
                                            placeholder="Max age"
                                        />
                                    </div> */}
                </div>
              </div>

              {/* Right Section - Key Features */}
              <div className="kyc-right">
                <h4 className="compliance-title">Key Features</h4>
                <div className="compliance-table">
                  {[
                    {
                      label: "Authorization Required",
                      field: "authorizationRequired",
                    },
                    { label: "Reloadable", field: "reloadable" },
                    { label: "Transferable", field: "transferable" },
                    {
                      label: "ATM Withdrawal Enabled",
                      field: "atmWithdrawalEnabled",
                    },
                    {
                      label: "Domestic Transfer Allowed",
                      field: "domesticTransferAllowed",
                    },
                    {
                      label: "Cross Border Allowed",
                      field: "crossBorderAllowed",
                    },
                  ].map(({ label, field }) => (
                    <div key={field} className="compliance-row">
                      <span className="compliance-label">{label}</span>
                      <div className="flex items-center gap-4">
                        <label className="radio-group">
                          <input
                            type="radio"
                            name={field}
                            value="yes"
                            checked={form[field] === true}
                            onChange={handleBooleanSelect}
                            className="accent-teal-400"
                          />
                          <span className="text-sm">Yes</span>
                        </label>
                        <label className="radio-group">
                          <input
                            type="radio"
                            name={field}
                            value="no"
                            checked={form[field] === false}
                            onChange={handleBooleanSelect}
                            className="accent-teal-400"
                          />
                          <span className="text-sm">No</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods & Channels */}
          <div className="form-section bg-[#0d0f13] p-4 rounded-md border border-gray-800">
            <h3 className="section-title text-teal-400 mb-4">
              Payment Methods & Channels
            </h3>

            <div className="grid grid-cols-2 gap-8">
              {/* Left - Loading Channels */}
              <div>
                <h4 className="compliance-title text-gray-200 mb-2">
                  Loading Channels
                </h4>
                <div className="flex flex-col gap-3">
                  {options.map((method) => {
                    const checked = (form.topupMethod || "")
                      .split(",")
                      .includes(method); // ✅ works with string
                    return (
                      <label
                        key={method}
                        className="flex items-center gap-3 cursor-pointer text-gray-300"
                      >
                        <div
                          onClick={() => toggleLoading(method)}
                          className={`w-3 h-3 flex items-center justify-center border 
              ${
                checked
                  ? "bg-teal-500 border-teal-500"
                  : "bg-[#0d1220] border-teal-700/50"
              }
              transition-colors duration-200`}
                        >
                          {checked && (
                            <Check size={14} className="text-black" />
                          )}
                        </div>
                        <span className="text-[12px]">{method}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Right - Unloading Channels */}
              <div>
                <h4 className="compliance-title text-gray-200 mb-2">
                  Unloading Channels
                </h4>
                <div className="flex flex-col gap-3">
                  {channels.map((method) => {
                    const checked = form.allowedChannels?.includes(method);

                    const normalized = method.toLowerCase();

                    let formattedMethod = "";
                    if (normalized === "qr_code") {
                      formattedMethod = "QR Code"; // special case
                    } else if (
                      ["upi", "pos", "atm", "ecom"].includes(normalized)
                    ) {
                      formattedMethod = method.toUpperCase();
                    } else {
                      formattedMethod = method
                        .replace(/_/g, " ")
                        .split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )
                        .join(" ");
                    }

                    return (
                      <label
                        key={method}
                        className="flex items-center gap-3 cursor-pointer text-gray-300"
                      >
                        <div
                          onClick={() => toggleUnloading(method)}
                          className={`w-3 h-3 flex items-center justify-center border 
            ${
              checked
                ? "bg-teal-500 border-teal-500"
                : "bg-[#0d1220] border-teal-700/50"
            }
            transition-colors duration-200`}
                        >
                          {checked && (
                            <Check size={14} className="text-black" />
                          )}
                        </div>
                        <span className="text-[12px]">{formattedMethod}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="form-footer">
            {/* Left - Back */}
            <button
              type="button"
              className="btn-outline-back"
              onClick={() => setformOpen(false)}
            >
              <ArrowLeft className="icon" /> Back
            </button>

            {/* Right - Reset + Submit */}
            <div className="footer-right">
              <button
                type="button"
                className="btn-outline-reset"
                onClick={() => setForm(getDefaultForm(ip, username))}
              >
                <RotateCcw className="icon" /> Reset
              </button>

              <button type="submit" className="btn-outline-reset">
                <Save className="icon" />
                {editingId ? "Update Configuration" : "Create Configuration"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Existing Configurations */}
      <div className="table-card mt-[18px]">
        <div className="table-header">
          <p className="table-title">
            <FileText className="w-5 h-5" />
            Existing Regulatory Configurations
          </p>
          {/* Search bar */}
          <div className="search-box">
            <Search className="absolute left-3 top-2 text-gray-400 w-3 h-3" />
            <input
              type="text"
              className="search-input"
              placeholder="Search regulations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)} // 🔹 bind search
            />
          </div>
        </div>

        <div className="table-wrapper">
          {/* Table */}
          <table className="w-full text-left">
            <thead className="table-head">
              <tr>
                {/* <th className="table-cell">#</th> */}

                <th className="table-cell">Configuration Name</th>
                <th className="table-cell">Program Type</th>
                <th className="table-cell">KYC Level</th>
                {/* <th className="table-cell">Status</th> */}
                <th className="table-cell">Remarks</th>
                <th className="table-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData &&
                paginatedData.map((cfg, idx) => {
                  const formattedKYCLevel =
                    cfg.kycLevelRequired.charAt(0).toUpperCase() +
                    cfg.kycLevelRequired.slice(1).toLowerCase();
                  return (
                    <tr key={cfg.productId || idx} className="table-row">
                      <td className="table-content">{cfg.subCategory}</td>
                      <td className="table-content">{cfg.programType}</td>
                      <td className="table-content">{formattedKYCLevel}</td>
                      {/* <td className="table-content">
                                        <span className={`status ${typeColors[cfg.p_Is_Active]
                                            }`} >
                                            {cfg.p_Is_Active ? "Active" : "Inactive"}
                                        </span>
                                    </td> */}
                      <td className="table-content">{cfg.remarks || "-"}</td>
                      <td className="table-content">
                        <button
                          className="header-icon-box"
                          onClick={() => {
                            handleEdit(cfg);
                            setformOpen(true);
                          }}
                        >
                          <SquarePen className="text-[#00d4aa] w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-500">
                    No regulations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 px-4">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
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
                onClick={() => setCurrentPage(i + 1)}
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
            onClick={() => setCurrentPage(currentPage + 1)}
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
      {/* Guidelines */}
      <div className="guidelines-card">
        <h3 className="guidelines-title">
          Regulatory Configuration Guidelines
        </h3>

        <div className="guidelines-grid">
          <p>
            ⚖️ <span>Compliance Mapping:</span> Assign applicable regulatory
            frameworks (e.g., GDPR, AML, KYC)
          </p>
          <p>
            📜 <span> Policy Upload:</span> Ensure regulatory policies and
            certifications are uploaded
          </p>
        </div>

        <div className="guidelines-grid">
          <p>
            🔒 <span> Access Control:</span> Define permissions in line with
            regulatory requirements
          </p>
          <p>
            📊 <span> Audit Trail:</span> Enable logging to track changes and
            regulatory approvals
          </p>
        </div>
      </div>
    </div>
  );
}
