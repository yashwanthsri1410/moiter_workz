import React, { useEffect, useState } from "react";
import axios from "axios";

const kycLevels = ["MIN", "FULL", "VIDEO"];
const riskCategories = ["Low", "Medium", "High"];
const riskProfiles = ["Low", "Medium", "High"];
const partnerSettlementModels = ["Float", "Postpaid", "LoadClear"];
const currencyOptions = ["INR", "USD", "EUR", "GBP", "JPY"];
const transactionReportableFlagOptions = ["HIGH_VALUE",
  "INTERNATIONAL",
  "CASH_WITHDRAWAL",
  "PEP_INVOLVED",
  "THIRD_PARTY",
  "CROSS_BORDER"];

export default function ProductConfigurationUpdate() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    axios
      .get("http://192.168.22.247:7090/api/Export/product_Config_export")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Failed to fetch products", error));

    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) =>
        setFormData((prev) => ({
          ...prev,
          metadata: {
            ...prev?.metadata,
            ipAddress: data.ip,
          },
        }))
      );
  }, []);

  useEffect(() => {
    if (selectedProductId !== null) {
      const selected = products.find((p) => p.productId === Number(selectedProductId));
      setFormData({
        ...selected,
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
            header: {},
          },
        },
      });
    }
  }, [selectedProductId, products]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleBooleanChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        externalPartnerId: formData?.externalPartnerId || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        issuerBankId: formData?.issuerBankId || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      };

      console.log(payload);
      await axios.put("http://192.168.22.247/ps/productConfigurationUpdate", payload);
      alert("Product configuration updated successfully");
    } catch (error) {
      console.error("Update failed", error);
      alert("Update failed");
    }
  };

  const renderBooleanField = (label, field) => (
    <div key={field}>
      <label className="block mb-1 font-semibold text-white">{label}</label>
      <div className="flex gap-4">
        <label>
          <input
            type="radio"
            checked={formData?.[field] === true}
            onChange={() => handleBooleanChange(field, true)}
          />{" "}
          Yes
        </label>
        <label>
          <input
            type="radio"
            checked={formData?.[field] === false}
            onChange={() => handleBooleanChange(field, false)}
          />{" "}
          No
        </label>
      </div>
    </div>
  );

  const renderInputField = (label, field, type = "text") => (
    <div key={field}>
      <label className="block mb-1 font-semibold text-white">{label}</label>
      <input
        type={type}
        name={field}
        value={formData?.[field] ?? ""}
        onChange={(e) => handleChange(field, type === "number" ? Number(e.target.value) : e.target.value)}
        className="bg-[#1b1b3b] text-white border border-[#444] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 w-full"
      />
    </div>
  );

  const renderSelectField = (label, field, options) => (
    <div key={field}>
      <label className="block mb-1 font-semibold text-white">{label}</label>
      <select
        name={field}
        value={formData?.[field] ?? ""}
        onChange={(e) => handleChange(field, e.target.value)}
        className="bg-[#1b1b3b] text-white border border-[#444] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 w-full"
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d28] p-6">
      <div className="w-full max-w-6xl bg-[#11112b] rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="text-4xl mb-3">🔧</div>
          <h2 className="text-white font-semibold text-2xl">Update Product Configuration</h2>
        </div>

        <div className="mb-8">
          <label className="block mb-2 text-white font-semibold">Select Product</label>
          <select
            className="w-full bg-[#1b1b3b] text-white border border-[#444] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            onChange={(e) => setSelectedProductId(Number(e.target.value))}
            value={selectedProductId ?? ""}
          >
            <option value="">Select a product...</option>
            {products.map((product) => (
              <option key={product.productId} value={product.productId}>
                {`ID${product.productId || ""} ${product.productName} ${product.productType || ""} ${product.description || ""}`}
              </option>
            ))}
          </select>
        </div>

        {formData && (
          <form className="space-y-8 text-white" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 border border-gray-700 p-4 rounded">
              {renderBooleanField("Reloadable", "reloadable")}
              {renderBooleanField("Transferable", "transferable")}
              {renderBooleanField("Auto Block On Expiry", "autoBlockOnExpiry")}
              {renderBooleanField("Partial KYC Activation", "allowPartialKycActivation")}
              {renderSelectField("Currency", "currency", currencyOptions)}
              {renderBooleanField("ATM Withdrawal Enabled", "atmWithdrawalEnabled")}
              {renderBooleanField("Auto Renewal", "autoRenewal")}
              {renderBooleanField("Closure Allowed Post Expiry", "closureAllowedPostExpiry")}
              {renderBooleanField("KYC Required", "kycRequired")}
              {renderSelectField("KYC Level Required", "kycLevelRequired", kycLevels)}
              {renderBooleanField("Aadhaar Required", "aadhaarRequired")}
              {renderBooleanField("PAN Required", "panRequired")}
              {renderSelectField("Risk Profile", "riskProfile", riskProfiles)}
              {renderSelectField("Risk Category", "riskCategory", riskCategories)}
              {renderBooleanField("PEP Check Required", "pepCheckRequired")}
              {renderBooleanField("Blacklist Check Required", "blacklistCheckRequired")}
              {renderBooleanField("CKYC Upload Required", "ckycUploadRequired")}
              {renderBooleanField("Merchant Whitelist Only", "merchantWhitelistOnly")}
              {renderBooleanField("Block On Failed KYC Attempts", "blockOnFailedKycAttempts")}
              {renderBooleanField("Regulatory Reporting Required", "regulatoryReportingRequired")}
              {renderBooleanField("Monthly Balance Report Required", "monthlyBalanceReportRequired")}
              {renderBooleanField("Audit Trail Enabled", "auditTrailEnabled")}
              {renderBooleanField("Partner API Enabled", "partnerApiEnabled")}
            </div>

            <div className="grid grid-cols-2 gap-4 border border-gray-700 p-4 rounded">
              {renderInputField("Min Balance", "minBalance", "number")}
              {renderInputField("Max Balance", "maxBalance", "number")}
              {renderInputField("Max Load Amount", "maxLoadAmount", "number")}
              {renderInputField("Daily Spend Limit", "dailySpendLimit", "number")}
              {renderInputField("Monthly Spend Limit", "monthlySpendLimit", "number")}
              {renderInputField("Txn Count Limit/Day", "txnCountLimitPerDay", "number")}
              {renderInputField("Refund Limit", "refundLimit", "number")}
              {renderInputField("Validity Period (Months)", "validityPeriodMonths", "number")}
              {renderInputField("Grace Period (Days)", "gracePeriodDays", "number")}
              {renderInputField("Customer Age Min", "customerAgeMin", "number")}
              {renderInputField("Customer Age Max", "customerAgeMax", "number")}
              {renderSelectField("Transaction Reportable Flags", "transactionReportableFlags", transactionReportableFlagOptions)}
              {renderSelectField("Partner Settlement Model", "partnerSettlementModel", partnerSettlementModels)}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-md hover:opacity-90 transition"
            >
              Update Configuration
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
