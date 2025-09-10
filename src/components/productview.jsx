import React, { useState } from "react";
import {
  ArrowLeft,
  FileText,
  Check,
  X,
  Shield,
  CardSimIcon,
  Notebook,
  VaultIcon,
  ReceiptPoundSterlingIcon,
  CreditCard,
  NotebookPen,
  RefreshCw,
} from "lucide-react";
import axios from "axios";

export default function Productview({ selectedProduct, setSelectedProduct }) {
  const [remarks, setRemarks] = useState("");
  const [currentAction, setCurrentAction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  if (!selectedProduct) return null;

  const statusMap = {
    0: "Approved",
    1: "Pending",
    2: "Disapproved",
    3: "Recheck",
  };

  const accessMap = {
    0: "Infra",
    1: "Checker",
    2: "Maker",
  };

  const formatValue = (val) => {
    if (typeof val === "boolean") return val ? "Yes" : "No";
    if (Array.isArray(val)) return val.join(", ");
    return val ?? "-";
  };
  const handleActionClick = (actionStatus) => {
    setCurrentAction(actionStatus);
    setRemarks(selectedProduct.remarks || "");
    setShowModal(true);
  };
  const submitAction = async () => {
    try {
      const payload = {
        productId: selectedProduct.productId,
        actionStatus: currentAction,
        checker: "checkerUser", // Replace with logged-in user if available
        remarks: remarks,
        productAccess: selectedProduct.productAccess,
      };
      await axios.post(
        `${API_BASE_URL}/ps/approveProductConfiguration`,
        payload
      );

      alert("Action submitted successfully!");
      setShowModal(false);
      setRemarks("");
    } catch (err) {
      console.error("Error submitting action:", err);
      alert("Failed to submit action");
      setShowModal(false)
    }
  };
  const getStatusLabel = (value) => {
    switch (value) {
      case 0:
        return "Approved";
      case 1:
        return "Pending";
      case 2:
        return "Disapproved";
      case 3:
        return "Recheck";
      default:
        return "Unknown";
    }
  };
  return (
    <div className="config-forms">
      {/* Header */}
      <div className="card-header">
        <div className="card-header-left flex items-center gap-3">
          <button
            className="approval-back-button"
            onClick={() => setSelectedProduct(null)}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Approvals
          </button>
          <div className="header-icon-box">
            <FileText className="text-[#00d4aa] w-4 h-4" />
          </div>
          <div>
            <h1 className="header-title">Product Approvals</h1>
            <p className="header-subtext">
              Review and approve product configurations
            </p>
          </div>
        </div>
        <div className="card-header-right">
          <div className="portal-info flex gap-2">
            <p className="portal-link">
              <span
                className={`px-2 py-1 rounded text-[10px] ${selectedProduct.programType === "Closed"
                    ? "checker"
                    : selectedProduct.programType === "Semi-Closed"
                      ? "infra"
                      : selectedProduct.programType === "opened"
                        ? "superuser"
                        : selectedProduct.programType === "open"
                          ? "maker"
                          : ""
                  }`}
              >
                {selectedProduct.programType}
              </span>
            </p>
            <p className="portal-link">
              <span
                className={`px-2 py-1 rounded text-[10px] ${selectedProduct.status === 0
                    ? "checker"
                    : selectedProduct.status === 1
                      ? "infra"
                      : selectedProduct.status === 2
                        ? "superuser"
                        : selectedProduct.status === 3
                          ? "maker"
                          : ""
                  }`}
              >
                {getStatusLabel(selectedProduct.status)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Product Overview */}
      <div className="bg-[#0c0f16] border border-[#1a1f2e] rounded-xl p-6 mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 mb-2">
            <Notebook className="w-4 h-4 text-teal-400" />
            <h3 className="text-teal-400 text-[15px]">Product Overview</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm text-gray-300">
          <div>
            <p className="mt-3">
              <strong>ID:</strong> {selectedProduct.productId}
            </p>
            <p className="mt-3">
              <strong>Name:</strong> {selectedProduct.productName}
            </p>
            <p className="mt-3">
              <strong>Program:</strong>{" "}
              <span
                className={`px-2 py-1 rounded text-[10px] ${selectedProduct.programType === "Closed"
                    ? "checker"
                    : selectedProduct.programType === "Semi-Closed"
                      ? "infra"
                      : selectedProduct.programType === "opened"
                        ? "superuser"
                        : selectedProduct.programType === "open"
                          ? "maker"
                          : ""
                  }`}
              >
                {selectedProduct.programType}
              </span>
            </p>
            <p className="mt-3" >
              <strong>Sub Category:</strong> {selectedProduct.subCategory}
            </p>
            <p className="mt-3">
              <strong>Status:</strong> {statusMap[selectedProduct.status]}
            </p>
          </div>
          <div>
            <p className="mt-3">
              <strong>Currency:</strong> {selectedProduct.currency}
            </p>
            <p className="mt-3">
              <strong>Card Type:</strong> {selectedProduct.cardType}
            </p>
            <p className="mt-3">
              <strong>Validity:</strong> {selectedProduct.minimumValidityDays} -{" "}
              {selectedProduct.maximumValidityDays} days
            </p>
            <p className="mt-3">
              <strong>Access:</strong>{" "}
              {accessMap[selectedProduct.productAccess]}
            </p>
          </div>
        </div>

        {/* Remarks */}
        <div className="mt-4">
        
        <p className="mt-3 text-[15px]">
          <strong>Description:</strong> {selectedProduct.productDescription || "No description available."}
        </p>
        </div>
      </div>

      {/* Transaction Limits */}
      <div className="bg-[#0c0f16] border border-[#1a1f2e] rounded-xl p-6 mt-6">
        <div className="flex items-center space-x-2 mb-2">
          <CardSimIcon className="w-4 h-4 text-teal-400" />
          <h3 className="text-teal-400 text-[15px]"> Transaction Limits</h3>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm text-gray-300">
          <p>
            <strong>Max Balance:</strong> {selectedProduct.maxBalance}
          </p>
          <p>
            <strong>Max Load:</strong> {selectedProduct.maxLoadAmount}
          </p>
          <p>
            <strong>Daily Spend:</strong> {selectedProduct.dailySpendLimit}
          </p>
          <p>
            <strong>Monthly Spend:</strong> {selectedProduct.monthlySpendLimit}
          </p>
          <p>
            <strong>Refund Limit:</strong> {selectedProduct.refundLimit}
          </p>
          <p>
            <strong>Txn/Day:</strong> {selectedProduct.txnCountLimitPerDay}
          </p>
        </div>
      </div>

      {/* Compliance */}
      <div className="bg-[#0c0f16] border border-[#1a1f2e] rounded-xl p-6 mt-6">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-4 h-4 text-teal-400" />
          <h3 className="text-teal-400 text-[15px]">Compliance</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
          <p>
            <strong>KYC Required:</strong>{" "}
            {formatValue(selectedProduct.kycRequired)}
          </p>
          <p>
            <strong>KYC Level:</strong> {selectedProduct.kycLevelRequired}
          </p>
          <p>
            <strong>Aadhaar Required:</strong>{" "}
            {formatValue(selectedProduct.aadhaarRequired)}
          </p>
          <p>
            <strong>PAN Required:</strong>{" "}
            {formatValue(selectedProduct.panRequired)}
          </p>
          <p>
            <strong>AML/CFT:</strong>{" "}
            {formatValue(selectedProduct.amlCftApplicable)}
          </p>
          <p>
            <strong>PEP Check:</strong>{" "}
            {formatValue(selectedProduct.pepCheckRequired)}
          </p>
        </div>
      </div>

      {/* Channels & MCCs */}
      <div className="bg-[#0c0f16] border border-[#1a1f2e] rounded-xl p-6 mt-6">
        <div className="flex items-center space-x-2 mb-2">
          <CreditCard className="w-4 h-4 text-teal-400" />
          <h3 className="text-teal-400 text-[15px]">Allowed Channels & MCCs</h3>
        </div>
        <div className="flex gap-2 flex-wrap mb-2">
          {selectedProduct.allowedChannels?.map((ch, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-gray-800 rounded text-xs text-[#00d4aa]"
            >
              {ch}
            </span>
          ))}
        </div>
        <div className="text-sm text-gray-300">
          <strong>MCC Codes:</strong>{" "}
          {selectedProduct.allowedMccCodes?.join(", ") || "-"}
        </div>
      </div>

      {/* Validity Settings */}
      <div className="bg-[#0c0f16] border border-[#1a1f2e] rounded-xl p-6 mt-6">
        <div className="flex items-center space-x-2 mb-2">
          <VaultIcon className="w-4 h-4 text-teal-400" />
          <h3 className="text-teal-400 text-[15px]">Validity Settings</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
          <p>
            <strong>Validity Period (Months):</strong>{" "}
            {selectedProduct.validityPeriodMonths}
          </p>
          <p>
            <strong>Auto Renewal:</strong>{" "}
            {formatValue(selectedProduct.autoRenewal)}
          </p>
          <p>
            <strong>Expiry Warning Days:</strong>{" "}
            {selectedProduct.expiryWarningDays}
          </p>
          <p>
            <strong>Dormant Period Days:</strong>{" "}
            {selectedProduct.dormantPeriodDays}
          </p>
          <p>
            <strong>Closure Allowed Post Expiry:</strong>{" "}
            {formatValue(selectedProduct.closureAllowedPostExpiry)}
          </p>
        </div>
      </div>

      {/* Other Settings */}
      <div className="bg-[#0c0f16] border border-[#1a1f2e] rounded-xl p-6 mt-6">
        <div className="flex items-center space-x-2 mb-2">
          <FileText className="w-4 h-4 text-teal-400" />
          <h3 className="text-teal-400 text-[15px]">Other Settings</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
          <p>
            <strong>Reloadable:</strong>{" "}
            {formatValue(selectedProduct.reloadable)}
          </p>
          <p>
            <strong>Transferable:</strong>{" "}
            {formatValue(selectedProduct.transferable)}
          </p>
          <p>
            <strong>Multi Use Allowed:</strong>{" "}
            {formatValue(selectedProduct.multiUseAllowed)}
          </p>
          <p>
            <strong>Audit Trail:</strong>{" "}
            {formatValue(selectedProduct.auditTrailEnabled)}
          </p>
          <p>
            <strong>Domestic Transfer:</strong>{" "}
            {formatValue(selectedProduct.domesticTransferAllowed)}
          </p>
          <p>
            <strong>Cross Border Allowed:</strong>{" "}
            {formatValue(selectedProduct.crossBorderAllowed)}
          </p>
        </div>
      </div>

      {/* Eligibility */}
      <div className="bg-[#0c0f16] border border-[#1a1f2e] rounded-xl p-6 mt-6">
        <div className="flex items-center space-x-2 mb-2">
          <ReceiptPoundSterlingIcon className="w-4 h-4 text-teal-400" />
          <h3 className="text-teal-400 text-[15px]">Eligibility</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
          <p>
            <strong>Age:</strong> {selectedProduct.customerAgeMin} -{" "}
            {selectedProduct.customerAgeMax}
          </p>
          <p>
            <strong>Customer Types:</strong>{" "}
            {selectedProduct.eligibleCustomerTypes?.join(", ")}
          </p>
          <p>
            <strong>Employment Types:</strong>{" "}
            {selectedProduct.employmentTypesAllowed?.join(", ")}
          </p>
        </div>
      </div>

      {/* Remarks */}
      <div className="bg-[#0d0f13] p-4 rounded-md border border-gray-800 mt-5">
        <div className="flex items-center space-x-2 mb-2">
          <NotebookPen className="w-4 h-4 text-teal-400" />
          <h3 className="text-teal-400 text-[15px]">Remarks</h3>
        </div>
        <p className="text-gray-300 text-[16px]">
          {selectedProduct.remarks || "No remarks available"}
        </p>
      </div>

      {/* Product Review Actions */}

      <div className="product-actions mt-6">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-4 h-4 text-teal-400" />
          <h3 className="text-teal-400 text-[15px]">Product Review Actions</h3>
        </div>
        <div className="button-group">
          <button
            className="btn approval-btn-blue"
            onClick={() => handleActionClick(3)}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Recheck Product</span>
          </button>
          <div className="button-group-row flex gap-2 mt-2">
            <button
              className="btn approval-btn-green"
              onClick={() => handleActionClick(0)}
            >
              <Check className="w-4 h-4" />
              <span>Approve Product</span>
            </button>

            <button
              className="btn approval-btn-red"
              onClick={() => handleActionClick(2)}
            >
              <X className="w-4 h-4" />
              <span>Reject Product</span>
            </button>
          </div>
        </div>
        <p className="note text-gray-400 text-sm mt-2">
          Review all product details carefully before making a decision
        </p>
      </div>

      {/* Remarks Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">
              {currentAction === 0 && "Confirm product Approval"}
              {currentAction === 2 && "Confirm product Rejection"}
              {currentAction === 3 && "Confirm product Recheck"}
            </h2>

            <p className="modal-subtext">
              Are you sure you want to{" "}
              {currentAction === 0
                ? "approve"
                : currentAction === 2
                  ? "reject"
                  : "recheck"}{" "}
              <b>{selectedProduct.productName}</b>? This action cannot be
              undone.
            </p>

            <label className="modal-label">
              {currentAction === 0 && "Approval Remarks (Optional)"}
              {currentAction === 2 && "Rejection Remarks (Optional)"}
              {currentAction === 3 && "Recheck Remarks (Optional)"}
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="modal-textarea"
              placeholder="Enter remarks..."
            />

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className={`btn-submit ${currentAction === 0
                    ? "btn-approve-green"
                    : currentAction === 2
                      ? "btn-reject-red"
                      : "btn-recheck-blue"
                  }`}
                onClick={submitAction}
              >
                {currentAction === 0 && (
                  <>
                    <Check className="w-4 h-4" /> Approve product
                  </>
                )}
                {currentAction === 2 && (
                  <>
                    <X className="w-4 h-4" /> Reject product
                  </>
                )}
                {currentAction === 3 && (
                  <>
                    <RefreshCw className="w-4 h-4" /> Recheck product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}