import React, { useState } from "react";
import { FileText, Check, X, RefreshCw, ArrowLeft } from "lucide-react";
import axios from "axios";
export default function EmployeeView({
  selectedEmployee,
  setSelectedEmployee,
}) {
  const [remarks, setRemarks] = useState("");
  const [currentAction, setCurrentAction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  if (!selectedEmployee) return null;
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
  const handleActionClick = (actionStatus) => {
    setCurrentAction(actionStatus);
    setRemarks(selectedEmployee.remarks || "");
    setShowModal(true);
  };
  const submitAction = async () => {
    try {
      const payload = {
        name: selectedEmployee.userName, // from selectedEmployee
        checker: "checkerUser", // replace with logged-in user if available
        actionStatus: currentAction, // 0 = Approved, 2 = Rejected, 3 = Recheck
        remarks: remarks,
        metadata: {
          ipAddress: window.location.hostname,
          userAgent: navigator.userAgent,
          headers: JSON.stringify({}), // optional, can pass request headers if available
          channel: "web",
          auditMetadata: {
            createdBy: "checkerUser",
            createdDate: new Date().toISOString(),
            modifiedBy: "checkerUser",
            modifiedDate: new Date().toISOString(),
            header: {},
          },
        },
      };

      await axios.post(
        `${API_BASE_URL}/ums/api/UserManagement/ApproveEmployee`,
        payload
      );

      alert("Employee action submitted successfully!");
      setShowModal(false);
      setRemarks("");
    } catch (err) {
      console.error("Error submitting employee action:", err);
      alert("Failed to submit employee action");
      setShowModal(false);
    }
  };
  // console.log(selectedEmployee)
  return (
    <>
      <div className="card-header mb-6">
        <div className="card-header-left flex items-center gap-3">
          <button
            className="approval-back-button"
            onClick={() => setSelectedEmployee(null)}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Approvals
          </button>
          <div className="header-icon-box">
            <FileText className="text-[#00d4aa] w-4 h-4" />
          </div>
          <div>
            <h1 className="header-title">Employee Approvals</h1>
            <p className="header-subtext">
              Review and approve Employee configurations
            </p>
          </div>
        </div>
        <div className="card-header-right">
          <div className="portal-info flex gap-2">
            <p className="portal-link">
              <span
                className={`px-2 py-1 rounded text-[10px] ${
                  selectedEmployee.status === 0
                    ? "checker"
                    : selectedEmployee.status === 1
                    ? "infra"
                    : selectedEmployee.status === 2
                    ? "superuser"
                    : selectedEmployee.status === 3
                    ? "maker"
                    : ""
                }`}
              >
                {getStatusLabel(selectedEmployee.status)}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Left Column */}
        <div className="left">
          {/* Personal Info */}
          <div className="card">
            <div className="section-header">
              <h4 className="section-title">Personal Information</h4>
            </div>
            <div className="info-grid">
              <div className="info-block">
                <p className="label">Full Name</p>
                <p className="value">{selectedEmployee?.userName}</p>
              </div>
              <div className="info-block">
                <p className="label">Designation</p>
                <p className="value">{selectedEmployee?.designationDesc}</p>
              </div>
              <div className="info-block">
                <p className="label">Role</p>
                <p className="value">{selectedEmployee?.roleDescription}</p>
              </div>
              <div className="info-block">
                <p className="label">Department</p>
                <p className="value">{selectedEmployee?.deptName}</p>
              </div>
              <div className="info-block">
                <p className="label">Email</p>
                <p className="value">{selectedEmployee?.email}</p>
              </div>
              <div className="info-block">
                <p className="label">Remarks</p>
                <p className="value">{selectedEmployee?.remarks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right">
          {/* Actions */}
          <div className="card">
            <h4 className="up-section-title">
              <RefreshCw size={18} color="#00e6c3" className="refresh-icon" />
              User Review Actions
            </h4>

            <div className="button-group">
              <button
                className="btn approval-btn-blue"
                onClick={() => handleActionClick(3)}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Recheck User</span>
              </button>
              <div className="button-group-row flex gap-2 mt-2">
                <button
                  className="btn approval-btn-green"
                  onClick={() => handleActionClick(0)}
                >
                  <Check className="w-4 h-4" />
                  <span>Approve user</span>
                </button>

                <button
                  className="btn approval-btn-red"
                  onClick={() => handleActionClick(2)}
                >
                  <X className="w-4 h-4" />
                  <span>Reject user</span>
                </button>
              </div>
            </div>

            <div className="note-box">
              <p className="up-note">
                Review all user details carefully before making a decision
              </p>
            </div>
          </div>

          {/* Submission Details */}
          {/* <div className="card cards">
                        <h4 className="section-title-sub">Submission Details</h4>
                        <div className="info-block">
                            <p className="label">Submitted By</p>
                            <p className="value">HR Department</p>
                        </div>
                        <div className="info-block">
                            <p className="label">Submitted Time</p>
                            <p className="value">1 hours ago</p>
                        </div>
                        <div className="info-block">
                            <p className="label">Application ID</p>
                            <p className="value">USER-001</p>
                        </div>
                    </div> */}
        </div>
        {/* Remarks Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-container">
              <h2 className="modal-title">
                {currentAction === 0 && "Confirm Employee Approval"}
                {currentAction === 2 && "Confirm Employee Rejection"}
                {currentAction === 3 && "Confirm Employee Recheck"}
              </h2>

              <p className="modal-subtext">
                Are you sure you want to{" "}
                {currentAction === 0
                  ? "approve"
                  : currentAction === 2
                  ? "reject"
                  : "recheck"}{" "}
                <b>{selectedEmployee.EmployeeName}</b>? This action cannot be
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
                      <Check className="w-4 h-4" /> Approve Employee
                    </>
                  )}
                  {currentAction === 2 && (
                    <>
                      <X className="w-4 h-4" /> Reject Employee
                    </>
                  )}
                  {currentAction === 3 && (
                    <>
                      <RefreshCw className="w-4 h-4" /> Recheck Employee
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}