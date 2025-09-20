import {
  Eye,
  PackagePlus,
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
import React, { useEffect, useState } from "react";
import axios from "axios";
import usePublicIp from "../hooks/usePublicIp";
import "../styles/styles.css";
import { channels, options } from "../constants";

// 🔹 Mapper function
const mapFormToApiSchema = (form, username, ip, isEditing = false, empId) => {
  const now = new Date().toISOString();
  const safeUser = username || "system"; // fallback if null

  const basePayload = {
    productId: form.productId,
    productName: form.productName || "",
    programDescription: form.programDescription || "",
    isActive: form.isActive ?? true,
    programType: form.programType || "",
    subCategory: form.subCategory || "",
    issuerType: form.issuerType || "Bank",
    authorizationRequired: form.authorizationRequired ?? false,
    validityMinDays: form.minimumValidityDays ?? 0,
    validityMaxDays: form.maximumValidityDays ?? 0,
    reloadable: form.reloadable ?? false,
    transferable: form.transferable ?? false,
    autoBlockOnExpiry: form.autoBlockOnExpiry ?? false,
    allowPartialKycActivation: form.allowPartialKycActivation ?? false,
    currency: form.currency || "INR",
    multiUseAllowed: form.multiUseAllowed ?? false,
    minBalance: form.minBalance ?? 0,
    maxBalance: form.maxBalance ?? 0,
    maxLoadAmount: form.maxLoadAmount ?? 0,
    dailySpendLimit: form.dailySpendLimit ?? 0,
    monthlySpendLimit: form.monthlySpendLimit ?? 0,
    yearlySpendLimit: form.yearlySpendLimit ?? 0,
    txnCountLimitPerDay: form.txnCountLimitPerDay ?? 0,
    refundLimit: form.refundLimit ?? 0,
    atmWithdrawalEnabled: form.atmWithdrawalEnabled ?? false,
    maxCashWithdrawalAmount: form.maxCashWithdrawalAmount ?? 0,
    coBrandingAllowed: form.coBrandingAllowed ?? false,
    validityPeriodMonths: form.validityPeriodMonths ?? 0,
    gracePeriodDays: form.gracePeriodDays ?? 0,
    autoRenewal: form.autoRenewal ?? false,
    closureAllowedPostExpiry: form.closureAllowedPostExpiry ?? false,
    kycRequired: form.kycRequired ?? false,
    kycLevelRequired: form.kycLevelRequired || "",
    aadhaarRequired: form.aadhaarRequired ?? false,
    panRequired: form.panRequired ?? false,
    additionalKycDocsNeeded: form.additionalKycDocsNeeded ?? false,
    amlCftApplicable: form.amlCftApplicable ?? false,
    riskProfile: form.riskProfile || "",
    pepCheckRequired: form.pepCheckRequired ?? false,
    blacklistCheckRequired: form.blacklistCheckRequired ?? false,
    ckycUploadRequired: form.ckycUploadRequired ?? false,
    domesticTransferAllowed: form.domesticTransferAllowed ?? false,
    crossBorderAllowed: form.crossBorderAllowed ?? false,
    allowedChannels: form.allowedChannels || [],
    allowedMccCodes: form.allowedMccCodes
      ? String(form.allowedMccCodes)
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : [],
    geoRestrictions: form.geoRestrictions || [],
    merchantWhitelistOnly: form.merchantWhitelistOnly ?? false,
    blockOnFailedKycAttempts: form.blockOnFailedKycAttempts ?? false,
    regulatoryReportingRequired: form.regulatoryReportingRequired ?? false,
    monthlyBalanceReportRequired: form.monthlyBalanceReportRequired ?? false,
    auditTrailEnabled: form.auditTrailEnabled ?? false,
    transactionReportableFlags:
      typeof form.transactionReportableFlags === "string"
        ? form.transactionReportableFlags
        : JSON.stringify(form.transactionReportableFlags || "{}"),
    customerAgeMin: form.customerAgeMin ?? 0,
    customerAgeMax: form.customerAgeMax ?? 0,
    eligibleCustomerTypes: form.eligibleCustomerTypes || [],
    employmentTypesAllowed: form.employmentTypesAllowed || [],
    externalPartnerId:
      form.externalPartnerId || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    partnerApiEnabled: form.partnerApiEnabled ?? false,
    issuerBankId: form.issuerBankId || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    cashLoadingLimit: form.cashLoadingLimit ?? 0,
    cardType: form.cardType || "Both",
    expiryWarningDays: form.expiryWarningDays ?? 0,
    dormantPeriodDays: form.dormantPeriodDays ?? 0,
    topupMethod: Array.isArray(form.topUpMethod)
      ? form.topUpMethod.join(",")
      : form.topUpMethod || "",
    expiryPeriod: form.expiryPeriod ?? 0,
    productDescription: form.productDescription || "",
    metadata: {
      ipAddress: ip,
      userAgent: navigator.userAgent,
      headers: "",
      channel: "web",
      auditMetadata: {
        header: {},
      },
    },
  };
  // console.log(basePayload);
  if (isEditing) {
    // 🔹 UPDATE → only include modifiedBy
    basePayload.modifiedBy = safeUser; // top-level
    basePayload.metadata.auditMetadata.modifiedBy = safeUser;
    basePayload.metadata.auditMetadata.modifiedDate = now;
  } else {
    // 🔹 CREATE → only include createdBy
    basePayload.createdBy = safeUser; // top-level
    basePayload.metadata.auditMetadata.createdBy = safeUser;
    basePayload.metadata.auditMetadata.createdDate = now;
  }

  return basePayload;
};

export default function Productcreate() {
  const [configurations, setConfigurations] = useState([]);
  const [formOpen, setformOpen] = useState(false);
  const [empId, setEmpId] = useState("");
  const [rbiConfig, setRbiConfig] = useState([]);
  const [programTypes, setProgramTypes] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const handleEdit = async (cfg) => {
    try {
      // First, ensure we have the latest RBI config
      if (rbiConfig.length === 0) {
        await fetchRBIConfigurations();
      }

      // Set program type first to trigger filtering
      setForm((prev) => ({
        ...prev,
        programType: cfg.programType || "",
      }));

      // Filter subcategories based on the program type
      const filtered = rbiConfig.filter(
        (item) => item.programType === cfg.programType
      );
      setFilteredSubCategories(filtered);

      // Find the matching RBI configuration
      const matchedRbiConfig = rbiConfig.find(
        (item) =>
          item.programType === cfg.programType &&
          item.subCategory === cfg.subCategory
      );

      // Prepare the form data
      const rawTopup = cfg.topUpMethod || cfg.topupMethod || "";

      const formData = {
        ...getDefaultForm(ip, username),
        ...cfg,
        programType: cfg.programType || "",
        subCategory: cfg.subCategory || "",
        programDescription: matchedRbiConfig
          ? matchedRbiConfig.programDescription
          : cfg.programDescription || "",
        topUpMethod: rawTopup ? rawTopup.split(",").map((m) => m.trim()) : [],
      };

      // If we found a matching RBI config, apply its values
      if (matchedRbiConfig) {
        const channels = Array.isArray(matchedRbiConfig.allowedChannels)
          ? matchedRbiConfig.allowedChannels
          : typeof matchedRbiConfig.allowedChannels === "string"
          ? matchedRbiConfig.allowedChannels.split(",").map((c) => c.trim())
          : [];

        formData.allowedChannels = channels;
        formData.kycLevelRequired =
          matchedRbiConfig.kycLevelRequired || cfg.kycLevelRequired || "";
        formData.riskProfile =
          matchedRbiConfig.riskProfile || cfg.riskProfile || "";
        // Add other fields from RBI config as needed
      }

      setForm(formData);
      setIsEditing(true);
      setEditingId(cfg.productId);
      setformOpen(true);
    } catch (error) {
      console.error("Error in handleEdit:", error);
    }
  };
  const [form, setForm] = useState({
    productName: "",
    programType: "",
    kycLevelRequired: "",
    isActive: false,
    createdAt: "",
  });

  const getDefaultForm = (ip, username) => ({
    productName: "",
    programDescription: "",
    isActive: true,
    productId: 0,
    programType: "",
    subCategory: "",
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
    allowedMccCodes: [],
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
    externalPartnerId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    partnerApiEnabled: false,
    issuerBankId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    cashLoadingLimit: 0,
    cardType: "",
    expiryWarningDays: 0,
    expiryPeriod: 0,
    dormantPeriodDays: 0,
    topUpMethod: "",
    productDescription: "",
    metadata: {
      ipAddress: ip,
      userAgent: navigator.userAgent,
      headers: "frontend",
      channel: "web",
      auditMetadata: {
        createdBy: username,
        createdDate: new Date().toISOString(),
        modifiedBy: username,
        modifiedDate: new Date().toISOString(),
        header: {
          additionalProp1: {
            options: { propertyNameCaseInsensitive: true },
            parent: "frontend",
            root: "product",
          },
          additionalProp2: {
            options: { propertyNameCaseInsensitive: true },
            parent: "frontend",
            root: "product",
          },
          additionalProp3: {
            options: { propertyNameCaseInsensitive: true },
            parent: "frontend",
            root: "product",
          },
        },
      },
    },
  });
  // compute total pages
  const filteredConfigurations = configurations.filter((cfg) =>
    Object.values(cfg).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // 2. Pagination
  const paginatedConfigurations = filteredConfigurations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 3. Total pages
  const totalPages = Math.ceil(filteredConfigurations.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const ip = usePublicIp();
  const username = localStorage.getItem("username") || "system";

  // ✅ Add inside Productcreate component
  const toggleLoading = (method) => {
    setForm((prev) => {
      const current = Array.isArray(prev.topUpMethod)
        ? prev.topUpMethod
        : (prev.topUpMethod || "").split(",").filter(Boolean);
      const updated = current.includes(method)
        ? current.filter((m) => m !== method)
        : [...current, method];
      return { ...prev, topUpMethod: updated };
    });
  };

  const toggleUnloading = (method) => {
    setForm((prev) => {
      const current = prev.allowedChannels || [];
      const updated = current.includes(method)
        ? current.filter((m) => m !== method)
        : [...current, method];
      return { ...prev, allowedChannels: updated };
    });
  };

  useEffect(() => {
    setForm(getDefaultForm(ip, username));
    fetchConfigurations();
    fetchRBIConfigurations();
    const generatedId = Date.now().toString().slice(-6); // last 6 digits of timestamp
    setEmpId(generatedId);
  }, [ip]);

  const fetchConfigurations = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/fes/api/Export/product_Config_export`
      );
      setConfigurations(res.data);
    } catch (err) {
      console.error("Error fetching configurations:", err);
    }
  };

  const fetchRBIConfigurations = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/fes/api/Export/export_rbi_configuration`
      );
      setRbiConfig(res.data);
      const types = Array.from(
        new Set(res.data.map((item) => item.programType))
      );
      setProgramTypes(types);
    } catch (err) {
      console.error("Error fetching RBI configurations:", err);
    }
  };

  const handleProgramTypeChange = (type) => {
    setForm((prev) => ({
      ...prev,
      programType: type,
      subCategory: "",
      programDescription: "",
    }));
    const filtered = rbiConfig.filter((item) => item.programType === type);
    setFilteredSubCategories(filtered);
  };
  const handleSubCategoryChange = (subCategory) => {
    const matched = filteredSubCategories.find(
      (item) => item.subCategory === subCategory
    );

    if (matched) {
      const channels = Array.isArray(matched.allowedChannels)
        ? matched.allowedChannels
        : typeof matched.allowedChannels === "string"
        ? matched.allowedChannels.split(",").map((c) => c.trim())
        : [];

      const rawTopup = matched.topUpMethod || matched.topupMethod || "";

      setForm((prev) => ({
        ...prev,
        ...matched,
        subCategory,
        allowedChannels: channels,
        topUpMethod: rawTopup ? rawTopup.split(",").map((m) => m.trim()) : [],
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        subCategory,
        programDescription: isEditing ? prev.programDescription : "",
      }));
    }
  };

  useEffect(() => {
    if (isEditing && form.programType && form.subCategory) {
      const matched = rbiConfig.find(
        (item) =>
          item.programType === form.programType &&
          item.subCategory === form.subCategory
      );

      if (matched) {
        setForm((prev) => ({
          ...prev,
          programDescription:
            matched.programDescription || prev.programDescription,
          kycLevelRequired: matched.kycLevelRequired || prev.kycLevelRequired,
          riskProfile: matched.riskProfile || prev.riskProfile,
        }));
      }
    }
  }, [rbiConfig, isEditing, form.programType, form.subCategory]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBooleanSelect = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value === "yes" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Map frontend form → backend schema
      const payload = mapFormToApiSchema(form, username, ip, isEditing);

      // console.log("Submitting mapped payload:", JSON.stringify(payload, null, 2));

      if (isEditing) {
        // Update existing config
        await axios.put(
          `${API_BASE_URL}/ps/productConfigurationUpdate`,
          payload
        );
        alert("Product configuration updated successfully!");
      } else {
        // Create new config
        await axios.post(
          `${API_BASE_URL}/ps/productConfigurationCreate`,
          payload
        );
        alert("Product configuration created successfully!");
      }

      await fetchConfigurations(); // refresh table after save

      // Reset form and editing state
      setForm(getDefaultForm(ip, username));
      setIsEditing(false);
      setEditingId(null);
      setformOpen(false);
    } catch (err) {
      console.error(
        "Error saving product configuration:",
        err.response?.data || err.message
      );
      alert("Failed to save product configuration");
    }
  };

  return (
    <div className="config-forms">
    <div className="card-header flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
  {/* Left Section */}
  <div className="card-header-left flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-2">
    <div className="flex items-center gap-2">
      <div className="header-icon-box">
        <PackagePlus className="text-[#00d4aa] w-4 h-4" />
      </div>
    </div>
    <div>
      <h1 className="header-title text-base sm:text-lg font-semibold text-center sm:text-left">
        Product Configuration Management
      </h1>
      <p className="header-subtext text-sm sm:text-base text-gray-400 text-center sm:text-left">
        Create and manage financial products and services
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
      <p className="portal-label text-gray-400 text-sm">Content Creation</p>
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
              <PackagePlus className="text-[#00d4aa] w-5 h-5 mr-[10px]" />
              {editingId
                ? "Update Product Configuration"
                : "Create Product Configuration"}
            </h2>
          </div>

          {/* ================= Basic Program Details ================= */}
          <div className="form-section p-4 bg-white rounded-lg shadow-sm">
  <h3 className="section-title text-sm sm:text-lg font-semibold mb-4">
    Basic Program Details
  </h3>

  {/* First Row */}
  <div className="form-row flex flex-col sm:flex-row gap-4">
    <div className="form-group flex-1 flex flex-col">
      <label className="mb-1 text-xs sm:text-sm font-medium">Program Type</label>
      <select
        name="programType"
        value={form.programType}
        onChange={(e) => handleProgramTypeChange(e.target.value)}
        className="form-input p-2 border border-gray-300 rounded text-xs sm:text-sm"
      >
        <option value="">Select</option>
        {programTypes.map((pt) => (
          <option key={pt} value={pt}>
            {pt}
          </option>
        ))}
      </select>
    </div>

    <div className="form-group flex-1 flex flex-col">
      <label className="mb-1 text-xs sm:text-sm font-medium">Sub Category</label>
      <select
        name="subCategory"
        value={form.subCategory}
        onChange={(e) => handleSubCategoryChange(e.target.value)}
        className="form-input p-2 border border-gray-300 rounded text-xs sm:text-sm"
      >
        <option value="">Select</option>
        {filteredSubCategories.map((sc) => (
          <option key={sc.subCategory} value={sc.subCategory}>
            {sc.subCategory}
          </option>
        ))}
      </select>
    </div>
  </div>

  {/* Second Row */}
  <div className="form-row mt-4">
    <div className="form-group flex flex-col w-full">
      <label className="mb-1 text-xs sm:text-sm font-medium">Program Description</label>
      <textarea
        name="programDescription"
        value={form.programDescription || ""}
        onChange={handleChange}
        placeholder="Program description auto-filled"
        readOnly={!!form.subCategory}
        className="form-input p-2 border border-gray-300 rounded text-xs sm:text-sm w-full table-scrollbar"
      />
    </div>
  </div>

  {/* Conditional Product Details */}
  {form.subCategory && (
    <>
      <div className="form-row mt-4 flex flex-col sm:flex-row gap-4">
        <div className="form-group flex-1 flex flex-col">
          <label className="mb-1 text-xs sm:text-sm font-medium">Product Name</label>
          <input
            type="text"
            name="productName"
            value={form.productName}
            onChange={handleChange}
            placeholder="Enter product name"
            className="form-input p-2 border border-gray-300 rounded text-xs sm:text-sm"
          />
        </div>
      </div>

      <div className="form-row mt-4">
        <div className="form-group flex flex-col w-full">
          <label className="mb-1 text-xs sm:text-sm font-medium">Description</label>
          <textarea
            type="text"
            name="productDescription"
            value={form.productDescription}
            onChange={handleChange}
            placeholder="Enter description"
            className="form-input p-2 border border-gray-300 rounded text-xs sm:text-sm w-full table-scrollbar"
          />
        </div>
      </div>
    </>
  )}
</div>


          {/* ================= KYC & Compliance ================= */}
          <div className="form-section">
            <h3 className="section-title">KYC & Compliance</h3>
            <div className="kyc-compliance-grid">
              {/* Left - Dropdowns */}
              <div className="kyc-left">
                <div className="form-group">
                  <label>KYC Level Required</label>
                  <input
                    type="text"
                    name="kycLevelRequired"
                    value={form.kycLevelRequired || "-"}
                    readOnly
                    className="form-input bg-gray-800 text-white cursor-not-allowed"
                  />
                </div>

                <div className="form-group">
                  <label>Risk Profile</label>
                  <input
                    type="text"
                    name="riskProfile"
                    value={form.riskProfile || "-"}
                    readOnly
                    className="form-input bg-gray-800 text-white cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Right - Boolean Compliance */}
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

          {/* ================= Transaction Limits ================= */}
         <div className="form-section bg-[#0d0f13] p-4 rounded-md border border-gray-800">
  <h3 className="section-title text-teal-400 text-sm sm:text-base mb-4">
    Transaction Limits
  </h3>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {[
      { label: "Cash Loading Limit", field: "cashLoadingLimit" },
      { label: "Daily Spend Limit", field: "dailySpendLimit" },
      { label: "Monthly Spend Limit", field: "monthlySpendLimit" },
      { label: "Min Balance", field: "minBalance" },
      { label: "Max Balance", field: "maxBalance" },
      { label: "Max Load Amount", field: "maxLoadAmount" },
    ].map(({ label, field }) => (
      <div key={field} className="form-group flex flex-col">
        <label className="text-xs sm:text-sm text-gray-300 mb-1">{label}</label>
        <input
          type="number"
          name={field}
          value={form[field] || 0}
          max={form[field] || 0}
          onChange={(e) => {
            const newValue = Number(e.target.value);
            if (newValue <= (form[field] || 0)) {
              handleChange(e);
            }
          }}
          className="form-input bg-transparent border border-gray-700 text-gray-200 rounded-md p-2 text-xs sm:text-sm focus:border-teal-400 focus:outline-none"
          placeholder="Enter amount"
        />
      </div>
    ))}
  </div>
</div>


          {/* ================= Features & Validity ================= */}
         <div className="form-section bg-[#0d0f13] p-4 rounded-md border border-gray-800">
  <h3 className="section-title text-teal-400 text-sm sm:text-base mb-4">
    Features & Validity Settings
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Left - Validity */}
    <div>
      <h4 className="text-teal-400 text-xs sm:text-sm mb-2">
        Validity & Age Settings
      </h4>

      {/* Grace Period */}
      <div className="form-group mb-4">
        <label className="text-xs sm:text-sm text-gray-300 mb-1">Grace Period (Days)</label>
        <input
          type="number"
          name="gracePeriodDays"
          value={form.gracePeriodDays || 0}
          onChange={handleChange}
          className="form-input p-2 text-xs sm:text-sm border border-gray-700 rounded-md bg-transparent focus:outline-none focus:border-teal-400 w-full"
          placeholder="Enter days"
        />
      </div>

      {/* Min Age */}
      <div className="form-group mb-4">
        <label className="text-xs sm:text-sm text-gray-300 mb-1">Min Age</label>
        <input
          type="number"
          name="customerAgeMin"
          value={form.customerAgeMin || ""}
          onChange={handleChange}
          className="form-input p-2 text-xs sm:text-sm border border-gray-700 rounded-md bg-transparent focus:outline-none focus:border-teal-400 w-full"
          placeholder="Enter min age"
        />
      </div>
    </div>

    {/* Right - Features */}
    <div>
      <h4 className="text-teal-400 text-xs sm:text-sm mb-2">Key Features</h4>
      <div className="compliance-table flex flex-col gap-3">
        {[
          { label: "Authorization Required", field: "authorizationRequired" },
          { label: "Reloadable", field: "reloadable" },
          { label: "Transferable", field: "transferable" },
          { label: "ATM Withdrawal Enabled", field: "atmWithdrawalEnabled" },
          { label: "Domestic Transfer Allowed", field: "domesticTransferAllowed" },
          { label: "Cross Border Allowed", field: "crossBorderAllowed" },
        ].map(({ label, field }) => (
          <div key={field} className="compliance-row flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <span className="compliance-label text-xs sm:text-sm text-gray-300">{label}</span>
            <div className="radio-group flex gap-4">
              <label className="flex items-center gap-1 text-xs sm:text-sm">
                <input
                  type="radio"
                  name={field}
                  value="yes"
                  checked={form[field] === true}
                  onChange={(e) => handleBooleanSelect(field, e.target.value)}
                  className="accent-teal-400"
                />
                Yes
              </label>
              <label className="flex items-center gap-1 text-xs sm:text-sm">
                <input
                  type="radio"
                  name={field}
                  value="no"
                  checked={form[field] === false}
                  onChange={(e) => handleBooleanSelect(field, e.target.value)}
                  className="accent-teal-400"
                />
                No
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>


          {/* ================= Payment Methods ================= */}
          <div className="form-section bg-[#0d0f13] p-4 rounded-md border border-gray-800">
  <h3 className="section-title text-teal-400 text-sm sm:text-base mb-4">
    Payment Methods & Channels
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Topup Channels */}
    <div>
      <h4 className="compliance-title text-gray-200 text-xs sm:text-sm mb-2">
        Loading Channels
      </h4>
      <div className="flex flex-col gap-2 sm:gap-3">
        {options.map((method) => {
          const checked = Array.isArray(form.topUpMethod)
            ? form.topUpMethod.includes(method)
            : (form.topUpMethod || "").split(",").includes(method);

          return (
            <label
              key={method}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer text-gray-300 text-xs sm:text-sm"
            >
              <div
                onClick={() => toggleLoading(method)}
                className={`w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center border rounded-sm 
                  ${checked ? "bg-teal-500 border-teal-500" : "bg-[#0d1220] border-teal-700/50"}
                `}
              >
                {checked && <Check size={14} className="text-black" />}
              </div>
              <span className="truncate">{method}</span>
            </label>
          );
        })}
      </div>
    </div>

    {/* Unloading Channels */}
    <div>
      <h4 className="compliance-title text-gray-200 text-xs sm:text-sm mb-2">
        Unloading Channels
      </h4>
      <div className="flex flex-col gap-2 sm:gap-3">
        {channels.map((method) => {
          const checked = form.allowedChannels?.includes(method);

          const normalized = method.toLowerCase();
          let formattedMethod = "";
          if (normalized === "qr_code") {
            formattedMethod = "QR Code";
          } else if (["upi", "pos", "atm", "ecom"].includes(normalized)) {
            formattedMethod = method.toUpperCase();
          } else {
            formattedMethod = method
              .replace(/_/g, " ")
              .split(" ")
              .map(
                (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join(" ");
          }

          return (
            <label
              key={method}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer text-gray-300 text-xs sm:text-sm"
            >
              <div
                onClick={() => toggleUnloading(method)}
                className={`w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center border rounded-sm 
                  ${checked ? "bg-teal-500 border-teal-500" : "bg-[#0d1220] border-teal-700/50"}
                  transition-colors duration-200
                `}
              >
                {checked && <Check size={14} className="text-black" />}
              </div>
              <span className="truncate">{formattedMethod}</span>
            </label>
          );
        })}
      </div>
    </div>
  </div>

  {/* MCC Code */}
  <div className="form-group mt-4 flex flex-col">
    <label className="text-xs sm:text-sm text-gray-300 mb-1">MCC Code</label>
    <input
      type="text"
      name="allowedMccCodes"
      value={
        Array.isArray(form.allowedMccCodes)
          ? form.allowedMccCodes.join(",")
          : form.allowedMccCodes || ""
      }
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          allowedMccCodes: e.target.value,
        }))
      }
      className="form-input p-2 text-xs sm:text-sm border border-gray-700 rounded-md bg-transparent focus:outline-none focus:border-teal-400 w-full"
      placeholder="Enter MCC codes separated by commas"
    />
  </div>
