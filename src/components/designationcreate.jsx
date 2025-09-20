import React, { useEffect, useState } from "react";
import axios from "axios";
import usePublicIp from "../hooks/usePublicIp";
import {
  ArrowLeft,
  Building2,
  Pencil,
  Search,
  Plus,
  Badge,
  X,
} from "lucide-react";

export default function CreateDesignationForm({ onBack }) {
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [designationDesc, setDesignationDesc] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [headersError, setHeadersError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const ip = usePublicIp();
  const username = localStorage.getItem("username") || "guest";

  // Function to validate input - allows only letters, spaces, and hyphens
  const validateInput = (input) => {
    // Regular expression to allow only letters, spaces, and hyphens
    const regex = /^[a-zA-Z\s-]*$/;
    return regex.test(input);
  };

  useEffect(() => {
    fetchDepartments();
    fetchDesignations();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/fes/api/Export/simple-departments`
      );
      setDepartments(res.data || []);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    }
  };

  const fetchDesignations = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/fes/api/Export/designations`
      );
      setDesignations(res.data || []);
    } catch (err) {
      console.error("Failed to fetch designations:", err);
    }
  };

  // Handle designation description input change with validation
  const handleDesignationDescChange = (e) => {
    const value = e.target.value;
    if (validateInput(value)) {
      setDesignationDesc(value);
    }
  };

  // Handle edit text input change with validation
  const handleEditTextChange = (e) => {
    const value = e.target.value;
    if (validateInput(value)) {
      setEditText(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDeptId || !designationDesc.trim()) {
      return alert("Please select department and enter designation");
    }

    const now = new Date().toISOString();
    const payload = {
      deptName: selectedDeptId,
      designationName: designationDesc.trim(),
      metadata: {
        ipAddress: ip,
        userAgent: navigator.userAgent,
        headers:
          headersError ||
          JSON.stringify({ "content-type": "application/json" }),
        channel: "web",
        auditMetadata: {
          createdBy: username,
          createdDate: now,
          modifiedBy: username,
          modifiedDate: now,
        },
      },
    };

    try {
      await axios.post(
        `${API_BASE_URL}/ums/api/UserManagement/designation_create`,
        payload
      );
      setDesignationDesc("");
      fetchDesignations();
      setShowForm(false);
    } catch (err) {
      console.error("Error creating designation:", err);
      alert("Creation failed");
    }
  };

  const handleEditInline = (desig) => {
    setEditId(desig.designationId);
    setEditText(desig.designationDesc);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  const handleSaveEdit = async (designationId) => {
    if (!editText.trim()) return alert("Designation cannot be empty");

    const now = new Date().toISOString();
    const payload = {
      designationId,
      newDescription: editText.trim(),
      metadata: {
        ipAddress: ip,
        userAgent: navigator.userAgent,
        headers:
          headersError ||
          JSON.stringify({ "content-type": "application/json" }),
        channel: "web",
        auditMetadata: {
          createdBy: username,
          createdDate: now,
          modifiedBy: username,
          modifiedDate: now,
        },
      },
    };

    try {
      await axios.put(
        `${API_BASE_URL}/ums/api/UserManagement/designation_update`,
        payload
      );
      handleCancelEdit();
      fetchDesignations();
    } catch (err) {
      console.error("Error updating designation:", err);
      setHeadersError("Error updating designation:" + err);
      alert("Update failed");
    }
  };

  // Grouped with filtering
  const groupedDesignations = departments.reduce((acc, dept) => {
    const deptDesignations = designations.filter(
      (d) =>
        d.deptId === dept.deptId &&
        (dept.deptName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.designationDesc.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    if (deptDesignations.length > 0) {
      acc.push({
        deptName: dept.deptName,
        designations: deptDesignations,
      });
    }
    return acc;
  }, []);

  return (
    <div className="department-page">
      {/* Header */}
      <div className="form-header">
        <div className="back-title">
          <div className="header-left">
            <div className="flex items-center gap-[10px]">
              <button className="header-icon-btn" onClick={onBack}>
                <ArrowLeft className="primary-color w-4 h-4" />
              </button>

              <div className="header-icon-box">
                <Badge className="primary-color w-4 h-4" />
              </div>
            </div>
            <div>
              <h1 className="header-title"> Designation Management</h1>
              <p className="header-subtext">
                {" "}
                Create and manage designations under departments
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Active count */}
            <button className="btn-count">
              <span className="w-2 h-2 rounded-full bg-[#04CF6A]  plus"></span>
              {designations.length} Active Designations
            </button>
          </div>
        </div>
        <div className="search-toggle">
          {/* Search */}
          <div className="search-box">
            <Search className="absolute left-3 top-2 text-gray-400 w-3 h-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search designations..."
              className="search-input"
            />
          </div>
          {/* Toggle form */}
          <button onClick={() => setShowForm(!showForm)} className="btn-toggle">
            {showForm ? (
              <>
                <X className="w-3 h-3" /> Close Form
              </>
            ) : (
              <>
                <Plus className="w-3 h-3" /> Create Department
              </>
            )}
          </button>
        </div>
      </div>
      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="department-form">
          <h2 className="form-title">Create New Designation</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Select Department</label>
              <select
                value={selectedDeptId}
                onChange={(e) => setSelectedDeptId(e.target.value)}
                className="form-input"
              >
                <option value="">-- Select Department --</option>
                {departments.map((dept) => (
                  <option key={dept.deptId} value={dept.deptName}>
                    {dept.deptName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Designation Name</label>
              <input
                type="text"
                value={designationDesc}
                onChange={handleDesignationDescChange}
                placeholder="Enter designation name (letters only)..."
                maxLength={50}
                className="form-input"
              />
              <p className="text-xs text-gray-500 mt-1">
                Only letters, spaces, and hyphens are allowed
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-cancel"
            >
              Cancel
            </button>
            <button type="submit" className="btn-toggle">
              Create Designation
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="table-card-bg rounded-xl border  p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2 primary-color font-semibold text-lg">
            <Badge className="w-5 h-5" /> Existing Designations
          </h2>
          <span className="text-sm text-gray-400">
            Total: {designations.length} designations
          </span>
        </div>

        <div className="table-wrapper">
          <table className="w-full text-left">
            <thead className="table-head">
              <tr>
                <th className="table-cell">Department</th>
                <th className="table-cell">Designation</th>
                <th className="table-cell-icon flex gap-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {groupedDesignations.length > 0 ? (
                groupedDesignations.map((group) =>
                  group.designations.map((desig, id) => (
                    <tr key={desig.designationId} className="table-row">
                      <td className="table-cell-name">
                        <div className="flex items-center gap-1 ">
                          {id === 0 ? (
                            <Building2 className="w-4 h-4 primary-color " />
                          ) : (
                            ""
                          )}{" "}
                          {id === 0 ? group.deptName : ""}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {editId === desig.designationId ? (
                          <div>
                            <input
                              type="text"
                              value={editText}
                              onChange={handleEditTextChange}
                              className="form-input"
                              placeholder="Enter new name (letters only)..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Only letters, spaces, and hyphens are allowed
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 ">
                            {" "}
                            <Badge className="w-4 h-4 primary-color " />
                            {desig.designationDesc}
                          </div>
                        )}
                      </td>
                      <td className="table-cell-icon flex gap-4">
                        {editId === desig.designationId ? (
                          <>
                            <button
                              onClick={() =>
                                handleSaveEdit(desig.designationId)
                              }
                              className="primary-color hover:underline"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-gray-400 hover:underline"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEditInline(desig)}
                            className="flex items-center gap-1 primary-color hover:underline"
                          >
                            <Pencil className="w-4 h-4" /> Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="table-cell table-cell-muted text-center"
                  >
                    No designations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guidelines */}
      <div className="table-card-bg rounded-xl p-4 mt-6 shadow-lg">
        <h3 className="primary-color font-semibold mb-3">
          Designation Management Guidelines
        </h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-300">
          <p>
            📘 <span className="text-white">Create:</span> Add new designations
            under departments
          </p>
          <p>
            🔍 <span className="text-white">Search:</span> Quickly find
            designations
          </p>
          <p>
            ✏️ <span className="text-white">Edit:</span> Update designation
            inline
          </p>
          <p>
            ⚠️ <span className="text-white">Validation:</span> Only letters,
            spaces, and hyphens allowed
          </p>
        </div>
      </div>
    </div>
  );
}
