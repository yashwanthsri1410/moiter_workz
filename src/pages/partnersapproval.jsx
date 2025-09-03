import React, { useEffect, useState } from "react";
import axios from "axios";
import usePublicIp from "../hooks/usePublicIp";
import "../styles/commonForm.css";

export default function PartnersApproval() {
    const [pendingPartners, setPendingPartners] = useState([]);
    const [actionMap, setActionMap] = useState({});
    const [remarkMap, setRemarkMap] = useState({});
    const [expandedPartnerName, setExpandedPartnerName] = useState(null);
    const ip = usePublicIp();
    const username = localStorage.getItem("username") || "system";

    useEffect(() => {
        fetchPendingPartners();
    }, []);

    const fetchPendingPartners = async () => {
        try {
            const res = await axios.get("http://192.168.22.247:7090/api/Export/partner_summary_export");
            const pendingOnly = res.data?.filter(item => [1, 3].includes(item.status)) || [];
            setPendingPartners(pendingOnly);

            const initialRemarks = {};
            pendingOnly.forEach(item => {
                if (item.remarks) {
                    initialRemarks[item.partnerName] = item.remarks;
                }
            });
            setRemarkMap(initialRemarks);
        } catch (err) {
            console.error("Failed to fetch partners", err);
            alert("Error loading partner data");
        }
    };

    const handleActionChange = (partnerName, action) => {
        setActionMap(prev => ({ ...prev, [partnerName]: action }));
        if (action !== "Remarks") {
            setRemarkMap(prev => ({ ...prev, [partnerName]: "" }));
        } else {
            const existing = pendingPartners.find(item => item.partnerName === partnerName);
            if (existing?.remarks) {
                setRemarkMap(prev => ({ ...prev, [partnerName]: existing.remarks }));
            }
        }
    };

    const handleSubmit = async (partner) => {
  const action = actionMap[partner.partnerName];
  if (!action) {
    alert("Please select an action");
    return;
  }

  const statusCodeMap = {
    "Approved": 0,
    "Disapproved": 2,
    "Remarks": 3,
  };

  const payload = {
    partnerName: partner.partnerName,
    partnerType: partner.partnerType,
    actionStatus: statusCodeMap[action],
    checker: username,
    remarks: remarkMap[partner.partnerName] || "",
  };

  try {
    await axios.post("http://192.168.22.247/ps/approveDistributionPartner", payload);
    alert(`✅ Partner "${partner.partnerName}" ${action}`);
    fetchPendingPartners(); // refresh
  } catch (err) {
    console.error("Approval failed:", err);
    alert("❌ Failed to submit");
  }
};


    const formatValue = (val) => {
        if (typeof val === "boolean") return val ? "Yes" : "No";
        if (Array.isArray(val)) return val.length ? val.join(", ") : "None";
        if (typeof val === "object" && val !== null) return JSON.stringify(val);
        return val ?? "N/A";
    };

    const renderDetailsRow = (partner) => {
        const excludeKeys = ["partnerName", "partnerType", "status", "remarks"];
        return (
            <tr>
                <td colSpan={7} className="px-4 py-4 bg-gray-900 text-white">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        {Object.entries(partner)
                            .filter(([key]) => !excludeKeys.includes(key))
                            .map(([key, val]) => (
                                <div key={key} className="flex flex-col">
                                    <span className="text-gray-400 capitalize">
                                        {key.replace(/([A-Z])/g, " $1")}
                                    </span>
                                    <span className="text-white font-medium">{formatValue(val)}</span>
                                </div>
                            ))}
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="page-container">
            <div className="product-container">
                {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => {
                    const isRight = pos.includes("right-0");
                    return (
                        <div
                            key={i}
                            className={`glow-corner ${pos} ${isRight ? "glow-corner-right" : "glow-corner-left"}`}
                        />
                    );
                })}

                <h2 className="form-heading">👥 Partner Approval Dashboard</h2>

                {pendingPartners.length === 0 ? (
                    <p className="no-data">No pending partner approvals.</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg">
                        <table className="product-table">
                            <thead>
                                <tr>
                                    <th className="px-4 py-3">Partner Name</th>
                                    <th className="px-4 py-3">Partner Type</th>
                                    <th className="px-4 py-3">KYC Status</th>
                                    <th className="px-4 py-3">Risk</th>
                                    <th className="px-4 py-3">Action</th>
                                    <th className="px-4 py-3">Remarks</th>
                                    <th className="px-4 py-3">Submit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingPartners.map((partner) => {
                                    const selectedAction = actionMap[partner.partnerName];
                                    const currentRemark = remarkMap[partner.partnerName] || "";
                                    return (
                                        <React.Fragment key={partner.partnerName}>
                                            <tr>
                                                <td
                                                    className="cursor-pointer text-blue-300 underline"
                                                    onClick={() =>
                                                        setExpandedPartnerName(
                                                            expandedPartnerName === partner.partnerName ? null : partner.partnerName
                                                        )
                                                    }
                                                >
                                                    {partner.partnerName}
                                                </td>
                                                <td className="px-4 py-3">{partner.partnerType}</td>
                                                <td className="px-4 py-3">{partner.kycStatus}</td>
                                                <td className="px-4 py-3">{partner.riskProfile}</td>
                                                <td className="px-4 py-3">
                                                    <select
                                                        className="nested-form-input"
                                                        value={selectedAction || ""}
                                                        onChange={(e) =>
                                                            handleActionChange(partner.partnerName, e.target.value)
                                                        }
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="Approved">✅ Approve</option>
                                                        <option value="Disapproved">❌ Disapprove</option>
                                                        <option value="Remarks">📝 Remarks</option>
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {selectedAction === "Remarks" ? (
                                                        <input
                                                            type="text"
                                                            placeholder="Enter remarks..."
                                                            className="nested-form-input"
                                                            value={currentRemark}
                                                            onChange={(e) =>
                                                                setRemarkMap((prev) => ({
                                                                    ...prev,
                                                                    [partner.partnerName]: e.target.value,
                                                                }))
                                                            }
                                                        />
                                                    ) : (
                                                        currentRemark || "-"
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => handleSubmit(partner)}
                                                        className="btn-green"
                                                    >
                                                        Submit
                                                    </button>
                                                </td>
                                            </tr>
                                            {expandedPartnerName === partner.partnerName && renderDetailsRow(partner)}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
