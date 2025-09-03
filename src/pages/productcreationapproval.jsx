import React, { useEffect, useState } from "react";
import axios from "axios";
import usePublicIp from "../hooks/usePublicIp";
import "../styles/commonForm.css";

export default function ProductConfigurationApproval() {
  const [pendingConfigs, setPendingConfigs] = useState([]);
  const [actionMap, setActionMap] = useState({});
  const [remarkMap, setRemarkMap] = useState({});
  const [expandedProductId, setExpandedProductId] = useState(null);
  const ip = usePublicIp();
  const username = localStorage.getItem("username") || "system";

  useEffect(() => {
    fetchPendingConfigs();
  }, []);

  const fetchPendingConfigs = async () => {
    try {
      const res = await axios.get("http://192.168.22.247:7090/api/Export/product_Config_export");
      const pendingOnly = res.data?.filter(item => [1, 3].includes(item.status)) || [];
      setPendingConfigs(pendingOnly);

      const initialRemarks = {};
      pendingOnly.forEach(item => {
        if (item.remarks) {
          initialRemarks[item.productId] = item.remarks;
        }
      });
      setRemarkMap(initialRemarks);
    } catch (err) {
      console.error("Failed to fetch configs", err);
      alert("Error loading product configurations");
    }
  };

  const handleActionChange = (id, action) => {
    setActionMap(prev => ({ ...prev, [id]: action }));
    if (action !== "Remarks") {
      // clear remark if not Remarks
      setRemarkMap(prev => ({ ...prev, [id]: "" }));
    } else {
      const existing = pendingConfigs.find(item => item.productId === id);
      if (existing?.remarks) {
        setRemarkMap(prev => ({ ...prev, [id]: existing.remarks }));
      }
    }
  };

  const handleSubmit = async (config) => {
    const action = actionMap[config.productId];
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
      productId: config.productId,
      actionStatus: statusCodeMap[action],
      checker: username,
      remarks: remarkMap[config.productId] || "",
    };

    try {
      await axios.post("http://192.168.22.247/ps/approveProductConfiguration", payload);
      alert(`✅ Product "${config.productName}" ${action}`);
      fetchPendingConfigs(); // reload list
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

  const renderDetailsRow = (config) => {
    const excludeKeys = ["productId", "productName", "programType", "subCategory", "status", "remarks"];
    return (
      <tr>
        <td colSpan={7} className="px-4 py-4 bg-gray-900 text-white">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {Object.entries(config)
              .filter(([key]) => !excludeKeys.includes(key))
              .map(([key, val]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
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

        <h2 className="form-heading">🛠️ Product Configuration Approval</h2>

        {pendingConfigs.length === 0 ? (
          <p className="no-data">No pending configurations.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg">
            <table className="product-table">
              <thead>
                <tr>
                  <th className="px-4 py-3">Product ID</th>
                  <th className="px-4 py-3">Name (click for details)</th>
                  <th className="px-4 py-3">Program Type</th>
                  <th className="px-4 py-3">Sub Category</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Remarks</th>
                  <th className="px-4 py-3">Submit</th>
                </tr>
              </thead>
              <tbody>
                {pendingConfigs.map((config) => {
                  const selectedAction = actionMap[config.productId];
                  const currentRemark = remarkMap[config.productId] || "";
                  return (
                    <React.Fragment key={config.productId}>
                      <tr>
                        <td className="px-4 py-3">{config.productId}</td>
                        <td
                          className="cursor-pointer text-blue-300 underline"
                          onClick={() =>
                            setExpandedProductId(
                              expandedProductId === config.productId ? null : config.productId
                            )
                          }
                        >
                          {config.productName}
                        </td>
                        <td className="px-4 py-3">{config.programType}</td>
                        <td className="px-4 py-3">{config.subCategory}</td>
                        <td className="px-4 py-3">
                          <select
                            className="nested-form-input"
                            value={selectedAction || ""}
                            onChange={(e) => handleActionChange(config.productId, e.target.value)}
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
                                  [config.productId]: e.target.value,
                                }))
                              }
                            />
                          ) : (
                            currentRemark || "-"
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleSubmit(config)}
                            className="btn-green"
                          >
                            Submit
                          </button>
                        </td>
                      </tr>
                      {expandedProductId === config.productId && renderDetailsRow(config)}
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