</div>


          {/* ================= Footer ================= */}
          <div className="form-footer flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mt-4 px-2 sm:px-0">
  {/* Left - Back */}
  <button
    type="button"
    className="btn-outline-back flex items-center justify-center w-full sm:w-auto px-3 py-2 text-sm sm:text-base gap-2"
    onClick={() => setformOpen(false)}
  >
    <ArrowLeft className="icon w-4 h-4" /> Back
  </button>

  {/* Right - Reset + Submit */}
  <div className="footer-right flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
    <button
      type="button"
      className="btn-outline-reset flex items-center justify-center w-full sm:w-auto px-3 py-2 text-sm sm:text-base gap-2"
      onClick={() => {
        setEditingId(null);
        setIsEditing(false);
        setForm(getDefaultForm(ip, username));
      }}
    >
      <RotateCcw className="icon w-4 h-4" /> Reset
    </button>

    <button
      type="submit"
      className="btn-outline-reset flex items-center justify-center w-full sm:w-auto px-3 py-2 text-sm sm:text-base gap-2"
    >
      <Save className="icon w-4 h-4" />
      {editingId ? "Update Configuration" : "Create Configuration"}
    </button>
  </div>
</div>

        </form>
      )}

      {/* Existing Configurations */}
      <div className="table-card mt-[18px]">
        <div className="table-header flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 px-2 sm:px-0">
  {/* Title */}
  <p className="table-title flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-200">
    <PackagePlus className="w-4 h-4 sm:w-5 sm:h-5" />
    Existing Product Configurations
  </p>

  {/* Search bar */}
  <div className="search-box relative w-full sm:w-64">
    <Search className="absolute left-3 top-2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
    <input
      type="text"
      className="search-input !w-full pl-8 pr-2 py-1 sm:py-2 text-xs sm:text-sm rounded border border-gray-700 bg-[#0d0f13] text-gray-200 focus:outline-none focus:border-teal-400"
      placeholder="Search configurations..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
