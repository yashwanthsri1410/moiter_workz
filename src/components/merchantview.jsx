import React, { useEffect, useState } from "react";
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
  ShoppingCartIcon,
  CircleCheckBig,
} from "lucide-react";
import axios from "axios";
import "../styles/styles.css";
import customConfirm from "./reusable/CustomConfirm";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Subcomponent inside Merchantview (before the return statement)
function LocationPicker({ setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
}




export default function Merchantview({
  selectedMerchant,
  setSelectedMerchant,
  fetchMerchants,
}) {
  const [remarks, setRemarks] = useState("");
  const [currentAction, setCurrentAction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  if (!selectedMerchant) return null;
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const username = localStorage.getItem("username") || "guest";
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
    setRemarks(selectedMerchant.remarks || "");
    setShowModal(true);
  };
  const submitAction = async () => {
    const confirmAction = await customConfirm("Are you sure you want to continue?");
    if (!confirmAction) return;
    try {
      const payload = {
        merchantId: selectedMerchant.merchantId,
        shopName: selectedMerchant.shopName,
        logId: selectedMerchant.logId,
        actionStatus: Number(currentAction),
        checker: username,
        remarks: remarks,
        metadata: {
          ipAddress: window.location.hostname,
          userAgent: navigator.userAgent,
          headers: "custom-headers-if-any",
          channel: "web",
          auditMetadata: {
            createdBy: "Maker",
            createdDate: new Date().toISOString(),
            modifiedBy: username,
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
        `${API_BASE_URL}/ps/api/Product/approve-merchant`,
        payload
      );
      alert("Action submitted successfully!");
      setShowModal(false);
      setRemarks("");
      fetchMerchants();
    } catch (err) {
      console.error("Error submitting action:", err);
      alert("Failed to submit action");
      setShowModal(false);
    }
  };
  const [position, setPosition] = useState({
    lat: selectedMerchant?.latitude || 13.015842219623803,
    lng: selectedMerchant?.longitude || 80.20119845867158,
  });

  return (
    <div>
      {/* Header */}
      <div className="card-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-[20px]">
        {/* Left section */}
        <div className="card-header-left flex flex-wrap items-center gap-3">
          <button
            className="approval-back-button whitespace-nowrap flex items-center gap-1"
            onClick={() => setSelectedMerchant(null)}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Approvals
          </button>

          <div className="header-icon-box">
            <ShoppingCartIcon className="primary-color w-4 h-4" />
          </div>

          <div className="flex flex-col">
            <h1 className="header-title text-sm sm:text-base md:text-lg">
              Merchant Approvals
            </h1>
            <p className="header-subtext text-xs sm:text-sm md:text-base">
              Review and approve Merchant configurations
            </p>
          </div>
        </div>

        {/* Right section */}
        <div className="card-header-right flex flex-wrap gap-2 mt-2 sm:mt-0">
          <p className="portal-link">
            <span
              className={`px-2 py-1 rounded text-[10px] ${selectedMerchant.MerchantType === "Aggregator"
                ? "checker"
                : selectedMerchant.MerchantType === "Retailer"
                  ? "infra"
                  : "superuser"
                }`}
            >
              {selectedMerchant.category}
            </span>
          </p>
          <p className="portal-link">
            <span
              className={`px-2 py-1 rounded text-[10px] ${selectedMerchant.status === 0
                ? "checker"
                : selectedMerchant.status === 1
                  ? "infra"
                  : selectedMerchant.status === 2
                    ? "superuser"
                    : "maker"
                }`}
            >
              {getStatusLabel(selectedMerchant.status)}
            </span>
          </p>
        </div>
      </div>

      {/* Merchant Overview */}
      <div className="partner-overview-card p-4 bg-white rounded-lg shadow-md">
        <h2 className="partner-overview-title flex items-center text-lg sm:text-xl font-semibold text-gray-800 mb-4">
          <Info size={18} className="primary-color mr-2" />
          Merchant Overview
        </h2>

        <div className="partner-overview-content flex flex-col sm:flex-row sm:gap-6 gap-4">
          {/* Section 1 */}
          <div className="partner-overview-section flex-1 text-sm sm:text-base">
            <p>
              <span className="partner-overview-label font-medium">
                Merchant Name
              </span>{" "}
              <br />
              <span className="partner-overview-bold font-semibold">
                {selectedMerchant.shopName}
              </span>
            </p>
            <p>
              <span className="partner-overview-label font-medium">
                Merchant Type
              </span>{" "}
              <br />
              <span className="partner-overview-bold font-semibold">
                {selectedMerchant.category}
              </span>
            </p>
            <p>
              <span className="partner-overview-label font-medium">Status</span>{" "}
              <br />
              <span className="partner-overview-bold font-semibold">
                {getStatusLabel(selectedMerchant.status)}
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
                {selectedMerchant.contactName}
              </span>
            </p>
            <p>
              <span className="partner-overview-label font-medium">Email</span>{" "}
              <br />
              <span className="partner-overview-icon-inline flex items-center gap-1">
                <Mail size={16} className="partner-overview-icon" />
                <span className="partner-overview-bold font-semibold">
                  {selectedMerchant.contactEmail}
                </span>
              </span>
            </p>
            <p>
              <span className="partner-overview-label font-medium">Phone</span>{" "}
              <br />
              <span className="partner-overview-icon-inline flex items-center gap-1">
                <Phone size={16} className="partner-overview-icon" />
                <span className="partner-overview-bold font-semibold">
                  {selectedMerchant.mobileNumber}
                </span>
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
                {new Date(selectedMerchant.onboardingDate).toLocaleDateString()}
              </span>
            </p>
            <p>
              <span className="partner-overview-label font-medium">
                Portal Access
              </span>{" "}
              <br />
              <span className="partner-overview-bold font-semibold">
                {selectedMerchant.portalAccessEnabled ? "Yes" : "No"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Address Info */}
      <div className="partner-overview-card Merchant-overview-secondary">
        <h2 className="partner-overview-title">
          <MapPin size={18} className="primary-color" /> Address Information
        </h2>
        <div className="partner-overview-content">
          <div className="partner-overview-section">
            <p>
              <span className="partner-overview-label">Shop Name</span> <br />
              <span className="partner-overview-bold">
                {selectedMerchant.shopName || "-"}
              </span>
            </p>
            <p>
              <span className="partner-overview-label">Address</span> <br />
              <span className="partner-overview-bold">
                <span className="partner-overview-bold">
                  {(() => {
                    try {
                      return JSON.parse(selectedMerchant.fullAddress).fullAddress;
                    } catch {
                      return selectedMerchant.fullAddress || "-";
                    }
                  })()}
                </span>
              </span>
            </p>
            <p>
              <span className="partner-overview-label">City</span> <br />
              <span className="partner-overview-bold">
                {selectedMerchant.city || "-"}
              </span>
            </p>
            <p>
              <span className="partner-overview-label">State</span> <br />
              <span className="partner-overview-bold">
                {selectedMerchant.state || "-"}
              </span>
            </p>
            <p>
              <span className="partner-overview-label">Pincode</span> <br />
              <span className="partner-overview-bold">
                {selectedMerchant.pinCode || "-"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Location Map Section */}
      <div className="partner-overview-card mt-4">
        <h2 className="partner-overview-title flex items-center text-lg font-semibold mb-3">
          <MapPin size={18} className="primary-color mr-2" />
          Merchant Location Map
        </h2>

        <div className="w-full h-96 rounded-lg border border-gray-300 overflow-hidden">
          <MapContainer
            center={[position.lat, position.lng]}
            zoom={13}
            className="h-full w-full"
          >
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri"
            />
            <Marker position={position}>
              <Popup>
                <div style={{ fontFamily: 'inherit' }}>
                  <strong>{selectedMerchant.shopName}</strong>
                  <br />
                  <span>Lat: {position.lat.toFixed(5)}, Lng: {position.lng.toFixed(5)}</span>
                </div>
              </Popup>
            </Marker>
            <LocationPicker setPosition={setPosition} />
          </MapContainer>
        </div>

        {/* Selected Coordinates Display */}
        <div className="mt-3 partner-overview-card rounded-lg text-sm ">
          <p>
            <strong>Selected Coordinates:</strong> {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
          </p>
        </div>
      </div>

      {/* Payment Configuration */}
      <div className="partner-overview-card">
        <h2 className="partner-overview-title">
          <Shield size={18} className="primary-color" /> Payment Configuration
        </h2>
        <div className="partner-overview-content">
          <div className="partner-overview-section">
            <div>
              <span className="partner-overview-label">Payment Types</span> <br />

              <div className="flex gap-2 flex-wrap mb-2">
                {selectedMerchant?.paymentType
                  ?.split(",")
                  .map((type, idx) => {
                    const formattedType = type
                      .trim()
                      .replace(/[_-]/g, " ")
                      .split(" ")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                      )
                      .join(" ");

                    return (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-800 rounded text-[10px] sm:text-xs primary-color"
                      >
                        {formattedType}
                      </span>
                    );
                  })}
              </div>

            </div>
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
                {selectedMerchant.kycType}
              </span>
            </p>
            <p>
              <span className="partner-overview-label">Merchant Discount Rate (MDR) </span> <br />
              <span className="partner-overview-bold">
                {selectedMerchant.mdrMode} - {selectedMerchant.mdrValue}
              </span>
            </p>

          </div>

          <div className="partner-overview-section">
            <p>
              <span className="partner-overview-label">GST Number</span> <br />
              <span className="partner-overview-bold">
                {selectedMerchant.gstNumber}
              </span>
            </p>
          </div>
        </div>
      </div>
      {/*  Media & Documents */}
      <div className="partner-overview-card">
        <h2 className="partner-overview-title">
          <FileText size={18} className="primary-color" /> Media & Documents
        </h2>
        <div className="partner-overview-content grid grid-cols-3 gap-4">
          {/* Agreement Document */}
          <div className="partner-overview-section text-center flex flex-col items-center">
            <p className="partner-overview-label">Agreement Document</p>
            {selectedMerchant.agreementCopy ? (
              <img
                src={`data:image/png;base64,${selectedMerchant.agreementCopy}`}
                alt="Agreement Document"
                className="partner-overview-img cursor-pointer"
                onClick={() =>
                  setModalImage(
                    `data:image/png;base64,${selectedMerchant.agreementCopy}`
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
            {selectedMerchant.idProof ? (
              <img
                src={`data:image/png;base64,${selectedMerchant.idProof}`}
                alt="ID Proof Document"
                className="partner-overview-img cursor-pointer"
                onClick={() =>
                  setModalImage(
                    `data:image/png;base64,${selectedMerchant.idProof}`
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
            {selectedMerchant.addressProof ? (
              <img
                src={`data:image/png;base64,${selectedMerchant.addressProof}`}
                alt="Address Proof Document"
                className="partner-overview-img cursor-pointer"
                onClick={() =>
                  setModalImage(
                    `data:image/png;base64,${selectedMerchant.addressProof}`
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

      {/* Merchant Review Actions */}
      <div className="product-actions mt-6">
        {/* Header */}
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-4 h-4 primary-color" />
          <h3 className="primary-color text-[13px] sm:text-[15px]">
            Merchant Review Actions
          </h3>
        </div>

        {/* Buttons */}
        <div className="button-group flex flex-col sm:flex-row sm:items-center sm:space-x-2 gap-2">
          <button
            className="btn approval-btn-blue sm:w-auto"
            onClick={() => handleActionClick(3)}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Recheck Merchant</span>
          </button>

          <div className="button-group-row flex flex-col sm:flex-row gap-2 mt-2">
            <button
              className="btn approval-btn-green w-full sm:w-auto"
              onClick={() => handleActionClick(0)}
            >
              <Check className="w-4 h-4" />
              <span>Approve Merchant</span>
            </button>

            <button
              className="btn approval-btn-red w-full sm:w-auto"
              onClick={() => handleActionClick(2)}
            >
              <X className="w-4 h-4" />
              <span>Reject Merchant</span>
            </button>
          </div>
        </div>

        {/* Note */}
        <p className="note text-gray-400 text-[12px] sm:text-sm mt-2 text-center sm:text-left">
          Review all Merchant details carefully before making a decision
        </p>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">
              {currentAction === 0 && "Confirm Merchant Approval"}
              {currentAction === 2 && "Confirm Merchant Rejection"}
              {currentAction === 3 && "Confirm Merchant Recheck"}
            </h2>

            <p className="modal-subtext">
              Are you sure you want to{" "}
              {currentAction === 0
                ? "approve"
                : currentAction === 2
                  ? "reject"
                  : "recheck"}{" "}
              <b>{selectedMerchant.MerchantName}</b>? This action cannot be
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
                    <Check className="w-4 h-4" /> Approve Merchant
                  </>
                )}
                {currentAction === 2 && (
                  <>
                    <X className="w-4 h-4" /> Reject Merchant
                  </>
                )}
                {currentAction === 3 && (
                  <>
                    <RefreshCw className="w-4 h-4" /> Recheck Merchant
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
