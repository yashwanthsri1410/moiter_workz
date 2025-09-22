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

export default function Partnerview({
  selectedPartner,
  setSelectedPartner,
  fetchPartners,
}) {
  const [remarks, setRemarks] = useState("");
  const [currentAction, setCurrentAction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);
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
    3: "Recheck",
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
        logId: selectedPartner.logId,
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

      await axios.post(
        `${API_BASE_URL}/ps/approveDistributionPartner`,
        payload
      );
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
      <div className="card-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-[20px]">
        {/* Left section */}
        <div className="card-header-left flex flex-wrap items-center gap-3">
          <button
            className="approval-back-button whitespace-nowrap flex items-center gap-1"
            onClick={() => setSelectedPartner(null)}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Approvals
          </button>

          <div className="header-icon-box">
            <Calculator className="primary-color w-4 h-4" />
          </div>

          <div className="flex flex-col">
            <h1 className="header-title text-sm sm:text-base md:text-lg">
              Partner Approvals
            </h1>
            <p className="header-subtext text-xs sm:text-sm md:text-base">
              Review and approve Partner configurations
            </p>
          </div>
        </div>

        {/* Right section */}
        <div className="card-header-right flex flex-wrap gap-2 mt-2 sm:mt-0">
          <p className="portal-link">
            <span
              className={`px-2 py-1 rounded text-[10px] ${
                selectedPartner.partnerType === "Aggregator"
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
              className={`px-2 py-1 rounded text-[10px] ${
                selectedPartner.status === 0
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

      {/* Partner Overview */}
      <div className="partner-overview-card p-4 bg-white rounded-lg shadow-md">
        <h2 className="partner-overview-title flex items-center text-lg sm:text-xl font-semibold text-gray-800 mb-4">
          <Info size={18} className="primary-color mr-2" />
          Partner Overview
        </h2>

        <div className="partner-overview-content flex flex-col sm:flex-row sm:gap-6 gap-4">
          {/* Section 1 */}
          <div className="partner-overview-section flex-1 text-sm sm:text-base">
            <p>
              <span className="partner-overview-label font-medium">
                Partner Name
              </span>{" "}
              <br />
              <span className="partner-overview-bold font-semibold">
                {selectedPartner.partnerName}
              </span>
            </p>
            <p>
              <span className="partner-overview-label font-medium">
                Partner Type
              </span>{" "}
              <br />
              <span className="partner-overview-bold font-semibold">
                {selectedPartner.partnerType}
              </span>
            </p>
            <p>
              <span className="partner-overview-label font-medium">Status</span>{" "}
              <br />
              <span className="partner-overview-bold font-semibold">
                {selectedPartner.partnerStatus}
              </span>
            </p>
          </div>

          {/* Section 2 */}
          <div className="partner-overview-section flex-1 text-sm sm:text-base">
            <p>
              <span className="partner-overview-label font-medium">
                Contact Name
              </span>{" "}
              <br />
              <span className="partner-overview-bold font-semibold">
                {selectedPartner.contactName}
              </span>
            </p>
            <p>
              <span className="partner-overview-label font-medium">Email</span>{" "}
              <br />
              <span className="partner-overview-icon-inline flex items-center gap-1">
                <Mail size={16} className="partner-overview-icon" />
                <span className="partner-overview-bold font-semibold">
                  {selectedPartner.contactEmail}
                </span>
              </span>
            </p>
            <p>
              <span className="partner-overview-label font-medium">Phone</span>{" "}
              <br />
              <span className="partner-overview-icon-inline flex items-center gap-1">
                <Phone size={16} className="partner-overview-icon" />
                <span className="partner-overview-bold font-semibold">
                  {selectedPartner.contactPhone}
                </span>
              </span>
            </p>
            <p>
              <span className="partner-overview-label font-medium">
                KYC Status
              </span>{" "}
              <br />
              <span className="partner-overview-bold font-semibold">
                {selectedPartner.kycStatus}
              </span>
            </p>
          </div>

          {/* Section 3 */}
          <div className="partner-overview-section flex-1 text-sm sm:text-base">
            <p>
              <span className="partner-overview-label font-medium">
                Onboarding Date
              </span>{" "}
              <br />
              <span className="partner-overview-bold font-semibold">
                {new Date(selectedPartner.onboardingDate).toLocaleDateString()}
              </span>
            </p>
            <p>
              <span className="partner-overview-label font-medium">
                Portal Access
              </span>{" "}
              <br />
              <span className="partner-overview-bold font-semibold">
                {selectedPartner.portalAccessEnabled ? "Yes" : "No"}
              </span>
            </p>
            <p>
              <span className="partner-overview-label font-medium">
                Support Tickets
              </span>{" "}
              <br />
              <span className="partner-overview-bold font-semibold">
                {selectedPartner.supportTicketCount}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Address Info */}
      <div className="partner-overview-card partner-overview-secondary">
        <h2 className="partner-overview-title">
          <MapPin size={18} className="primary-color" /> Address Information
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
          <Shield size={18} className="primary-color" /> Compliance & KYC
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
              <span className="partner-overview-label">Risk Profile</span>{" "}
              <br />
              <span className="partner-overview-bold">
                {selectedPartner.riskProfile}
              </span>
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

      <div className="partner-overview-card">
        <h2 className="partner-overview-title">
          <FileText size={18} className="primary-color" /> Media & Documents
        </h2>
        <div className="partner-overview-content grid grid-cols-3 gap-4">
          {/* Agreement Document */}
          <div className="partner-overview-section text-center flex flex-col items-center">
            <p className="partner-overview-label">Agreement Document</p>
            {selectedPartner.agreementDocument ? (
              <img
                src={`data:image/png;base64,${selectedPartner.agreementDocument}`}
                alt="Agreement Document"
                className="partner-overview-img cursor-pointer"
                onClick={() =>
                  setModalImage(
                    `data:image/png;base64,${selectedPartner.agreementDocument}`
                  )
                }
              />
            ) : (
              <p className="text-gray-400 text-sm">No document uploaded</p>
            )}
          </div>

          {/* ID Proof Document */}
          <div className="partner-overview-section text-center flex flex-col items-center">
            <p className="partner-overview-label">ID Proof Document</p>
            {selectedPartner.idProofDocument ? (
              <img
                src={`data:image/png;base64,${selectedPartner.idProofDocument}`}
                alt="ID Proof Document"
                className="partner-overview-img cursor-pointer"
                onClick={() =>
                  setModalImage(
                    `data:image/png;base64,${selectedPartner.idProofDocument}`
                  )
                }
              />
            ) : (
              <p className="text-gray-400 text-sm">No document uploaded</p>
            )}
          </div>

          {/* Address Proof Document */}
          <div className="partner-overview-section text-center flex flex-col items-center">
            <p className="partner-overview-label">Address Proof Document</p>
            {selectedPartner.addressProofDocument ? (
              <img
                src={`data:image/png;base64,${selectedPartner.addressProofDocument}`}
                alt="Address Proof Document"
                className="partner-overview-img cursor-pointer"
                onClick={() =>
                  setModalImage(
                    `data:image/png;base64,${selectedPartner.addressProofDocument}`
                  )
                }
              />
            ) : (
              <p className="text-gray-400 text-sm">No document uploaded</p>
            )}
          </div>
        </div>

        {/* Zoom Modal */}
        {modalImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setModalImage(null)}
          >
            <img
              src={modalImage}
              alt="Zoomed Document"
              className="max-w-full max-h-full"
            />
          </div>
        )}
      </div>

      {/* Partner Review Actions */}
      <div className="product-actions mt-6">
        {/* Header */}
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-4 h-4 primary-color" />
          <h3 className="primary-color text-[13px] sm:text-[15px]">
            Partner Review Actions
          </h3>
        </div>

        {/* Buttons */}
        <div className="button-group flex flex-col sm:flex-row sm:items-center sm:space-x-2 gap-2">
          <button
            className="btn approval-btn-blue sm:w-auto"
            onClick={() => handleActionClick(3)}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Recheck Partner</span>
          </button>

          <div className="button-group-row flex flex-col sm:flex-row gap-2 mt-2">
            <button
              className="btn approval-btn-green w-full sm:w-auto"
              onClick={() => handleActionClick(0)}
            >
              <Check className="w-4 h-4" />
              <span>Approve Partner</span>
            </button>

            <button
              className="btn approval-btn-red w-full sm:w-auto"
              onClick={() => handleActionClick(2)}
            >
              <X className="w-4 h-4" />
              <span>Reject Partner</span>
            </button>
          </div>
        </div>

        {/* Note */}
        <p className="note text-gray-400 text-[12px] sm:text-sm mt-2 text-center sm:text-left">
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
                className={`btn-submit ${
                  currentAction === 0
                    ? "btn-approve-green"
                    : currentAction === 2
                    ? "btn-reject-red"
                    : "btn-recheck-blue"
                }`}
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
