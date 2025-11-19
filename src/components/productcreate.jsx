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
import { useEffect, useState } from "react";
import usePublicIp from "../hooks/usePublicIp";
import "../styles/styles.css";
import { channels, inputStyle, options, transErr } from "../constants";
import { v4 as uuidv4 } from "uuid";
import GuidelinesCard from "./reusable/guidelinesCard";
import { productGuidelines } from "../constants/guidelines";
import customConfirm from "./reusable/CustomConfirm";
import {
  createProduct,
  getProductData,
  getRbiConfig,
  updateProduct,
} from "../services/service";
import ErrorText from "./reusable/errorText";

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

    // ✅ REQUIRED BY API (missing earlier)
    createdBy: form.createdBy || "ajith",
    modifiedBy: form.modifiedBy || "ajith",

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
  const [error, setError] = useState({});

  const [formOpen, setformOpen] = useState(false);
  const [empId, setEmpId] = useState("");
  const [rbiConfig, setRbiConfig] = useState([]);
  const [programTypes, setProgramTypes] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [rbiLimits, setRbiLimits] = useState({
    cashLoadingLimit: 0,
    dailySpendLimit: 0,
    monthlySpendLimit: 0,
    minBalance: 0,
    maxBalance: 0,
    maxLoadAmount: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  useEffect(() => {
    // Whenever search term changes, go back to first page
    setCurrentPage(1);
  }, [searchTerm]);
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
      setRbiLimits({
        cashLoadingLimit: matchedRbiConfig?.cashLoadingLimit,
        dailySpendLimit: matchedRbiConfig?.dailySpendLimit,
        monthlySpendLimit: matchedRbiConfig?.monthlySpendLimit,
        maxBalance: matchedRbiConfig?.maxBalance,
        maxLoadAmount: matchedRbiConfig?.maxLoadAmount,
      });

      // console.log(matchedRbiConfig);

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
      // console.log(formData);

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
  const filteredConfigurations = configurations?.filter((cfg) =>
    Object.values(cfg).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // 2. Pagination
  const paginatedConfigurations = filteredConfigurations?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 3. Total pages
  const totalPages = Math.ceil(filteredConfigurations?.length / itemsPerPage);

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
    const res = await getProductData();
    setConfigurations(res?.data);
  };

  const fetchRBIConfigurations = async () => {
    const res = await getRbiConfig();
    setRbiConfig(res?.data);
    const types = Array.from(
      new Set(res?.data.map((item) => item.programType))
    );
    setProgramTypes(types);
  };

  const handleProgramTypeChange = (type) => {
    setForm((prev) => ({
      ...prev,
      programType: type,
      subCategory: "",
      programDescription: "",
    }));
    const filtered = rbiConfig?.filter((item) => item.programType === type);
    setFilteredSubCategories(filtered);
  };
  const handleSubCategoryChange = (subCategory) => {
    const matched = filteredSubCategories.find(
      (item) => item.subCategory === subCategory
    );
    // console.log(matched);
    setRbiLimits({
      cashLoadingLimit: matched?.cashLoadingLimit,
      dailySpendLimit: matched?.dailySpendLimit,
      monthlySpendLimit: matched?.monthlySpendLimit,
      maxBalance: matched?.maxBalance,
      maxLoadAmount: matched?.maxLoadAmount,
    });

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
  // console.log(rbiLimits);
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

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   setForm((prev) => ({
  //     ...prev,
  //     [name]: type === "checkbox" ? checked : value,
  //   }));
  // };

  const handleBooleanSelect = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value === "yes" }));
  };
  const hasValidationErrors = () => {
    return Object.values(error).some((msg) => msg && msg.length > 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hasValidationErrors()) {
      alert("Please fix all validation errors before submitting.");
      focusFirstError(); // 👈 Automatically jump to the first wrong field
      return;
    }
    const confirmAction = await customConfirm(
      "Are you sure you want to continue?"
    );
    if (!confirmAction) return;
    try {
      // Map frontend form → backend schema
      const payload = mapFormToApiSchema(form, username, ip, isEditing);

      // console.log("Submitting mapped payload:", JSON.stringify(payload, null, 2));

      // isEditing ? await createProduct(payload) : await updateProduct(payload);
      // FIXED: correct API call
      if (isEditing) {
        await updateProduct(payload);
      } else {
        await createProduct(payload);
      }

      alert(
        `Product configuration ${
          isEditing ? "updated" : "created"
        } successfully!`
      );
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

    const {
      cashLoadingLimit,
      dailySpendLimit,
      monthlySpendLimit,
      minBalance,
      maxBalance,
      maxLoadAmount,
    } = form;

    // 🔹 Rule 1: Cash Loading Limit must be highest
    if (
      dailySpendLimit > cashLoadingLimit ||
      monthlySpendLimit > cashLoadingLimit ||
      minBalance >= cashLoadingLimit ||
      maxBalance > cashLoadingLimit ||
      maxLoadAmount > cashLoadingLimit
    ) {
      newErrors.cashLoadingLimit =
        "Cash Loading Limit must be higher than all other limits";
    }

    // 🔹 Rule 2: Daily Spend Limit <= Monthly Spend Limit
    if (dailySpendLimit > monthlySpendLimit) {
      newErrors.dailySpendLimit =
        "Daily Spend Limit cannot exceed Monthly Spend Limit";
    }

    // 🔹 Rule 3: Monthly Spend Limit <= Cash Loading Limit
    if (monthlySpendLimit > cashLoadingLimit) {
      newErrors.monthlySpendLimit =
        "Monthly Spend Limit cannot exceed Cash Loading Limit";
    }

    // 🔹 Rule 4: Min Balance must be lowest
    if (
      minBalance >= cashLoadingLimit ||
      minBalance >= dailySpendLimit ||
      minBalance >= monthlySpendLimit ||
      minBalance >= maxBalance ||
      minBalance >= maxLoadAmount
    ) {
      newErrors.minBalance = "Min Balance must be lower than all other limits";
    }

    // 🔹 Rule 5: Max Balance <= Cash Loading Limit
    if (maxBalance > cashLoadingLimit) {
      newErrors.maxBalance = "Max Balance cannot exceed Cash Loading Limit";
    }

    // 🔹 Rule 6: Max Load Amount <= Cash Loading Limit
    if (maxLoadAmount > cashLoadingLimit) {
      newErrors.maxLoadAmount =
        "Max Load Amount cannot exceed Cash Loading Limit";
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
  const focusFirstError = () => {
    const fields = [
      "cashLoadingLimit",
      "dailySpendLimit",
      "monthlySpendLimit",
      "minBalance",
      "maxBalance",
      "maxLoadAmount",
    ];

    for (let field of fields) {
      if (error[field]) {
        document.querySelector(`input[name="${field}"]`)?.focus();
        break;
      }
    }
  };
  const isFieldEditable = (fieldName) => {
    if (!editingId) return true; // CREATE MODE → everything editable

    const editableFields = [
      "productName",
      "productDescription",
      "cashLoadingLimit",
      "dailySpendLimit",
      "monthlySpendLimit",
      "minBalance",
      "maxBalance",
      "maxLoadAmount",
      "allowedMccCodes",
    ];

    return editableFields.includes(fieldName);
  };
  const isUpdate = !!editingId;

  useEffect(() => {
    if (!isEditing) {
      setForm(getDefaultForm(ip, username));
    }
  }, [isEditing]);

  return (
    <>
      <div className="card-header flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
        {/* Left Section */}
        <div className="card-header-left flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-2">
          <div className="flex items-center gap-2">
            <div className="header-icon-box">
              <PackagePlus className="primary-color w-4 h-4" />
            </div>
          </div>
          <div>
            <h1 className="user-title">Product Configuration Management</h1>
            <p className="user-subtitle">
              Create and manage financial products and services
            </p>
          </div>
        </div>
        <div className="card-header-right flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <button
            className="btn-outline  flex items-center gap-1 w-full sm:w-auto justify-center"
            onClick={() => {
              setformOpen((prev) => !prev), setForm("");
            }}
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
          <div className="portal-info text-center sm:text-left">
            <p className="portal-label text-sm">Content Creation</p>
            <p className="portal-link text-sm font-medium text-center sm:text-right">
              Maker Portal
            </p>
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
          <div className="form-section  p-4 bg-white rounded-lg shadow-sm">
            <h3 className="section-title  text-sm sm:text-lg font-semibold mb-4">
              Basic Program Details
            </h3>
            <div className="form-row flex flex-col sm:flex-row gap-4">
              <div className="form-group flex-1 flex flex-col">
                <label className="mb-1 text-xs sm:text-sm font-medium mandatory">
                  Program Type
                </label>
                <select
                  name="programType"
                  value={form.programType}
                  required
                  onChange={(e) => handleProgramTypeChange(e.target.value)}
                  className="form-input p-2 border border-gray-300 rounded text-xs sm:text-sm"
                  disabled={isUpdate}
                >
                  <option value="" disabled hidden>
                    Select
                  </option>
                  {programTypes.map((pt) => (
                    <option key={pt} value={pt}>
                      {pt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group flex-1 flex flex-col">
                <label className="mb-1 text-xs sm:text-sm font-medium mandatory">
                  Sub Category
                </label>
                <select
                  name="subCategory"
                  value={form.subCategory}
                  required
                  // disabled={!form.programType}
                  disabled={isUpdate}
                  onChange={(e) => handleSubCategoryChange(e.target.value)}
                  className={`form-input p-2 border border-gray-300 rounded text-xs sm:text-sm ${
                    !form.programType && "cursor-not-allowed"
                  }`}
                >
                  <option value="" disabled hidden>
                    Select
                  </option>
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
                <label className="mb-1 text-xs sm:text-sm font-medium">
                  Program Description
                </label>
                <textarea
                  name="programDescription"
                  value={form.programDescription || ""}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Program description p-2 border border-gray-300 rounded text-xs sm:text-sm w-full table-scrollbar"
                  readOnly={!!form.subCategory} // Make it read-only when a subcategory is selected
                />
              </div>
            </div>

            {form.subCategory && (
              <>
                <div className="form-row mt-4 flex flex-col sm:flex-row gap-4">
                  <div className="form-group flex-1 flex flex-col">
                    <label className="mb-1 text-xs sm:text-sm font-medium mandatory">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="productName"
                      value={form.productName}
                      onChange={handleChange}
                      className="form-input p-2 border border-gray-300 rounded text-xs sm:text-sm"
                      required
                      placeholder="Enter product name"
                      disabled={!isFieldEditable("productName")}
                    />
                  </div>
                </div>
                <div className="form-row mt-4">
                  <div className="form-group flex flex-col w-full">
                    <label className="mb-1 text-xs sm:text-sm font-medium mandatory">
                      Description
                    </label>
                    <textarea
                      type="text"
                      name="productDescription"
                      value={form.productDescription}
                      onChange={handleChange}
                      className="form-input p-2 border border-gray-300 rounded text-xs sm:text-sm w-full table-scrollbar"
                      required
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
                    disabled
                    className="form-input bg-gray-800 text-white cursor-not-allowed"
                  />
                </div>

                <div className="form-group">
                  <label>Risk Profile</label>
                  <input
                    type="text"
                    name="riskProfile"
                    value={form.riskProfile || "-"}
                    disabled
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
            <h3 className="section-title primary-color text-sm sm:text-base mb-4">
              Transaction Limits
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Cash Loading Limit */}
              <div className="form-group flex flex-col">
                <label className="text-xs sm:text-sm text-gray-300 mb-1">
                  Cash Loading Limit
                </label>
                <input
                  type="number"
                  name="cashLoadingLimit"
                  value={form.cashLoadingLimit || ""}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val <= rbiLimits.cashLoadingLimit) {
                      handleChange(e);
                    }
                  }}
                  className={inputStyle}
                  max={rbiLimits.cashLoadingLimit}
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
                  // onChange={(e) => {
                  //   const val = Number(e.target.value);
                  //   if (val <= rbiLimits.dailySpendLimit) {
                  //     handleChange(e);
                  //   }
                  // }}
                  // max={rbiLimits.dailySpendLimit}
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
                  // onChange={(e) => {
                  //   const val = Number(e.target.value);
                  //   if (val <= rbiLimits.monthlySpendLimit) {
                  //     handleChange(e);
                  //   }
                  // }}
                  // max={rbiLimits.monthlySpendLimit}
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="Enter amount"
                  required
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
                  // onChange={(e) => {
                  //   const val = Number(e.target.value);
                  //   if (val <= rbiLimits.minBalance) {
                  //     handleChange(e);
                  //   }
                  // }}
                  // max={rbiLimits.minBalance}
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="Enter amount"
                  required
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
                  // onChange={(e) => {
                  //   const val = Number(e.target.value);
                  //   if (val <= rbiLimits.maxBalance) {
                  //     handleChange(e);
                  //   }
                  // }}
                  // max={rbiLimits.maxBalance}
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="Enter amount"
                  required
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
                  // onChange={(e) => {
                  //   const val = Number(e.target.value);
                  //   if (val <= rbiLimits.maxLoadAmount) {
                  //     handleChange(e);
                  //   }
                  // }}
                  // max={rbiLimits.maxLoadAmount}
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="Enter amount"
                  required
                />
                <ErrorText
                  errTxt={error.maxLoadAmount}
                  className="text-[9px] sm:text-xs"
                />
              </div>
            </div>
          </div>

          {/* ================= Features & Validity ================= */}
          <div className="form-section bg-[#0d0f13] p-4 rounded-md border border-gray-800">
            <h3 className="section-title primary-color text-sm sm:text-base mb-4">
              Features & Validity Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left - Validity */}
              <div>
                <h4 className="compliance-title text-[15px] mb-[5px] text-xs sm:text-sm mb-2">
                  Validity & Age Settings
                </h4>
                {/* <div className="form-group">
                                    <label>Validity Period (Months)</label>
                                    <input type="number" name="validityPeriodMonths" value={form.validityPeriodMonths || ""} onChange={handleChange} className="form-input" />
                                </div> */}
                <div className="form-group mb-4">
                  <label className="text-xs sm:text-sm text-gray-300 mb-1">
                    Grace Period (Days)
                  </label>
                  <input
                    type="number"
                    name="gracePeriodDays"
                    value={form.gracePeriodDays || 0}
                    onChange={handleChange}
                    className="form-input p-2 text-xs sm:text-sm border border-gray-700 rounded-md bg-transparent focus:outline-none focus:border-teal-400 w-full"
                    disabled={isUpdate}
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
                      className="form-input p-2 text-xs sm:text-sm border border-gray-700 rounded-md bg-transparent focus:outline-none focus:border-teal-400 w-full"
                      disabled={isUpdate}
                    />
                  </div>
                </div>
              </div>

              {/* Right - Features */}
              <div>
                <h4 className="compliance-title  text-xs sm:text-sm mb-2">
                  Key Features
                </h4>
                <div className="compliance-table flex flex-col gap-3">
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
                      className="compliance-row flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4"
                    >
                      <span className="compliance-label text-xs sm:text-sm text-gray-300">
                        {label}
                      </span>
                      <div className="radio-group flex gap-4">
                        <label className="flex items-center gap-1 text-xs sm:text-sm">
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
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ================= Payment Methods ================= */}
          <div className="form-section bg-[#0d0f13] p-4 rounded-md border border-gray-800">
            <h3 className="section-title primary-color text-sm sm:text-base mb-4">
              Payment Methods & Channels
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Loading Channels */}
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
                          onClick={() => {
                            if (editingId) return; // ⛔ DISABLE CLICK IN UPDATE
                            toggleLoading(method);
                          }}
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
                <h4 className="compliance-title text-xs sm:text-sm mb-2">
                  Unloading Channels
                </h4>
                <div className="flex flex-col gap-3">
                  {channels.map((method) => {
                    const checked = form.allowedChannels?.some(
                      (item) => item.toLowerCase() === method.toLowerCase()
                    );

                    const normalized = method.replace(/_/g, "_").toUpperCase();
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
                        className="flex items-center gap-3 cursor-pointer text-gray-300 text-xs sm:text-sm"
                      >
                        <div
                          onClick={() => {
                            if (editingId) return; // ⛔ DISABLE CLICK IN UPDATE
                            toggleUnloading(method);
                          }}
                          className={`w-3 h-3 flex items-center justify-center border rounded-sm  
                  ${checked ? "check-box-clr-after" : "check-box-clr-before"}
                  transition-colors duration-200
                `}
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
            <div className="form-group mt-4 flex flex-col">
              <label className="text-xs sm:text-sm text-gray-300 mb-1 mandatory">
                MCC Code
              </label>
              <input
                type="text"
                name="allowedMccCodes"
                disabled={false} // ✔ MCC Code is editable
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
                required
                placeholder="Enter MCC codes separated by commas"
              />
            </div>
          </div>

          {/* ================= Footer ================= */}
          <div className="form-footer flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mt-4 px-2 sm:px-0">
            <button
              type="button"
              className="btn-outline-back flex items-center justify-center w-full sm:w-auto px-3 py-2 text-sm sm:text-base gap-2"
              onClick={() => setformOpen(false)}
            >
              <ArrowLeft className="icon" /> Back
            </button>
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
                <RotateCcw className="icon" /> Reset
              </button>
              <button
                type="submit"
                className="btn-outline-reset flex items-center justify-center w-full sm:w-auto px-3 py-2 text-sm sm:text-base gap-2"
              >
                <Save className="icon" />
                {editingId ? "Update Configuration" : "Create Configuration"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Existing Configurations */}
      <div className="table-card mt-[18px]">
        <div className="table-header flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 px-2 sm:px-0">
          <div className="flex items-center gap-2 primary-color">
            <PackagePlus className="w-4 h-4" />
            <p className="user-table-header">Existing product Configurations</p>
          </div>
          {/* Search bar */}
          <div className="search-box relative w-full sm:w-64">
            <Search size="14" className="absolute left-3 top-2 text-gray-400" />
            <input
              type="text"
              className="search-input !w-full pl-8 pr-2 py-1 sm:py-2 text-xs sm:text-sm rounded border"
              placeholder="Search configurations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          {/* Table */}
          <table>
            <thead>
              <tr>
                {/* <th className="table-cell">#</th> */}
                <th>Configuration Name</th>
                <th>Program Type</th>
                <th>KYC Level</th>
                <th>Status</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedConfigurations &&
                paginatedConfigurations.map((cfg, idx) => {
                  const formattedKYCLevel =
                    cfg.kycLevelRequired.charAt(0).toUpperCase() +
                    cfg.kycLevelRequired.slice(1).toLowerCase();
                  return (
                    <tr key={cfg.productId || idx}>
                      <td className="max-w-[120px]">
                        <p className="truncate" title={cfg.productName}>
                          {cfg.productName}
                        </p>
                      </td>
                      <td>{cfg.programType}</td>
                      <td>{formattedKYCLevel || "-"}</td>
                      <td>
                        <span
                          className={` px-2 py-1 rounded text-[10px] ${
                            cfg.isActive ? "checker" : "superuser"
                          }`}
                        >
                          {cfg.isActive ? "active" : "Inactive"}
                        </span>
                      </td>
                      <td>{cfg.remarks || "-"}</td>
                      <td>
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
              {paginatedConfigurations?.length === 0 && (
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
        <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-between items-center mt-4 px-4 gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm w-full sm:w-auto justify-center  ${
              currentPage === 1
                ? "prev-next-disabled-btn"
                : "prev-next-active-btn"
            }`}
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" /> Prev
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm ${
                  currentPage === i + 1
                    ? "active-pagination-btn"
                    : "inactive-pagination-btn"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm w-full sm:w-auto justify-center ${
              currentPage === totalPages
                ? "prev-next-disabled-btn"
                : "prev-next-active-btn"
            }`}
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* Guidelines */}
      <GuidelinesCard
        title="Product Creation Guidelines"
        guidelines={productGuidelines}
      />
    </>
  );
}
