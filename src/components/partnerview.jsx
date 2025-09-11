import React, { useState } from "react";
import {
  Mail,
  Phone,
  Calendar,
  Info,
  MapPin,
  Shield,
  FileText,
  Users,
  ArrowLeft,
  Calculator,
  Check,
  X,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import "../styles/styles.css";

export default function Partnerview({ selectedPartner, setSelectedPartner ,fetchPartners}) {
  const [remarks, setRemarks] = useState("");
  const [currentAction, setCurrentAction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  if (!selectedPartner) return null;
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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
  const actionMap = {
    0: "Approve",
    2: "Reject",
    3: "Recheck"
  };

  const handleActionClick = (actionStatus) => {
    setCurrentAction(actionStatus);
    setRemarks(selectedPartner.remarks || "");
    setShowModal(true);
  };
  const submitAction = async () => {
    try {
      const payload = {
        partnerName: selectedPartner.partnerName,
        partnerType: selectedPartner.partnerType,
        actionStatus: Number(currentAction),
        checker: "checkerUser",
        remarks: remarks,
        metadata: {
          ipAddress: window.location.hostname,
          userAgent: navigator.userAgent,
          headers: "custom-headers-if-any",
          channel: "web",
          auditMetadata: {
            createdBy: "checkerUser",
            createdDate: new Date().toISOString(),
            modifiedBy: "checkerUser",
            modifiedDate: new Date().toISOString(),
            header: {
              additionalProp1: {
                options: { propertyNameCaseInsensitive: true },
                parent: "string",
                root: "string",
              },
            },
          },
        },
      };

      await axios.post(`${API_BASE_URL}/ps/approveDistributionPartner`, payload);
      alert("Action submitted successfully!");
      setShowModal(false);
      setRemarks("");
      fetchPartners();
    } catch (err) {
      console.error("Error submitting action:", err);
      alert("Failed to submit action");
      setShowModal(false);
    }
  };
  return (
    <div>
      {/* Header */}
      <div className="card-header mb-[20px]">
        <div className="card-header-left flex items-center gap-3">
          <button
            className="approval-back-button"
            onClick={() => setSelectedPartner(null)}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Approvals
          </button>
          <div className="header-icon-box">
            <Calculator className="text-[#00d4aa] w-4 h-4" />
          </div>
          <div>
            <h1 className="header-title">Partner Approvals</h1>
            <p className="header-subtext">
              Review and approve Partner configurations
            </p>
          </div>
        </div>
        <div className="card-header-right">
          <div className="portal-info flex gap-2">
            <p className="portal-link">
              <span
                className={`px-2 py-1 rounded text-[10px] ${selectedPartner.partnerType === "Aggregator"
                  ? "checker"
                  : selectedPartner.partnerType === "Retailer"
                    ? "infra"
                    : "superuser"
                  }`}
              >
                {selectedPartner.partnerType}
              </span>
            </p>
            <p className="portal-link">
              <span
                className={`px-2 py-1 rounded text-[10px] ${selectedPartner.status === 0
                  ? "checker"
                  : selectedPartner.status === 1
                    ? "infra"
                    : selectedPartner.status === 2
                      ? "superuser"
                      : "maker"
                  }`}
              >
                {getStatusLabel(selectedPartner.status)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Partner Overview */}
      <div className="partner-overview-card">
        <h2 className="partner-overview-title">
          <Info size={18} color="#14B8A6" className="partner-overview-icon" />{" "}
          Partner Overview
        </h2>
        <div className="partner-overview-content">
          <div className="partner-overview-section">
            <p>
              <span className="partner-overview-label">Partner Name</span>{" "}
              <br />
              <span className="partner-overview-bold">
                {selectedPartner.partnerName}
              </span>
            </p>
            <p>
              <span className="partner-overview-label">Partner Type</span>{" "}
              <br />
              <span className="partner-overview-bold">
                {selectedPartner.partnerType}
              </span>
            </p>
            <p>
              <span className="partner-overview-label">Status</span> <br />
              <span className="partner-overview-bold">
                {selectedPartner.partnerStatus}
              </span>
            </p>
          </div>

          <div className="partner-overview-section">
            <p>
              <span className="partner-overview-label">Contact Name</span>{" "}
              <br />
              <span className="partner-overview-bold">
                {selectedPartner.contactName}
              </span>
            </p>
            <p>
              <span className="partner-overview-label">Email</span> <br />
              <span className="partner-overview-icon-inline">
                <Mail size={16} className="partner-overview-icon" />
                <span className="partner-overview-bold">
                  {selectedPartner.contactEmail}
                </span>
              </span>
            </p>
            <p>
              <span className="partner-overview-label">Phone</span> <br />
              <span className="partner-overview-icon-inline">
                <Phone size={16} className="partner-overview-icon" />
                <span className="partner-overview-bold">
                  {selectedPartner.contactPhone}
                </span>
              </span>
            </p>
            <p>
              <span className="partner-overview-label">KYC Status</span> <br />
              <span className="partner-overview-bold">
                {selectedPartner.kycStatus}
              </span>
            </p>
          </div>

          <div className="partner-overview-section">
            <p>
              <span className="partner-overview-label">Onboarding Date</span>{" "}
              <br />
              <span className="partner-overview-bold">
                {new Date(selectedPartner.onboardingDate).toLocaleDateString()}
              </span>
            </p>
            <p>
              <span className="partner-overview-label">Portal Access</span>{" "}
              <br />
              <span className="partner-overview-bold">
                {selectedPartner.portalAccessEnabled ? "Yes" : "No"}
              </span>
            </p>
            <p>
              <span className="partner-overview-label">Support Tickets</span>{" "}
              <br />
              <span className="partner-overview-bold">
                {selectedPartner.supportTicketCount}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Address Info */}
      <div className="partner-overview-card partner-overview-secondary">
        <h2 className="partner-overview-title">
          <MapPin size={18} color="#14B8A6" className="partner-overview-icon" />{" "}
          Address Information
        </h2>
        <div className="partner-overview-content">
          <div className="partner-overview-section">
            <p>
              <span className="partner-overview-label">Address</span> <br />
              <span className="partner-overview-bold">
                <span className="partner-overview-bold">
                  {(() => {
                    try {
                      return JSON.parse(selectedPartner.address).address;
                    } catch {
                      return selectedPartner.address || "-";
                    }
                  })()}
                </span>
              </span>
            </p>
            <p>
              <span className="partner-overview-label">City</span> <br />
              <span className="partner-overview-bold">
                {selectedPartner.city || "-"}
              </span>
            </p>
            <p>
              <span className="partner-overview-label">State</span> <br />
              <span className="partner-overview-bold">
                {selectedPartner.state || "-"}
              </span>
            </p>
            <p>
              <span className="partner-overview-label">Pincode</span> <br />
              <span className="partner-overview-bold">
                {selectedPartner.pincode || "-"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Compliance & KYC */}
      <div className="partner-overview-card">
        <h2 className="partner-overview-title">
          <Shield size={18} color="#14B8A6" className="partner-overview-icon" />{" "}
          Compliance & KYC
        </h2>
        <div className="partner-overview-content">
          <div className="partner-overview-section">
            <p>
              <span className="partner-overview-label">KYC Level</span> <br />
              <span className="partner-overview-bold">
                {selectedPartner.kycLevel}
              </span>
            </p>
            <p>
              <span className="partner-overview-label">PAN Number</span> <br />
              <span className="partner-overview-bold">
                {selectedPartner.panNumber}
              </span>
            </p>
          </div>

          <div className="partner-overview-section">
            <p>
              <span className="partner-overview-label">Risk Profile</span> <br />
              <span className="partner-overview-bold">{selectedPartner.riskProfile}</span>
            </p>

            <p>
              <span className="partner-overview-label">TAN Number</span> <br />
              <span className="partner-overview-bold">
                {selectedPartner.tanNumber}
              </span>
            </p>
          </div>

          <div className="partner-overview-section">
            <p>
              <span className="partner-overview-label">KYC Status</span> <br />
              <span className="partner-overview-bold">
                {selectedPartner.kycStatus}
              </span>
            </p>
            <p>
              <span className="partner-overview-label">GSTIN</span> <br />
              <span className="partner-overview-bold">
                {selectedPartner.gstin}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="partner-overview-card partner-overview-secondary">
        <h2 className="partner-overview-title">
          <Users size={18} color="#14B8A6" className="partner-overview-icon" />{" "}
          Performance Metrics
        </h2>
        <div className="partner-overview-content">
          <div className="partner-overview-section">
            <p>
              <span className="partner-overview-label">Total Transactions</span>{" "}
              <br />
              <span
                className="partner-overview-bold"
                style={{ color: "#14b8a6" }}
              >
                {selectedPartner.totalTransactionsLastMonth}
              </span>
            </p>
          </div>

          <div className="partner-overview-section">
            <p>
              <span className="partner-overview-label">Total Sales</span> <br />
              <span
                className="partner-overview-bold"
                style={{ color: "#14b8a6" }}
              >
                ₹{selectedPartner.totalSalesLastMonth}
              </span>
            </p>
          </div>
        </div>
      </div>
      {/* Partner Review Actions */}

      <div className="product-actions mt-6">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-4 h-4 text-teal-400" />
          <h3 className="text-teal-400 text-[15px]">Partner Review Actions</h3>
        </div>
        <div className="button-group">
          <button
            className="btn approval-btn-blue"
            onClick={() => handleActionClick(3)}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Recheck Partner</span>
          </button>
          <div className="button-group-row flex gap-2 mt-2">
            <button
              className="btn approval-btn-green"
              onClick={() => handleActionClick(0)}
            >
              <Check className="w-4 h-4" />
              <span>Approve Partner</span>
            </button>

            <button
              className="btn approval-btn-red"
              onClick={() => handleActionClick(2)}
            >
              <X className="w-4 h-4" />
              <span>Reject Partner</span>
            </button>
          </div>
        </div>
        <p className="note text-gray-400 text-sm mt-2">
          Review all product details carefully before making a decision
        </p>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">
              {currentAction === 0 && "Confirm Partner Approval"}
              {currentAction === 2 && "Confirm Partner Rejection"}
              {currentAction === 3 && "Confirm Partner Recheck"}
            </h2>

            <p className="modal-subtext">
              Are you sure you want to{" "}
              {currentAction === 0
                ? "approve"
                : currentAction === 2
                  ? "reject"
                  : "recheck"}{" "}
              <b>{selectedPartner.partnerName}</b>? This action cannot be
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
                className={`btn-submit ${currentAction === 0 ? "btn-approve-green" : currentAction === 2 ? "btn-reject-red" : "btn-recheck-blue"}`}
                onClick={submitAction}
              >

                {currentAction === 0 && (
                  <>
                    <Check className="w-4 h-4" /> Approve Partner
                  </>
                )}
                {currentAction === 2 && (
                  <>
                    <X className="w-4 h-4" /> Reject Partner
                  </>
                )}
                {currentAction === 3 && (
                  <>
                    <RefreshCw className="w-4 h-4" /> Recheck Partner
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