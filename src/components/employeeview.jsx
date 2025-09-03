import React from "react";
import {
    User,
    Mail,
    Phone,
    Briefcase,
    Building2,
    FileText,
    IdCard,
    MapPin,
    FileCheck,
    RotateCcw,
    Check,
    X,
    RefreshCw, ArrowLeft
} from "lucide-react";

export default function EmployeeView({ selectedEmployee, setSelectedEmployee }) {
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
    return (
        <>
            <div className="card-header mb-6">

                <div className="card-header-left flex items-center gap-3">
                    <button class="approval-back-button" onClick={() => setSelectedEmployee(null)}>
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
                          className={`px-2 py-1 rounded text-[10px] ${selectedEmployee.status === 0 ? "checker" : selectedEmployee.status === 1 ? "infra" : selectedEmployee.status === 2 ? "superuser" : selectedEmployee.status === 3 ? "maker" : ""
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
                                <p className="value">John Smith</p>
                            </div>
                            <div className="info-block">
                                <p className="label">Designation</p>
                                <p className="value">Senior Software Developer</p>
                            </div>
                            <div className="info-block">
                                <p className="label">Role</p>
                                <p className="value">Development Lead</p>
                            </div>
                            <div className="info-block">
                                <p className="label">Department</p>
                                <p className="value">Technology</p>
                            </div>
                            <div className="info-block">
                                <p className="label">Email</p>
                                <p className="value">john.smith1@company.com</p>
                            </div>
                            <div className="info-block">
                                <p className="label">Phone</p>
                                <p className="value">+91 9876540001</p>
                            </div>
                            <div className="info-block">
                                <p className="label">Experience</p>
                                <p className="value">4 years</p>
                            </div>
                            <div className="info-block">
                                <p className="label">Education</p>
                                <p className="value">MBA Marketing</p>
                            </div>
                            <div className="info-block">
                                <p className="label">Previous Company</p>
                                <p className="value">Global Solutions Inc</p>
                            </div>
                            <div className="info-block">
                                <p className="label">Joining Date</p>
                                <p className="value">2024-03-02</p>
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
                        // onClick={() => handleActionClick(3)}
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>  Recheck User</span>
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
                    <div className="card cards">
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
                    </div>
                </div>
            </div>
        </>


    );
}
