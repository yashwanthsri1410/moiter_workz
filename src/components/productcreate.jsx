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
import { v4 as uuidv4 } from "uuid";

// 🔹 Mapper function
const mapFormToApiSchema = (form, username, ip, isEditing = false, empId) => {
  const now = new Date().toISOString();
  const safeUser = username || "system"; // fallback if null

  const basePayload = {
    productId: form.productId,
    logId: uuidv4(),
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
    topUpMethod: Array.isArray(form.topUpMethod)
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
        createdBy: form.modifiedBy || "ajith",
        createdDate: new Date().toISOString(),
        modifiedBy: form.modifiedBy || "ajith",
        modifiedDate: new Date().toISOString(),
        // ipAddress: form.metadata?.ipAddress || "14.142.185.194",
        // userAgent: navigator.userAgent,
        channel: "web",
        header: {
          additionalProp1: {
            options: {
              propertyNameCaseInsensitive: true,
            },
            parent: "string",
            root: "string",
          },
          additionalProp2: {
            options: {
              propertyNameCaseInsensitive: true,
            },
            parent: "string",
            root: "string",
          },
          additionalProp3: {
            options: {
              propertyNameCaseInsensitive: true,
            },
            parent: "string",
            root: "string",
          },
        },
      },
    },
  };
  // console.log(basePayload);
  if (isEditing) {
    // 🔹 UPDATE → only include modifiedBy
    basePayload.modifiedBy = safeUser; // top-level
    // basePayload.metadata.auditMetadata.modifiedBy = safeUser;
    // basePayload.metadata.auditMetadata.modifiedDate = now;
  } else {
    // 🔹 CREATE → only include createdBy
    basePayload.createdBy = safeUser; // top-level
    // basePayload.metadata.auditMetadata.createdBy = safeUser;
    // basePayload.metadata.auditMetadata.createdDate = now;
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
      const rawTopup = cfg.topUpMethod || cfg.topUpMethod || "";

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

      const rawTopup = matched.topUpMethod || matched.topUpMethod || "";

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

      // console.log("Error saving product configuration:", payload);
      // console.log(JSON.stringify(payload, null, 2));
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
      <div className="card-header">
        <div className="card-header-left">
          <div className="flex items-center gap-[10px]">
            <div className="header-icon-box">
              <PackagePlus className="primary-color w-4 h-4" />
            </div>
          </div>
          <div>
            <h1 className="header-title">Product Configuration Management</h1>
            <p className="header-subtext">
              Create and manage financial products and services
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
                <span className="btn-icon">
                  <Eye className="w-4 h-4" />
                </span>
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
              <PackagePlus className="primary-color w-5 h-5 mr-[10px]" />
              {editingId
                ? "Update Product Configuration"
                : "Create Product Configuration"}
            </h2>
          </div>

          {/* ================= Basic Program Details ================= */}
          <div className="form-section">
            <h3 className="section-title">Basic Program Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Program Type</label>
                <select
                  name="programType"
                  value={form.programType}
                  onChange={(e) => handleProgramTypeChange(e.target.value)}
                  className="form-input"
                >
                  <option value="">Select</option>
                  {programTypes.map((pt) => (
                    <option key={pt} value={pt}>
                      {pt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Sub Category</label>
                <select
                  name="subCategory"
                  value={form.subCategory}
                  onChange={(e) => handleSubCategoryChange(e.target.value)}
                  className="form-input"
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

            <div className="form-row">
              <div className="form-group full-width">
                <label>Program Description</label>
                <textarea
                  name="programDescription"
                  value={form.programDescription || ""}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Program description auto-filled"
                  readOnly={!!form.subCategory} // Make it read-only when a subcategory is selected
                />
              </div>
            </div>

            {form.subCategory && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Name</label>
                    <input
                      type="text"
                      name="productName"
                      value={form.productName}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter product name"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      type="text"
                      name="productDescription"
                      value={form.productDescription}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter description"
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
            <h3 className="section-title primary-color mb-4">
              Transaction Limits
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Cash Loading Limit", field: "cashLoadingLimit" },
                { label: "Daily Spend Limit", field: "dailySpendLimit" },
                { label: "Monthly Spend Limit", field: "monthlySpendLimit" },
                { label: "Min Balance", field: "minBalance" },
                { label: "Max Balance", field: "maxBalance" },
                { label: "Max Load Amount", field: "maxLoadAmount" },
              ].map(({ label, field }) => {
                const maxValue = form[field] || ""; // fetched value

                return (
                  <div key={field} className="form-group flex flex-col">
                    <label className="text-sm text-gray-300 mb-1">
                      {label}
                    </label>
                    <input
                      type="number"
                      name={field}
                      value={form[field] || 0}
                      max={maxValue} // 🔥 restrict max
                      onChange={(e) => {
                        const newValue = Number(e.target.value);
                        if (newValue <= maxValue) {
                          handleChange(e);
                        }
                      }}
                      className="form-input bg-transparent border border-gray-700 text-gray-200 rounded-md p-2 focus:border-teal-400 focus:outline-none"
                      placeholder="Enter amount"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= Features & Validity ================= */}
          <div className="form-section bg-[#0d0f13] p-4 rounded-md border border-gray-800">
            <h3 className="section-title primary-color mb-4">
              Features & Validity Settings
            </h3>
            <div className="grid grid-cols-2 gap-8">
              {/* Left - Validity */}
              <div>
                <h4 className="compliance-title text-[15px] mb-[5px]">
                  Validity & Age Settings
                </h4>
                {/* <div className="form-group">
                                    <label>Validity Period (Months)</label>
                                    <input type="number" name="validityPeriodMonths" value={form.validityPeriodMonths || ""} onChange={handleChange} className="form-input" />
                                </div> */}
                <div className="form-group">
                  <label>Grace Period (Days)</label>
                  <input
                    type="number"
                    name="gracePeriodDays"
                    value={form.gracePeriodDays || 0}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label>Min Age</label>
                    <input
                      type="number"
                      name="customerAgeMin"
                      value={form.customerAgeMin || ""}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Right - Features */}
              <div>
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
                      <div className="radio-group">
                        <label>
                          <input
                            type="radio"
                            name={field}
                            value="yes"
                            checked={form[field] === true}
                            onChange={(e) =>
                              handleBooleanSelect(field, e.target.value)
                            }
                          />{" "}
                          Yes
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={field}
                            value="no"
                            checked={form[field] === false}
                            onChange={(e) =>
                              handleBooleanSelect(field, e.target.value)
                            }
                          />{" "}
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
            <h3 className="section-title primary-color mb-4">
              Payment Methods & Channels
            </h3>
            <div className="grid grid-cols-2 gap-8">
              {/* Topup Channels */}
              <div>
                <h4 className="compliance-title text-gray-200 mb-2">
                  Loading Channels
                </h4>
                <div className="flex flex-col gap-3">
                  {options.map((method) => {
                    const checked = Array.isArray(form.topUpMethod)
                      ? form.topUpMethod.includes(method)
                      : (form.topUpMethod || "").split(",").includes(method);

                    return (
                      <label
                        key={method}
                        className="flex items-center gap-3 cursor-pointer text-gray-300"
                      >
                        <div
                          onClick={() => toggleLoading(method)}
                          className={`w-3 h-3 flex items-center justify-center border 
          ${checked ? "check-box-clr-after" : "check-box-clr-before"}
        `}
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

              {/* Unloading Channels */}
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
            ${checked ? "check-box-clr-after" : "check-box-clr-before"}
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

            {/* MCC Code */}
            <div className="form-group mt-4">
              <label>MCC Code</label>
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
                    allowedMccCodes: e.target.value, // keep as string while typing
                  }))
                }
                className="form-input"
                placeholder="Enter MCC codes separated by commas"
              />
            </div>
          </div>

          {/* ================= Footer ================= */}
          <div className="form-footer">
            <button
              type="button"
              className="btn-outline-back"
              onClick={() => setformOpen(false)}
            >
              <ArrowLeft className="icon" /> Back
            </button>
            <div className="footer-right">
              <button
                type="button"
                className="btn-outline-reset"
                onClick={() => {
                  setEditingId(null);
                  setIsEditing(false);
                  setForm(getDefaultForm(ip, username));
                }}
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
            <PackagePlus className="w-5 h-5" />
            Existing product Configurations
          </p>
          {/* Search bar */}
          <div className="search-box">
            <Search className="absolute left-3 top-2 text-gray-400 w-3 h-3" />
            <input
              type="text"
              className="search-input"
              placeholder="Search configurations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrapper">
          {/* Table */}
          <table className="w-full text-left">
            <thead className="table-head">
              <tr>
                {/* <th className="table-cell">#</th> */}
                <th className="table-cell">Configuration NAME</th>
                <th className="table-cell">Program Type</th>
                <th className="table-cell">KYC Level</th>
                <th className="table-cell">Status</th>
                <th className="table-cell">Remarks</th>
                <th className="table-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedConfigurations &&
                paginatedConfigurations.map((cfg, idx) => {
                  const formattedKYCLevel =
                    cfg.kycLevelRequired.charAt(0).toUpperCase() +
                    cfg.kycLevelRequired.slice(1).toLowerCase();
                  return (
                    <tr key={cfg.productId || idx} className="table-row">
                      <td className="table-content">{cfg.productName}</td>
                      <td className="table-content">{cfg.programType}</td>
                      <td className="table-content">
                        {formattedKYCLevel || "-"}
                      </td>
                      <td className="table-content">
                        <span
                          className={` px-2 py-1 rounded text-[10px] ${
                            cfg.isActive ? "checker" : "superuser"
                          }`}
                        >
                          {cfg.isActive ? "active" : "Inactive"}
                        </span>
                      </td>
                      <td className="table-content">{cfg.remarks || "-"}</td>
                      <td className="table-content">
                        <button
                          className="header-icon-box"
                          onClick={() => handleEdit(cfg)}
                        >
                          <SquarePen className="primary-color w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              {paginatedConfigurations.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-500">
                    No products found.
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
                : "bg-[#0a1625] text-white hover:primary-color"
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
                    ? "primary-bg text-black font-bold"
                    : "bg-[#1c2b45] text-white hover:primary-color"
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
                : "bg-[#0a1625] text-white hover:primary-color"
            }`}
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* Guidelines */}
      <div className="guidelines-card">
        <h3 className="guidelines-title">Product Creation Guidelines</h3>
        <div className="guidelines-grid">
          <p>
            📦 <span>Basic Details:</span> Provide product name, description,
            and category
          </p>
          <p>
            💲 <span> Pricing Setup:</span> Define price, currency, and
            applicable taxes
          </p>
        </div>

        <div className="guidelines-grid">
          <p>
            ⚙️ <span> Configuration:</span> Set product attributes, features,
            and usage limits
          </p>
          <p>
            📜 <span> Compliance:</span> Ensure product meets regulatory and
            policy requirements
          </p>
        </div>
      </div>
    </div>
  );
}
