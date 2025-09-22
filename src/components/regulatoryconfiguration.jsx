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
import { channels, inputStyle, options, transErr } from "../constants";
import ErrorText from "./reusable/errorText";
import { v4 as uuidv4 } from "uuid";
// import { PencilIcon, Plus,SquarePen  } from "lucide-react";

export default function RegulatoryConfig() {
  const [configurations, setConfigurations] = useState([]);
  const [form, setForm] = useState({});
  const [formOpen, setformOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState({});
  const editingIdRef = useRef(null); // ✅ initialize ref
  const ip = usePublicIp();
  const username = localStorage.getItem("username") || "system";
  const [currentPage, setCurrentPage] = useState(1);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const rowsPerPage = 5;
  const getDefaultForm = (ip, editingId = null) => ({
    logId: uuidv4(),
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
      logId: form.logId || uuidv4(),
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

  // Min Balance lower than everything
  const minBalCheck =
    form.minBalance < form.dailySpendLimit &&
    form.minBalance < form.monthlySpendLimit &&
    form.minBalance < form.cashLoadingLimit &&
    form.minBalance < form.maxBalance &&
    form.minBalance < form.maxLoadAmount;

  // Daily Spend Limit will be lower than Monthly Spend Limit
  const dailySpendCheck = form.dailySpendLimit > form.monthlySpendLimit;

  // Max Balance will be equal  or lesser than cash load
  const maxBalCheck = form.maxBalance <= form.cashLoadingLimit;

  // Max Load Amount will be equal or lesser than cash load
  const maxLoadAmtCheck = form.maxLoadAmount <= form.cashLoadingLimit;

  // cash load limit is highest than everything
  const cashLoadCheck =
    form.cashLoadingLimit > form.dailySpendLimit &&
    form.cashLoadingLimit > form.monthlySpendLimit &&
    form.cashLoadingLimit > form.minBalance &&
    form.cashLoadingLimit > form.maxBalance &&
    form.cashLoadingLimit > form.maxLoadAmount;

  const validateTxnLimits = () => {
    const newErrors = {};

    if (form.maxLoadAmount && form.cashLoadingLimit) {
      newErrors.maxLoadAmount = maxLoadAmtCheck ? "" : transErr.msg4;
    }

    if (form.maxBalance && form.cashLoadingLimit) {
      newErrors.maxBalance = maxBalCheck ? "" : transErr.msg3;
    }

    if (form.monthlySpendLimit && form.dailySpendLimit) {
      newErrors.dailySpendLimit = dailySpendCheck ? transErr.msg1 : "";
    }

    if (
      form.dailySpendLimit &&
      form.monthlySpendLimit &&
      form.cashLoadingLimit &&
      form.maxBalance &&
      form.maxLoadAmount &&
      form.minBalance
    ) {
      newErrors.minBalance = minBalCheck ? "" : transErr.msg2;
      newErrors.cashLoadingLimit = cashLoadCheck ? "" : transErr.msg5;
    }

    setError(newErrors);
  };

  useEffect(() => {
    validateTxnLimits();
  }, [
    form,
    maxLoadAmtCheck,
    maxBalCheck,
    dailySpendCheck,
    minBalCheck,
    transErr,
    cashLoadCheck,
  ]);

  return (
    <div className="config-forms">
      {/* Header */}
      <div className="card-header flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
        {/* Left Section */}
        <div className="card-header-left flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-2">
          <div className="flex items-center gap-2">
            <div className="header-icon-box bg-gray-100 p-2 rounded">
              <FileText className="primary-color w-4 h-4" />
            </div>
          </div>
          <div>
            <h1 className="header-title text-base sm:text-lg font-semibold text-center sm:text-left">
              Regulatory Configuration Management
            </h1>
            <p className="header-subtext text-sm sm:text-base text-gray-500 text-center sm:text-left">
              Configure regulatory compliance and guidelines
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="card-header-right flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <button
            className="btn-outline flex items-center gap-1 w-full sm:w-auto justify-center"
            onClick={() => setformOpen((prev) => !prev)}
          >
            {formOpen ? (
              <>
                <EyeOff className="w-4 h-4" />
                Hide Form
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Show Form
              </>
            )}
          </button>

          <div className="portal-info text-center sm:text-left">
            <p className="portal-label text-gray-400 text-sm">
              Content Creation
            </p>
            <p className="portal-link text-teal-500 text-sm font-medium text-center sm:text-right">
              Maker Portal
            </p>
          </div>
        </div>
      </div>

      {formOpen && (
        <form onSubmit={handleSubmit} className="department-form mt-[18px]">
          <div className="page-header">
            <h2 className="form-title flex ">
              <FileText className="primary-color w-5 h-5 mr-[10px]" />
              {editingId
                ? "Update Regulatory Configuration"
                : "Create Regulatory Configuration"}
            </h2>
          </div>

          {/* Basic Program Details */}
          <div className="form-section p-4 bg-white rounded-lg shadow-sm">
            <h3 className="section-title text-sm sm:text-lg font-semibold mb-4">
              Basic Program Details
            </h3>

            {/* First Row */}
            <div className="form-row flex flex-col sm:flex-row gap-4">
              <div className="form-group flex-1 flex flex-col">
                <label className="mb-1 text-xs sm:text-sm font-medium">
                  Program Type
                </label>
                <select
                  name="programType"
                  value={form.programType}
                  onChange={handleChange}
                  className="form-input p-2 border border-gray-300 rounded text-xs sm:text-sm"
                >
                  <option value="">Select</option>
                  <option value="Closed">Closed</option>
                  <option value="Semi-Closed">Semi-Closed</option>
                  <option value="Open">Open</option>
                </select>
              </div>

              <div className="form-group flex-1 flex flex-col">
                <label className="mb-1 text-xs sm:text-sm font-medium">
                  Sub Category
                </label>
                <input
                  type="text"
                  name="subCategory"
                  value={form.subCategory}
                  onChange={handleChange}
                  placeholder="Enter sub category"
                  className="form-input p-2 border border-gray-300 rounded text-xs sm:text-sm"
                />
              </div>

              <div className="form-group flex-1 flex flex-col">
                <label className="mb-1 text-xs sm:text-sm font-medium">
                  Card Type
                </label>
                <select
                  name="cardType"
                  value={form.cardType}
                  onChange={handleChange}
                  className="form-input p-2 border border-gray-300 rounded text-xs sm:text-sm"
                >
                  <option value="">Select</option>
                  <option value="Physical">Physical</option>
                  <option value="Virtual">Virtual</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </div>

            {/* Second Row */}
            <div className="form-row mt-4">
              <div className="form-group flex flex-col w-full">
                <label className="mb-1 text-xs sm:text-sm font-medium">
                  Program Description
                </label>
                <textarea
                  name="programDescription"
                  value={form.programDescription}
                  onChange={handleChange}
                  placeholder="Enter program description"
                  className="form-input p-2 border border-gray-300 rounded text-xs sm:text-sm w-full table-scrollbar"
                />
              </div>
            </div>
          </div>

          {/* KYC & Compliance */}
          <div className="form-section p-4 bg-white rounded-lg shadow-sm">
            <h3 className="section-title text-sm sm:text-lg font-semibold mb-4">
              KYC & Compliance
            </h3>

            {/* Grid layout */}
            <div className="kyc-compliance-grid grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Left Column - Dropdowns */}
              <div className="kyc-left flex flex-col gap-3">
                <div className="form-group flex flex-col">
                  <label className="mb-1 text-xs sm:text-sm font-medium">
                    KYC Level Required
                  </label>
                  <select
                    name="kycLevelRequired"
                    value={form.kycLevelRequired}
                    onChange={handleChange}
                    className="form-input p-2 border border-gray-300 rounded text-xs sm:text-sm"
                  >
                    <option value="">Select KYC level</option>
                    <option value="nil">Nil</option>
                    <option value="min">Min</option>
                    <option value="medium">Medium</option>
                    <option value="full">Full</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div className="form-group flex flex-col">
                  <label className="mb-1 text-xs sm:text-sm font-medium">
                    Risk Profile
                  </label>
                  <select
                    name="riskProfile"
                    value={form.riskProfile}
                    onChange={handleChange}
                    className="form-input p-2 border border-gray-300 rounded text-xs sm:text-sm"
                  >
                    <option value="">Select risk profile</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Right Column - Compliance */}
              <div className="compliance-table flex flex-col gap-3">
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
                    <div
                      className="compliance-row flex flex-col sm:flex-row sm:items-center sm:justify-between !items-start sm:!items-center text-left"
                      key={field}
                    >
                      <span className="compliance-label text-xs  font-medium">
                        {label}
                      </span>
                      <div className="radio-group flex gap-2 text-xs sm:text-sm">
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name={field}
                            value="yes"
                            checked={form[field] === true}
                            onChange={handleBooleanSelect}
                          />
                          Yes
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name={field}
                            value="no"
                            checked={form[field] === false}
                            onChange={handleBooleanSelect}
                          />
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
            <h3 className="section-title primary-color text-sm sm:text-base mb-4">
              Transaction Limits
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {/* Cash Loading Limit */}
              <div className="form-group flex flex-col">
                <label className="text-xs sm:text-sm text-gray-300 mb-1">
                  Cash Loading Limit
                </label>
                <input
                  type="number"
                  name="cashLoadingLimit"
                  value={form.cashLoadingLimit || ""}
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="Enter amount"
                />
                <ErrorText
                  errTxt={error.cashLoadingLimit}
                  className="text-[9px] sm:text-xs"
                />
              </div>

              {/* Daily Spend Limit */}
              <div className="form-group flex flex-col">
                <label className="text-xs sm:text-sm text-gray-300 mb-1">
                  Daily Spend Limit
                </label>
                <input
                  type="number"
                  name="dailySpendLimit"
                  value={form.dailySpendLimit || ""}
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="Enter amount"
                />
                <ErrorText
                  errTxt={error.dailySpendLimit}
                  className="text-[9px] sm:text-xs"
                />
              </div>

              {/* Monthly Spend Limit */}
              <div className="form-group flex flex-col">
                <label className="text-xs sm:text-sm text-gray-300 mb-1">
                  Monthly Spend Limit
                </label>
                <input
                  type="number"
                  name="monthlySpendLimit"
                  value={form.monthlySpendLimit || ""}
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="Enter amount"
                />
              </div>

              {/* Min Balance */}
              <div className="form-group flex flex-col">
                <label className="text-xs sm:text-sm text-gray-300 mb-1">
                  Min Balance
                </label>
                <input
                  type="number"
                  name="minBalance"
                  value={form.minBalance || ""}
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="Enter amount"
                />
                <ErrorText
                  errTxt={error.minBalance}
                  className="text-[9px] sm:text-xs"
                />
              </div>

              {/* Max Balance */}
              <div className="form-group flex flex-col">
                <label className="text-xs sm:text-sm text-gray-300 mb-1">
                  Max Balance
                </label>
                <input
                  type="number"
                  name="maxBalance"
                  value={form.maxBalance || ""}
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="Enter amount"
                />
                <ErrorText
                  errTxt={error.maxBalance}
                  className="text-[9px] sm:text-xs"
                />
              </div>

              {/* Max Load Amount */}
              <div className="form-group flex flex-col">
                <label className="text-xs sm:text-sm text-gray-300 mb-1">
                  Max Load Amount
                </label>
                <input
                  type="number"
                  name="maxLoadAmount"
                  value={form.maxLoadAmount || ""}
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="Enter amount"
                />
                <ErrorText
                  errTxt={error.maxLoadAmount}
                  className="text-[9px] sm:text-xs"
                />
              </div>
            </div>
          </div>

          {/* Features & Validity Settings */}
          <div className="form-section bg-[#0d0f13] p-4 rounded-md border border-gray-800">
            <h3 className="section-title primary-color mb-4 text-left">
              Features & Validity Settings
            </h3>

            {/* Responsive grid: 1 column on small, 2 on medium and above */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Section - Validity & Age Settings */}
              <div className="text-left">
                <h4 className="compliance-title text-[15px] mb-[5px] text-left">
                  Validity & Age Settings
                </h4>

                <div className="form-group flex flex-col text-left">
                  <label className="text-sm text-gray-300 mb-1 text-left">
                    Grace Period (Days)
                  </label>
                  <input
                    type="number"
                    name="gracePeriodDays"
                    value={form.gracePeriodDays || ""}
                    onChange={handleChange}
                    className={inputStyle}
                    placeholder="Enter days"
                  />
                </div>

                <div className="form-group flex flex-col text-left">
                  <label className="text-sm text-gray-300 mb-1 text-left">
                    Min Age
                  </label>
                  <input
                    type="number"
                    name="customerAgeMin"
                    value={form.customerAgeMin || ""}
                    onChange={handleChange}
                    className={inputStyle}
                    placeholder="Min age"
                  />
                </div>
              </div>

              {/* Right Section - Key Features */}
              <div className="kyc-right text-left">
                <h4 className="compliance-title text-left">Key Features</h4>
                <div className="compliance-table space-y-3">
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
                    <div
                      key={field}
                      className="compliance-row flex flex-col sm:flex-row sm:items-center sm:justify-between !items-start sm:!items-center text-left"
                    >
                      <span className="compliance-label text-gray-300 mb-1 sm:mb-0 text-left">
                        {label}
                      </span>
                      <div className="flex items-center gap-4">
                        <label className="radio-group flex items-center gap-1">
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
                        <label className="radio-group flex items-center gap-1">
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
          <div className="form-section">
            <h3 className="section-title primary-color mb-4">
              Payment Methods & Channels
            </h3>

            {/* Responsive grid: 1 column on mobile, 2 on md+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left - Loading Channels */}
              <div>
                <h4 className="compliance-title text-gray-200 mb-2 text-sm sm:text-base">
                  Loading Channels
                </h4>
                <div className="flex flex-col gap-3">
                  {options.map((method) => {
                    const checked = (form.topupMethod || "")
                      .split(",")
                      .includes(method);

                    return (
                      <label
                        key={method}
                        className="flex items-center gap-3 cursor-pointer text-gray-300"
                      >
                        <div
                          onClick={() => toggleLoading(method)}
                          className={`w-3 h-3 flex items-center justify-center border rounded-sm 
              ${checked ? "check-box-clr-after" : "check-box-clr-before"}
              transition-colors duration-200`}
                        >
                          {checked && (
                            <Check size={14} className="text-black" />
                          )}
                        </div>
                        <span className="text-xs sm:text-sm">{method}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Right - Unloading Channels */}
              <div>
                <h4 className="compliance-title text-gray-200 mb-2 text-sm sm:text-base">
                  Unloading Channels
                </h4>
                <div className="flex flex-col gap-3">
                  {channels.map((method) => {
                    const checked = form.allowedChannels?.includes(method);
                    const normalized = method.toLowerCase();

                    let formattedMethod = "";
                    if (normalized === "qr_code") {
                      formattedMethod = "QR Code";
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
            ${checked ? "check-box-clr-after" : "check-box-clr-before"}
            transition-colors duration-200`}
                        >
                          {checked && (
                            <Check size={14} className="text-black" />
                          )}
                        </div>
                        <span className="text-xs sm:text-sm">
                          {formattedMethod}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="form-footer flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 text-xs sm:text-sm">
            {/* Left - Back */}
            <button
              type="button"
              className="btn-outline-back flex items-center justify-center gap-1.5 px-3 py-1.5 w-full sm:w-auto"
              onClick={() => setformOpen(false)}
            >
              <ArrowLeft className="icon w-3.5 h-3.5" /> Back
            </button>

            {/* Right - Reset + Submit */}
            <div className="footer-right flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                type="button"
                className="btn-outline-reset flex items-center justify-center gap-1.5 px-3 py-1.5 w-full sm:w-auto"
                onClick={() => setForm(getDefaultForm(ip, username))}
              >
                <RotateCcw className="icon w-3.5 h-3.5" /> Reset
              </button>

              <button
                type="submit"
                className="btn-outline-reset flex items-center justify-center gap-1.5 px-3 py-1.5 w-full sm:w-auto"
              >
                <Save className="icon w-3.5 h-3.5" />
                {editingId ? "Update Configuration" : "Create Configuration"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Existing Configurations */}
      <div className="table-card mt-[18px]">
        <div className="table-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          {/* Title */}
          <p className="table-title flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-200">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#00d4aa]" />
            Existing Regulatory Configurations
          </p>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" />
            <input
              type="text"
              className="search-input !w-full pl-8 pr-3 py-2 text-xs sm:text-sm rounded-md border border-gray-700 bg-[#0d0f13] text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#00d4aa]"
              placeholder="Search regulations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrapper w-full overflow-x-auto table-scrollbar">
          {/* Table */}
          <table className="min-w-full text-left text-sm sm:text-base border-collapse ">
            <thead className="table-head bg-gray-50">
              <tr>
                <th className="table-cell px-4 py-2 whitespace-nowrap">
                  Configuration Name
                </th>
                <th className="table-cell px-4 py-2 whitespace-nowrap">
                  Program Type
                </th>
                <th className="table-cell px-4 py-2 whitespace-nowrap">
                  KYC Level
                </th>
                <th className="table-cell px-4 py-2 whitespace-nowrap">
                  Remarks
                </th>
                <th className="table-cell px-4 py-2 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData &&
                paginatedData.map((cfg, idx) => {
                  const formattedKYCLevel =
                    cfg.kycLevelRequired.charAt(0).toUpperCase() +
                    cfg.kycLevelRequired.slice(1).toLowerCase();
                  return (
                    <tr
                      key={cfg.productId || idx}
                      className="table-row border-b"
                    >
                      <td className="table-content px-4 py-2 max-w-[120px] whitespace-nowrap">
                        <p className="truncate" title={cfg.subCategory}>
                          {cfg.subCategory}
                        </p>
                      </td>
                      <td className="table-content px-4 py-2 whitespace-nowrap">
                        {cfg.programType}
                      </td>
                      <td className="table-content px-4 py-2 whitespace-nowrap">
                        {formattedKYCLevel}
                      </td>
                      <td className="table-content px-4 py-2 whitespace-nowrap">
                        {cfg.remarks || "-"}
                      </td>
                      <td className="table-content px-4 py-2 whitespace-nowrap">
                        <button
                          className="header-icon-box p-1 sm:p-2"
                          onClick={() => {
                            handleEdit(cfg);
                            setformOpen(true);
                          }}
                        >
                          <SquarePen className="text-[#00d4aa] w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center py-4 text-gray-500 text-sm"
                  >
                    No regulations found.
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
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm w-full sm:w-auto justify-center ${
              currentPage === 1
                ? "bg-[#1c2b45] text-gray-500 cursor-not-allowed"
                : "bg-[#0a1625] text-white hover:primary-color"
            }`}
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" /> Prev
          </button>

          {/* Page Numbers */}
          <div className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm ${
                  currentPage === i + 1
                    ? "primary-bg text-black font-bold"
                    : "bg-[#1c2b45] text-white hover:primary-color"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm w-full sm:w-auto justify-center ${
              currentPage === totalPages
                ? "bg-[#1c2b45] text-gray-500 cursor-not-allowed"
                : "bg-[#0a1625] text-white hover:primary-color"
            }`}
          >
            Next <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
      {/* Guidelines */}
      <div className="guidelines-card bg-[#0d0f13] p-2 sm:p-4 rounded-md border border-gray-800 w-full overflow-hidden">
        {/* Title */}
        <h3 className="guidelines-title text-sm sm:text-lg font-semibold text-teal-400 mb-4 break-words">
          Regulatory Configuration Guidelines
        </h3>

        {/* First row */}
        <div className="guidelines-grid grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] sm:text-sm text-gray-300">
          <p className="text-xs sm:text-sm break-words">
            ⚖️{" "}
            <span className="font-medium text-gray-200">
              Compliance Mapping:
            </span>{" "}
            Assign applicable regulatory frameworks (e.g., GDPR, AML, KYC)
          </p>
          <p className="text-xs sm:text-sm break-words">
            📜 <span className="font-medium text-gray-200">Policy Upload:</span>{" "}
            Ensure regulatory policies and certifications are uploaded
          </p>
        </div>

        {/* Second row */}
        <div className="guidelines-grid grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-[10px] sm:text-sm text-gray-300">
          <p className="text-xs sm:text-sm break-words">
            🔒{" "}
            <span className="font-medium text-gray-200">Access Control:</span>{" "}
            Define permissions in line with regulatory requirements
          </p>
          <p className="text-xs sm:text-sm break-words">
            📊 <span className="font-medium text-gray-200">Audit Trail:</span>{" "}
            Enable logging to track changes and regulatory approvals
          </p>
        </div>
      </div>
    </div>
  );
}