</div>


       <div className="table-wrapper overflow-x-auto w-full table-scrollbar">
  <table className="min-w-full text-left border-collapse">
    <thead className="table-head bg-gray-900 text-gray-300 text-xs sm:text-sm">
      <tr>
        <th className="table-cell px-2 py-2">Configuration NAME</th>
        <th className="table-cell px-2 py-2">Program Type</th>
        <th className="table-cell px-2 py-2">KYC Level</th>
        <th className="table-cell px-2 py-2">Status</th>
        <th className="table-cell px-2 py-2">Remarks</th>
        <th className="table-cell px-2 py-2">Actions</th>
      </tr>
    </thead>
    <tbody className="text-gray-200 text-xs sm:text-sm">
      {paginatedConfigurations &&
        paginatedConfigurations.map((cfg, idx) => {
          const formattedKYCLevel =
            cfg.kycLevelRequired.charAt(0).toUpperCase() +
            cfg.kycLevelRequired.slice(1).toLowerCase();
          return (
            <tr
              key={cfg.productId || idx}
              className="table-row border-b border-gray-700"
            >
              <td className="table-content px-2 py-1">{cfg.productName}</td>
              <td className="table-content px-2 py-1">{cfg.programType}</td>
              <td className="table-content px-2 py-1">
                {formattedKYCLevel || "-"}
              </td>
              <td className="table-content px-2 py-1">
                <span
                  className={`px-2 py-1 rounded text-[10px] ${
                    cfg.isActive ? "checker" : "superuser"
                  }`}
                >
                  {cfg.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="table-content px-2 py-1">{cfg.remarks || "-"}</td>
              <td className="table-content px-2 py-1">
                <button
                  className="header-icon-box p-1 sm:p-2"
                  onClick={() => handleEdit(cfg)}
                >
                  <SquarePen className="text-[#00d4aa] w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </td>
            </tr>
          );
        })}
      {paginatedConfigurations.length === 0 && (
        <tr>
          <td colSpan="6" className="text-center py-4 text-gray-500">
            No products found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-between items-center mt-4 px-4 gap-2">
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
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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

      </div>
      {/* Guidelines */}
      <div className="guidelines-card p-2 sm:p-4 bg-[#0d0f13] rounded-md border border-gray-800 w-full overflow-hidden">
  <h3 className="guidelines-title text-teal-400 text-xs sm:text-base font-semibold mb-4">
    Product Creation Guidelines
  </h3>

  {/* First Grid */}
  <div className="guidelines-grid grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
    <p className="text-xs sm:text-sm text-gray-300 break-words">
      📦 <span className="font-medium">Basic Details:</span> Provide product name, description, and category
    </p>
    <p className="text-xs sm:text-sm text-gray-300 break-words">
      💲 <span className="font-medium">Pricing Setup:</span> Define price, currency, and applicable taxes
    </p>
  </div>

  {/* Second Grid */}
  <div className="guidelines-grid grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
    <p className="text-xs sm:text-sm text-gray-300 break-words">
      ⚙️ <span className="font-medium">Configuration:</span> Set product attributes, features, and usage limits
    </p>
    <p className="text-xs sm:text-sm text-gray-300 break-words">
      📜 <span className="font-medium">Compliance:</span> Ensure product meets regulatory and policy requirements
    </p>
  </div>
</div>


    </div>
  );
}
