import React, { useState, useEffect } from "react";
import axios from "axios";
import usePublicIp from "../hooks/usePublicIp";
import { Plus, RotateCcw, Search } from "lucide-react";
import "./../styles/commonForm.css";
import BackButton from "../components/BackButton";

export default function ProductConfigurationCreate() {
  const ip = usePublicIp();
  const username = localStorage.getItem("username") || "system";

  const [configurations, setConfigurations] = useState([]);
  const [programTypes, setProgramTypes] = useState([]);
  const [selectedProgramType, setSelectedProgramType] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [form, setForm] = useState({});
  const [productList, setProductList] = useState([]);
  // console.log(productList)
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fieldLimits, setFieldLimits] = useState({});

  // Available options for select fields
  const cardTypeOptions = [
    { value: "", label: "Select" },
    { value: "Physical", label: "Physical" },
    { value: "Virtual", label: "Virtual" },
    { value: "Both", label: "Both" }
  ];

  const partnerSettlementModelOptions = [
    { value: "", label: "Select" },
    { value: "Float", label: "Float" },
    { value: "Postpaid", label: "Postpaid" },
    { value: "loadClear", label: "loadClear" }
  ];

  const kycLevelOptions = [
    { value: "", label: "Select" },
    { value: "nil", label: "Nil" },
    { value: "min", label: "Min" },
    { value: "medium", label: "Medium" },
    { value: "full", label: "Full" },
    { value: "video", label: "Video" }
  ];

  const riskProfileOptions = [
    { value: "", label: "Select" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" }
  ];

  const availableChannels = ["Ecom", "POS", "ATM"];
  const topmethod = ["Payment gateway", "cash", "Registered bank acount"];

  useEffect(() => {
    async function fetchConfigs() {
      try {
        const res = await axios.get("http://192.168.22.247:7090/api/Export/export_rbi_configuration");
        setConfigurations(res.data);
        const uniquePrograms = [...new Set(res.data.map(cfg => cfg.programType))];
        setProgramTypes(uniquePrograms);
      } catch (err) {
        console.error("Failed to fetch configuration:", err);
      }
    }

    async function fetchProductList() {
      try {
        const res = await axios.get("http://192.168.22.247:7090/api/Export/product_Config_export");
        setProductList(res.data);
      } catch (err) {
        console.error("Failed to fetch product list:", err);
      }
    }

    fetchConfigs();
    fetchProductList();
  }, []);

  useEffect(() => {
    if (selectedProgramType) {
      const subs = configurations
        .filter(cfg => cfg.programType === selectedProgramType)
        .map(cfg => ({
          subCategory: cfg.subCategory,
          description: cfg.programDescription || "No description",
        }));
      setSubCategories(subs);

      if (!subs.some(s => s.subCategory === selectedSubCategory)) {
        setSelectedSubCategory("");
      }
    } else {
      setSubCategories([]);
      setSelectedSubCategory("");
    }

    setForm((prev) => ({
      ...prev,
      programType: selectedProgramType || "",
    }));
  }, [selectedProgramType, configurations]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      subCategory: selectedSubCategory || "",
    }));

    if (!selectedProgramType || !selectedSubCategory) return;

    const matchedConfig = configurations.find(
      cfg => cfg.programType === selectedProgramType && cfg.subCategory === selectedSubCategory
    );

    if (matchedConfig) {
      let newForm = {
        ...matchedConfig,
        productName: form.productName || "",
        description: matchedConfig.programDescription || "",
      };

      if (typeof matchedConfig.transactionReportableFlags === "string") {
        try {
          newForm.transactionReportableFlags = JSON.parse(matchedConfig.transactionReportableFlags);
        } catch {
          newForm.transactionReportableFlags = {};
        }
      }

      if (!isEditing) {
        setForm(newForm);
      } else {
        setForm(prev => ({
          ...newForm,
          ...prev,
        }));
      }

      const limits = {
        maxBalance: matchedConfig.maxBalance || 200000,
        maxLoadAmount: matchedConfig.maxLoadAmount || 10000,
        dailySpendLimit: matchedConfig.dailySpendLimit || 5000,
        monthlySpendLimit: matchedConfig.monthlySpendLimit || 50000,
        refundLimit: matchedConfig.refundLimit || 5000
      };
      setFieldLimits(limits);
    }
  }, [selectedSubCategory, selectedProgramType, configurations]);

  useEffect(() => {

    if (!selectedProgramType || !selectedSubCategory || !isEditing) return;
    const matchedConfig = configurations.find(
      cfg => cfg.programType === selectedProgramType && cfg.subCategory === selectedSubCategory
    );

    if (matchedConfig) {

      const updatedForm = {
        ...matchedConfig,
        ...form,
        description: matchedConfig.programDescription || form.description || "",
      };

      if (typeof updatedForm.transactionReportableFlags === "string") {
        try {
          updatedForm.transactionReportableFlags = JSON.parse(updatedForm.transactionReportableFlags);
        } catch {
          updatedForm.transactionReportableFlags = {};
        }
      }

      setForm(updatedForm);

      const limits = {
        maxBalance: matchedConfig.maxBalance || form.maxBalance || 200000,
        maxLoadAmount: matchedConfig.maxLoadAmount || form.maxLoadAmount || 10000,
        dailySpendLimit: matchedConfig.dailySpendLimit || form.dailySpendLimit || 5000,
        monthlySpendLimit: matchedConfig.monthlySpendLimit || form.monthlySpendLimit || 50000,
        refundLimit: matchedConfig.refundLimit || form.refundLimit || 5000
      };

      setFieldLimits(limits);

    }
  }, [subCategories, selectedProgramType, selectedSubCategory, isEditing]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    const newVal = type === "radio" ? (value === "true") : (type === "checkbox" ? checked : value);
    setForm((prev) => ({ ...prev, [name]: newVal }));
  };


  const validateFields = () => {
    for (const field in fieldLimits) {
      if (form[field] && Number(form[field]) > fieldLimits[field]) {
        alert(`${field} cannot exceed ${fieldLimits[field]}`);
        return false;
      }
    }
    return true;
  };
  const mapToApiPayload = (form) => {
    const parseArray = (val) => {
      if (Array.isArray(val)) return val.map(String);
      if (typeof val === "string") {
        return val
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);
      }
      return [];
    };
    console.log(form.topupMethod)
    return {
      productName: form.productName || "",
      description: form.description || "",
      isActive: form.isActive ?? true,
      productId: form.productId || 0,

      programType: form.programType || "",
      subCategory: form.subCategory || "",
      issuerType: form.issuerType || "",
      authorizationRequired: form.authorizationRequired ?? false,

      validityMinDays: Number(form.validityMinDays) || 0,
      validityMaxDays: Number(form.validityMaxDays) || 0,
      reloadable: form.reloadable ?? false,
      transferable: form.transferable ?? false,
      autoBlockOnExpiry: form.autoBlockOnExpiry ?? false,
      allowPartialKycActivation: form.allowPartialKycActivation ?? false,

      currency: form.currency || "",
      multiUseAllowed: form.multiUseAllowed ?? false,
      minBalance: Number(form.minBalance) || 0,
      maxBalance: Number(form.maxBalance) || 0,
      maxLoadAmount: Number(form.maxLoadAmount) || 0,
      dailySpendLimit: Number(form.dailySpendLimit) || 0,
      monthlySpendLimit: Number(form.monthlySpendLimit) || 0,
      yearlySpendLimit: Number(form.yearlySpendLimit) || 0,
      txnCountLimitPerDay: Number(form.txnCountLimitPerDay) || 0,
      refundLimit: Number(form.refundLimit) || 0,

      atmWithdrawalEnabled: form.atmWithdrawalEnabled ?? false,
      maxCashWithdrawalAmount: Number(form.maxCashWithdrawalAmount) || 0,
      coBrandingAllowed: form.coBrandingAllowed ?? false,
      validityPeriodMonths: Number(form.validityPeriodMonths) || 0,
      gracePeriodDays: Number(form.gracePeriodDays) || 0,
      autoRenewal: form.autoRenewal ?? false,
      closureAllowedPostExpiry: form.closureAllowedPostExpiry ?? false,

      kycRequired: form.kycRequired ?? false,
      kycLevelRequired: form.kycLevelRequired || "nil",
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
      allowedChannels: parseArray(form.allowedChannels),
      allowedMccCodes: parseArray(form.allowedMccCodes),
      geoRestrictions: ["string", "string"],
      merchantWhitelistOnly: form.merchantWhitelistOnly ?? false,
      blockOnFailedKycAttempts: form.blockOnFailedKycAttempts ?? false,
      regulatoryReportingRequired: form.regulatoryReportingRequired ?? false,
      monthlyBalanceReportRequired: form.monthlyBalanceReportRequired ?? false,
      auditTrailEnabled: form.auditTrailEnabled ?? false,
      transactionReportableFlags: JSON.stringify(form.transactionReportableFlags || {}),
      customerAgeMin: Number(form.customerAgeMin) || 0,
      customerAgeMax: Number(form.customerAgeMax) || 0,
      eligibleCustomerTypes: form.eligibleCustomerTypes || [],
      employmentTypesAllowed: form.employmentTypesAllowed || [],
      externalPartnerId: form.externalPartnerId || "00000000-0000-0000-0000-000000000000",
      partnerApiEnabled: form.partnerApiEnabled ?? false,
      issuerBankId: form.issuerBankId || "00000000-0000-0000-0000-000000000000",
      cashLoadingLimit: Number(form.cashLoadingLimit) || 0,
      cardType: form.cardType || "",
      expiryWarningDays: Number(form.expiryWarningDays) || 0,
      dormantPeriodDays: Number(form.dormantPeriodDays) || 0,
      topUpMethod: Array.isArray(form.topupMethod)
        ? form.topupMethod.join(",")
        : (form.topupMethod || ""),
      expiryPeriod: Number(form.expiryPeriod) || 0,

      metadata: {
        ipAddress: ip,
        userAgent: navigator.userAgent,
        channel: "web",
        auditMetadata: {
          createdBy: username,
          createdDate: new Date().toISOString(),
          modifiedBy: username,
          modifiedDate: new Date().toISOString()
        }
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;
    const payload = { ...form };

    // ✅ Convert array to comma-separated string
    if (Array.isArray(payload._Topup_Method)) {
      payload._Topup_Method = payload._Topup_Method.join(",");
    }

    // ✅ Ensure Transaction_Reportable_Flags is string
    if (typeof payload._Transaction_Reportable_Flags !== "string") {
      payload._Transaction_Reportable_Flags = JSON.stringify(payload._Transaction_Reportable_Flags || {});
    }

    // ✅ Add missing metadata.headers
    if (!payload.metadata) payload.metadata = {};
    payload.metadata.headers = "string";

    // ✅ Add missing metadata.auditMetadata.header
    if (!payload.metadata.auditMetadata) payload.metadata.auditMetadata = {};
    payload.metadata.auditMetadata.header = {
      additionalProp1: {
        options: { propertyNameCaseInsensitive: true },
        parent: "string",
        root: "string"
      },
      additionalProp2: {
        options: { propertyNameCaseInsensitive: true },
        parent: "string",
        root: "string"
      },
      additionalProp3: {
        options: { propertyNameCaseInsensitive: true },
        parent: "string",
        root: "string"
      }
    };

    try {
      const res = await axios.post("/your-api-endpoint", payload);
      console.log("Submitted successfully:", res.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }

    try {
      const payload = mapToApiPayload(form); // ✅ Map form to API schema
      console.log(JSON.stringify(payload, null, 2));
      console.log(payload)
      const response = await axios[isEditing ? "put" : "post"](
        `http://192.168.22.247/ps/${isEditing ? "productConfigurationUpdate" : "productConfigurationCreate"}`,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        alert(`Product ${isEditing ? "updated" : "created"} successfully`);
        resetForm();
        const res = await axios.get("http://192.168.22.247:7090/api/Export/product_Config_export");
        setProductList(res.data);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit product configuration." + error?.response?.data);
    }
  };

  const resetForm = () => {
    setForm({});
    setSelectedProgramType("");
    setSelectedSubCategory("");
    setIsEditing(false);
    setFieldLimits({});
  };

  const handleEditProduct = async (productId) => {
    try {
      const res = await axios.get("http://192.168.22.247:7090/api/Export/product_Config_export");
      const product = res.data.find(p => p.productId === productId);
      if (product) {
        setIsEditing(true);
        setForm({
          ...product,
          kycLevelRequired: product.kycLevelRequired || product._Kyc_Level_Required || "nil"
        });
        setFieldLimits({});
        setSelectedProgramType(product.programType);
        setTimeout(() => {
          setSelectedSubCategory(product.subCategory);
        }, 100);

        if (typeof product.transactionReportableFlags === "string") {
          try {
            product.transactionReportableFlags = JSON.parse(product.transactionReportableFlags);
          } catch {
            product.transactionReportableFlags = {};
          }
        }

        setForm(prev => ({ ...prev, ...product }));
      }
    } catch (err) {
      console.error("Edit fetch failed:", err);
    }
  };

  const renderField = (key, value) => {
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    // ✅ Boolean - read-only
    if (typeof value === "boolean") {
      return (
        <div key={key} className="radio-wrapper opacity-70">
          <label className="radio-title">{label}</label>
          <div className="radio-group">
            <label
              className={`custom-radio ${value === true ? "highlight" : "dim"}`}
              style={{ display: value === true ? "inline-flex" : "none" }}
            >
              <input type="radio" checked={value === true} disabled />
              <span className="radio-indicator"></span>Yes
            </label>
            <label
              className={`custom-radio ${value === false ? "highlight" : "dim"}`}
              style={{ display: value === false ? "inline-flex" : "none" }}
            >
              <input type="radio" checked={value === false} disabled />
              <span className="radio-indicator"></span>No
            </label>
          </div>
        </div>
      );
    }


    // ✅ Number - restrict max value in real-time
    if (typeof value === "number") {
      return (
        <div key={key}>
          <label>{label}</label>
          <input
            type="number"
            name={key}
            value={form[key] || ""}
            onChange={(e) => {
              let val = Number(e.target.value);
              if (fieldLimits[key] && val > fieldLimits[key]) {
                val = fieldLimits[key]; // auto-correct if above max
              }
              setForm((prev) => ({ ...prev, [key]: val }));
            }}
            max={fieldLimits[key] || undefined}
            placeholder={`${label}${fieldLimits[key] ? ` (Max: ${fieldLimits[key]})` : ''}`}
            className="nested-form-input"
          />
        </div>
      );
    }

    if (key === "cardType") {
      return (
        <div key={key}>
          <label>{label}</label>
          <select name={key} value={form[key] || ""} onChange={handleChange} className="nested-form-input">
            {cardTypeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      );
    }

    if (key === "partnerSettlementModel") {
      return (
        <div key={key}>
          <label>{label}</label>
          <select name={key} value={form[key] || ""} onChange={handleChange} className="nested-form-input">
            {partnerSettlementModelOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      );
    }

    if (key === "kycLevelRequired") {
      return (
        <div key={key}>
          <label>{label}</label>
          <select name={key} value={form[key] || ""} onChange={handleChange} className="nested-form-input">
            {kycLevelOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      );
    }

    if (key === "riskProfile") {
      return (
        <div key={key}>
          <label>{label}</label>
          <select name={key} value={form[key] || ""} onChange={handleChange} className="nested-form-input">
            {riskProfileOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div key={key}>
        <label>{label}</label>
        <input type="text" name={key} value={form[key] || ""} onChange={handleChange} placeholder={label} className="nested-form-input" />
      </div>
    );
  };

  const groupFields = (formObj) => {
    const groups = {
      "Authorization Settings": [],
      "Product Features": [],
      "Validity Settings": [],
      "KYC & Compliance": [],
      "Transaction Limits": [],
      "Allowed Channels & MCC": [],
      "Other Settings": [],
    };

    Object.entries(formObj).forEach(([key, value]) => {
      if (key === "validityPeriodMonths") return;
      if (["authorizationRequired"].includes(key)) {
        groups["Authorization Settings"].push({ key, value });
      } else if (["reloadable", "transferable", "autoBlockOnExpiry"].includes(key)) {
        groups["Product Features"].push({ key, value });
      } else if (["validityMinDays", "validityMaxDays", "gracePeriodDays"].includes(key)) {
        groups["Validity Settings"].push({ key, value });
      } else if (["kycRequired", "kycLevelRequired", "aadhaarRequired", "panRequired", "allowPartialKycActivation", "riskProfile"].includes(key)) {
        groups["KYC & Compliance"].push({ key, value });
      } else if (["maxBalance", "minBalance", "maxLoadAmount", "dailySpendLimit", "monthlySpendLimit", "refundLimit", "cashLoadingLimit", "maxCashWithdrawalAmount", "txnCountLimitPerDay", "yearlySpendLimit"].includes(key)) {
        groups["Transaction Limits"].push({ key, value });
      } else if (["allowedChannels", "allowedMccCodes"].includes(key)) {
        groups["Allowed Channels & MCC"].push({ key, value });
      } else if (!["productName", "description", "programDescription", "programType", "subCategory", "topupMethod"].includes(key)) {
        // console.log(key)
        groups["Other Settings"].push({ key, value });
      }
    });
    return groups;
  };

  const filteredProductList = productList.filter(prod =>
    (prod.productName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (prod.programType || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (prod.productDescription || "").toLowerCase().includes(searchTerm.toLowerCase())
  );



  const handleCheckboxArrayChange = (field, value, checked) => {
    setForm((prev) => {
      const current = Array.isArray(prev[field])
        ? prev[field]
        : typeof prev[field] === "string" && prev[field].trim()
          ? prev[field].split(",").map(s => s.trim())
          : [];
      const updated = checked
        ? [...new Set([...current, value])]
        : current.filter((item) => item !== value);
      return { ...prev, [field]: updated };
    });
  };

  const handleTopupMethodChange = (e) => {
    const { value, checked } = e.target;

    setForm((prev) => {
      let updatedTopup = Array.isArray(prev.topupMethod) ? [...prev.topupMethod] : [];

      if (checked) {
        if (!updatedTopup.includes(value)) updatedTopup.push(value);
      } else {
        updatedTopup = updatedTopup.filter((item) => item !== value);
      }

      return {
        ...prev,
        topupMethod: updatedTopup
      };
    });
  };


  return (
    <div className="page-container">
      <BackButton />
      <div className="product-container">
        <form onSubmit={handleSubmit} className="product-form">
          <h2 className="form-heading-subheading">{isEditing ? "Edit Product Configuration" : "Create Product Configuration"}</h2>


          <div className="PC-form-grid">
            {/* Product Name */}
            <div>
              <label>Product Name</label>
              <input
                type="text"
                name="productName"
                value={form.productName || ""}
                onChange={handleChange}
                placeholder="Enter product name"
                className="nested-form-input"
                required
              />
            </div>

            {/* Program Type */}
            <div>
              <label>Program Type</label>
              <select
                value={selectedProgramType}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedProgramType(value);
                  setForm((prev) => ({
                    ...prev,
                    programType: value,
                  }));
                }}
                className="nested-form-input"
              >
                <option value="">Select Program</option>
                {programTypes.map((pt) => (
                  <option key={pt} value={pt}>
                    {pt}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub Category */}
            <div>
              <label>Sub Category</label>
              <select
                value={selectedSubCategory}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedSubCategory(value);
                  setForm((prev) => ({
                    ...prev,
                    subCategory: value,
                  }));
                }}
                className="nested-form-input"
              >
                <option value="">Select Sub Category</option>
                {subCategories.map((sc) => (
                  <option key={sc.subCategory} value={sc.subCategory}>
                    {`${sc.subCategory} `}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Description */}
            <div>
              <label>Product Description</label>
              <p className="nested-form-input bg-gray-100 cursor-not-allowed mt-2">
                {form.description || "No description available"}
              </p>
            </div>

          </div>

          {selectedSubCategory && Object.entries(groupFields(form)).map(([groupTitle, fields]) => {
            const excludedKeys = [
              "productName",
              "description",
              "productDescription",
              "programType",
              "subCategory"
            ];
            fields = fields.filter(f => !excludedKeys.includes(f.key));

            if (fields.length === 0) return null;
            const booleanFields = fields.filter(f => typeof f.value === "boolean");
            const numberFields = fields.filter(f => typeof f.value === "number");
            const textFields = fields.filter(f => typeof f.value === "string");
            const arrayFields = fields.filter(f => Array.isArray(f.value));

            return (
              <div key={groupTitle} className="field-group-box mt-6 p-4 border rounded-md shadow-sm bg-gray-50">
                <h3 className="sub-form-title">{groupTitle}</h3>

                {booleanFields.length > 0 && (
                  <div className="mb-4 p-3  rounded">
                    {/* <h4 className="font-medium mb-2">Boolean Settings</h4> */}
                    <div className="form-grid">{booleanFields.map(({ key, value }) => renderField(key, value))}</div>
                  </div>
                )}

                {numberFields.length > 0 && (
                  <div className=" p-3  rounded">
                    <div className="form-grid">{numberFields.map(({ key, value }) => renderField(key, value))}</div>
                  </div>
                )}

                {textFields.length > 0 && (
                  <div className=" p-3  rounded">
                    <div className="form-grid">{textFields.map(({ key, value }) => renderField(key, value))}</div>
                  </div>
                )}
                {groupTitle === "Allowed Channels & MCC" && (
                  <div>
                    <div>
                      <label>Allowed MCC Codes</label>
                      <input
                        type="text"
                        name="allowedMccCodes"
                        value={form.allowedMccCodes || ""}
                        onChange={handleChange}
                        placeholder="Enter allowed MCC codes seperated by comma"
                        className="nested-form-input"
                      />
                    </div>
                    {/* Allowed Channels */}
                    <h4 className="font-medium mb-2 mt-4">Allowed Channels</h4>
                    <div className="form-checkbox">
                      {availableChannels.map((channel) => (
                        <label key={channel} className="option-label">
                          <input
                            type="checkbox"
                            value={channel}
                            checked={(form.allowedChannels || []).includes(channel)}
                            onChange={(e) =>
                              handleCheckboxArrayChange("allowedChannels", channel, e.target.checked)
                            }
                            className="mr-1"
                          />
                          {channel}
                        </label>
                      ))}
                    </div>

                    {/* Topup Methods */}
                    <h4 className="font-medium mb-2 mt-4">Topup Methods</h4>
                    <div className="form-checkbox">
                      {topmethod.map((method) => (
                        <label key={method} className="option-label">
                          <input
                            type="checkbox"
                            value={method}
                            checked={Array.isArray(form.topupMethod) && form.topupMethod.includes(method)}
                            onChange={handleTopupMethodChange}
                          />

                          {method}
                        </label>
                      ))}
                    </div>


                  </div>
                )}

                
              </div>
            );
          })}

          <div className="form-actions mt-6 flex gap-4">
            <button type="submit" className="btn-green flex items-center gap-2"><Plus size={18} /> {isEditing ? "Update" : "Submit"}</button>
            <button type="button" onClick={resetForm} className="btn-blue flex items-center gap-2"><RotateCcw size={18} /> Reset</button>
          </div>
        </form>

        <h3 className="form-heading">Existing Configurations</h3>
        <div className="search-bar">
          <Search className="search-icon" />
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by product name or type" />
        </div>
        <table className="product-table w-full text-sm">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Program Type</th>
              <th>Description</th>
              <th>Remarks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProductList.map((prod) => (
              <tr key={prod.productId} >
                <td>{prod.productName}</td>
                <td>{prod.programType}</td>
                <td>{prod.productDescription}</td>
                <td className={prod.remarks === "Pending" ? "" : "blink-red"}>{prod.remarks || "—"}{prod.remarks === "Pending" ? "" : "!"}</td>
                <td>
                  <button
                    type="button"
                    className="btn-blue"
                    onClick={() => handleEditProduct(prod.productId)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}