import React, { useEffect, useState } from "react";
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
import { v4 as uuidv4 } from "uuid";
import GuidelinesCard from "./reusable/guidelinesCard";
import { designationGuidelines } from "../constants/guidelines";
import customConfirm from "./reusable/CustomConfirm";
import { DesignationCreate, DesignationUpdate, getDepartmentData, getDesignationData } from "../services/service";

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
      const res = await getDepartmentData();
      setDepartments(res.data || []);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    }
  };

  const fetchDesignations = async () => {
    try {
      const res = await getDesignationData();
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
    const confirmAction = await customConfirm("Are you sure you want to continue?");
    if (!confirmAction) return;
    if (!selectedDeptId || !designationDesc.trim()) {
      return alert("Please select department and enter designation");
    }

    const payload = {
      logId: uuidv4(),
      deptName: selectedDeptId,
      designationName: designationDesc.trim(),      
    };

    try {
      await DesignationCreate(payload);
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

  const handleSaveEdit = async (desig) => {
    if (!editText.trim()) return alert("Designation cannot be empty");
    const payload = {
      designationId: desig.designationId,
      newDescription: editText.trim(),
      logId:
        desig.logId && desig.logId !== "00000000-0000-0000-0000-000000000000"
          ? desig.logId
          : uuidv4(),
    };

    try {
      await DesignationUpdate(payload);
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
    <div>
      {/* Header */}
      <div className="form-header">
        <div className="back-title flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          {/* Top row for mobile: Arrow + Title + Badge Icon */}
          <div className="flex items-center justify-between w-full sm:hidden">
            {/* Arrow */}
            <button className="header-icon-btn" onClick={onBack}>
              <ArrowLeft className="primary-color w-4 h-4" />
            </button>

            {/* Title & Subtitle centered */}
            <div className="flex flex-col items-center text-center">
              <h1 className="header-title text-base">Designation Management</h1>
              <p className="header-subtext text-xs">
                Create and manage designations under departments
              </p>
            </div>

            {/* Badge Icon */}
            <div className="header-icon-box">
              <Badge className="primary-color w-4 h-4" />
            </div>
          </div>

          {/* Active Designations below for mobile */}
          <div className="flex justify-center w-full sm:hidden mt-2">
            <button className="btn-count text-xs">
              <span className="w-2 h-2 rounded-full bg-[#04CF6A] plus"></span>
              {designations.length} Active Designations
            </button>
          </div>

          {/* Desktop layout (sm and above) */}
          <div className="hidden sm:flex sm:justify-between sm:items-center w-full gap-[10px]">
            {/* Left: Arrow + Badge Icon + Title */}
            <div className="header-left flex items-center gap-[10px]">
              <button className="header-icon-btn" onClick={onBack}>
                <ArrowLeft className="primary-color w-4 h-4" />
              </button>
              <div className="header-icon-box">
                <Badge className="primary-color w-4 h-4" />
              </div>
              <div>
                <h1 className="user-title">Designation Management</h1>
                <p className="user-subtitle">
                  Create and manage designations under departments
                </p>
              </div>
            </div>

            {/* Right: Active Designations */}
            <div className="flex items-center gap-4">
              <button className="btn-count text-sm">
                <span className="w-2 h-2 rounded-full bg-[#04CF6A] plus"></span>
                {designations.length} Active Designations
              </button>
            </div>
          </div>
        </div>

        {/* Search & Toggle */}
        <div className="search-toggle flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 items-center">
          {/* Search */}
          <div className="search-box relative">
            <Search className="absolute left-3 top-2 text-gray-400 !w-3 h-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search designations..."
              className="search-input !w-[250px]" // fixed width
            />
          </div>

          {/* Toggle form */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-toggle flex items-center justify-center gap-1"
          >
            <Plus className="w-3 h-3" />
            {showForm ? "Close Form" : "Create Designation"}
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
      <div className="table-card overflow-x-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <div className="flex items-center gap-2 primary-color">
            <Badge className="w-4 h-4" />
            <p className="user-table-header">Existing Designations</p>
          </div>
          <span className="text-sm text-gray-400 ">
            Total:{" "}
            <span className="text-sm table-subtext">
              {" "}
              {designations.length} designations
            </span>
          </span>
        </div>

        {/* Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Department</th>
                <th>Designation</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {groupedDesignations.length > 0 ? (
                groupedDesignations.map((group) =>
                  group.designations.map((desig, id) => (
                    <tr key={desig.designationId}>
                      <td>
                        <div className="flex items-center gap-1">
                          {id === 0 ? (
                            <Building2 className="w-4 h-4 primary-color" />
                          ) : null}{" "}
                          {id === 0 ? group.deptName : ""}
                        </div>
                      </td>
                      <td>
                        {editId === desig.designationId ? (
                          <div>
                            <input
                              type="text"
                              value={editText}
                              onChange={handleEditTextChange}
                              className="form-input w-full"
                              placeholder="Enter new name (letters only)..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Only letters, spaces, and hyphens are allowed
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Badge className="w-4 h-4 primary-color" />
                            {desig.designationDesc}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="py-2 flex justify-end gap-4">
                          {editId === desig.designationId ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(desig)}
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
                        </div>
                      </td>
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="table-cell table-cell-muted text-center px-4 py-2"
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
      <GuidelinesCard
        title="Designation Management Guidelines"
        guidelines={designationGuidelines}
      />
    </div>
  );
}
