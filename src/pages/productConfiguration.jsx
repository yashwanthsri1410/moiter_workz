import React, { useEffect, useState } from "react";
import axios from "axios";

const kycLevels = ["MIN", "FULL", "VIDEO"];
const riskCategories = ["Low", "Medium", "High"];
const riskProfiles = ["Low", "Medium", "High"];
const partnerSettlementModels = ["Float", "Postpaid", "LoadClear"];
const currencyOptions = ["INR", "USD", "EUR", "GBP", "JPY"];
const transactionFlags = [
  "HIGH_VALUE",
  "INTERNATIONAL",
  "CASH_WITHDRAWAL",
  "PEP_INVOLVED",
  "THIRD_PARTY",
  "CROSS_BORDER"
];

export default function ProductConfiguration() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productId: 0,
    reloadable: true,
    transferable: true,
    autoBlockOnExpiry: true,
    allowPartialKycActivation: true,
    currency: "INR",
    multiUseAllowed: true,
    minBalance: 0,
    maxBalance: 0,
    maxLoadAmount: 0,
    dailySpendLimit: 0,
    monthlySpendLimit: 0,
    txnCountLimitPerDay: 0,
    refundLimit: 0,
    atmWithdrawalEnabled: true,
    validityPeriodMonths: 0,
    gracePeriodDays: 0,
    autoRenewal: true,
    closureAllowedPostExpiry: true,
    kycRequired: true,
    kycLevelRequired: "MIN",
    aadhaarRequired: true,
    panRequired: true,
    riskProfile: "Low",
    riskCategory: "Low",
    pepCheckRequired: true,
    blacklistCheckRequired: true,
    ckycUploadRequired: true,
    allowedChannels: ["Online"],
    allowedMccCodes: ["6011"],
    geoRestrictions: ["IN"],
    merchantWhitelistOnly: true,
    blockOnFailedKycAttempts: true,
    regulatoryReportingRequired: true,
    monthlyBalanceReportRequired: true,
    auditTrailEnabled: true,
    transactionReportableFlags: [],
    customerAgeMin: 18,
    customerAgeMax: 60,
    eligibleCustomerTypes: ["Individual"],
    employmentTypesAllowed: ["Salaried"],
    externalPartnerId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    partnerApiEnabled: true,
    partnerSettlementModel: "Float",
    issuerBankId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    metadata: {
      ipAddress: "",
      userAgent: navigator.userAgent,
      headers: "",
      channel: "Web",
      auditMetadata: {
        createdBy: "admin",
        createdDate: new Date().toISOString(),
        modifiedBy: "admin",
        modifiedDate: new Date().toISOString(),
        header: {}
      }
    }
  });

  useEffect(() => {
    axios.get("http://192.168.22.247:7090/api/Export/product_export")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Failed to fetch products", error));

    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => {
        setFormData((prev) => ({
          ...prev,
          metadata: {
            ...prev.metadata,
            ipAddress: data.ip
          }
        }));
      });
  }, []);

  const handleBooleanChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductSelect = (e) => {
    const selectedId = parseInt(e.target.value);
    setFormData((prev) => ({
      ...prev,
      productId: selectedId
    }));
  };

  const handleTransactionFlagChange = (flag) => {
    setFormData((prev) => {
      const flags = prev.transactionReportableFlags.includes(flag)
        ? prev.transactionReportableFlags.filter(f => f !== flag)
        : [...prev.transactionReportableFlags, flag];
      return { ...prev, transactionReportableFlags: flags };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      transactionReportableFlags: formData.transactionReportableFlags.join(",")
    };
    try {
      await axios.post("http://192.168.22.247/ps/productConfigurationCreate", payload);
      alert("Product configuration submitted successfully");
    } catch (error) {
      console.error(error);
      alert("Submission failed");
    }
  };

  const renderBooleanField = (label, field) => (
    <div>
      <label className="block mb-1 font-semibold">{label}</label>
      <div className="flex gap-4">
        <label>
          <input type="radio" checked={formData[field]} onChange={() => handleBooleanChange(field, true)} /> Yes
        </label>
        <label>
          <input type="radio" checked={!formData[field]} onChange={() => handleBooleanChange(field, false)} /> No
        </label>
      </div>
    </div>
  );

  const renderInputField = (label, field, type = "text") => (
    <div>
      <label className="block mb-1 font-semibold">{label}</label>
      <input
        type={type}
        name={field}
        value={formData[field]}
        onChange={handleInputChange}
        className="bg-[#1b1b3b] text-white border border-[#444] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 w-full"
      />
    </div>
  );

  const renderSelectField = (label, field, options) => (
    <div>
      <label className="block mb-1 font-semibold">{label}</label>
      <select
        name={field}
        value={formData[field]}
        onChange={handleInputChange}
        className="bg-[#1b1b3b] text-white border border-[#444] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 w-full"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  const renderTransactionFlags = () => (
    <div>
      <label className="block mb-1 font-semibold text-white">Transaction Reportable Flags</label>
      <div className="grid grid-cols-2 gap-2">
        {transactionFlags.map((flag) => (
          <label key={flag} className="text-white flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.transactionReportableFlags.includes(flag)}
              onChange={() => handleTransactionFlagChange(flag)}
            />
            {flag}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d28] p-6">
      <div className="w-full max-w-6xl bg-[#11112b] rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="text-4xl mb-3">⚙️</div>
          <h2 className="text-white font-semibold text-2xl">Product Configuration Form</h2>
        </div>

        {/* Product Dropdown */}
        <div className="mb-8">
          <label className="block mb-2 text-white font-semibold">Select Product</label>
          <select
            className="w-full bg-[#1b1b3b] text-white border border-[#444] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            onChange={handleProductSelect}
            value={formData.productId}
          >
            <option value={0} disabled>Select a product...</option>
            {products.map((product) => (
              <option key={product.productId} value={product.productId}>
                {`${product.productName} | ${product.productType} | ${product.description || 'No description'}`}
              </option>
            ))}
          </select>
        </div>

        <form className="space-y-8 text-white" onSubmit={handleSubmit}>
          {/* General Config */}
          <div className="grid grid-cols-2 gap-4 border border-gray-700 p-4 rounded">
            {renderBooleanField("Reloadable", "reloadable")}
            {renderBooleanField("Transferable", "transferable")}
            {renderBooleanField("Auto Block On Expiry", "autoBlockOnExpiry")}
            {renderBooleanField("Partial KYC Activation", "allowPartialKycActivation")}
            {renderSelectField("Currency", "currency", currencyOptions)}
            {renderBooleanField("Multi-Use Allowed", "multiUseAllowed")}
          </div>

          {/* Financial Limits */}
          <div className="grid grid-cols-2 gap-4 border border-gray-700 p-4 rounded">
            {renderInputField("Min Balance", "minBalance", "number")}
            {renderInputField("Max Balance", "maxBalance", "number")}
            {renderInputField("Max Load Amount", "maxLoadAmount", "number")}
            {renderInputField("Daily Spend Limit", "dailySpendLimit", "number")}
            {renderInputField("Monthly Spend Limit", "monthlySpendLimit", "number")}
            {renderInputField("Txn Count Limit/Day", "txnCountLimitPerDay", "number")}
            {renderInputField("Refund Limit", "refundLimit", "number")}
          </div>

          {/* Card Validity */}
          <div className="grid grid-cols-2 gap-4 border border-gray-700 p-4 rounded">
            {renderBooleanField("ATM Withdrawal Enabled", "atmWithdrawalEnabled")}
            {renderInputField("Validity Period (Months)", "validityPeriodMonths", "number")}
            {renderInputField("Grace Period (Days)", "gracePeriodDays", "number")}
            {renderBooleanField("Auto Renewal", "autoRenewal")}
            {renderBooleanField("Closure Allowed Post Expiry", "closureAllowedPostExpiry")}
          </div>

          {/* KYC & Compliance */}
          <div className="grid grid-cols-2 gap-4 border border-gray-700 p-4 rounded">
            {renderBooleanField("KYC Required", "kycRequired")}
            {renderSelectField("KYC Level Required", "kycLevelRequired", kycLevels)}
            {renderBooleanField("Aadhaar Required", "aadhaarRequired")}
            {renderBooleanField("PAN Required", "panRequired")}
            {renderSelectField("Risk Profile", "riskProfile", riskProfiles)}
            {renderSelectField("Risk Category", "riskCategory", riskCategories)}
            {renderBooleanField("PEP Check Required", "pepCheckRequired")}
            {renderBooleanField("Blacklist Check Required", "blacklistCheckRequired")}
            {renderBooleanField("CKYC Upload Required", "ckycUploadRequired")}
          </div>

          {/* Controls & Restrictions */}
          <div className="grid grid-cols-2 gap-4 border border-gray-700 p-4 rounded">
            {renderBooleanField("Merchant Whitelist Only", "merchantWhitelistOnly")}
            {renderBooleanField("Block on Failed KYC Attempts", "blockOnFailedKycAttempts")}
            {renderBooleanField("Regulatory Reporting Required", "regulatoryReportingRequired")}
            {renderBooleanField("Monthly Balance Report Required", "monthlyBalanceReportRequired")}
            {renderBooleanField("Audit Trail Enabled", "auditTrailEnabled")}
          </div>

          {/* Other Section */}
          <div className="grid grid-cols-2 gap-4 border border-gray-700 p-4 rounded">
            {renderTransactionFlags()}
            {renderInputField("Customer Age Min", "customerAgeMin", "number")}
            {renderInputField("Customer Age Max", "customerAgeMax", "number")}
            {renderSelectField("Partner Settlement Model", "partnerSettlementModel", partnerSettlementModels)}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-md hover:opacity-90 transition"
          >
            Submit Configuration
          </button>
        </form>
      </div>
    </div>
  );
}
