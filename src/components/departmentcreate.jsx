import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Building2, Pencil, Search, Plus, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export default function DepartmentCreation({ onBack }) {
  const [departmentName, setDepartmentName] = useState("");
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDeptId, setEditingDeptId] = useState(null);
  const [newDeptName, setNewDeptName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Function to validate input - allows only letters, spaces, and hyphens
  const validateInput = (input) => {
    // Regular expression to allow only letters, spaces, and hyphens
    const regex = /^[a-zA-Z\s-]*$/;
    return regex.test(input);
  };

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/fes/api/Export/simple-departments`
      );
      setDepartments(res.data || []);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Handle department name input change with validation
  const handleDepartmentNameChange = (e) => {
    const value = e.target.value;
    if (validateInput(value)) {
      setDepartmentName(value);
    }
  };

  // Handle new department name input change with validation
  const handleNewDeptNameChange = (e) => {
    const value = e.target.value;
    if (validateInput(value)) {
      setNewDeptName(value);
    }
  };

  // Create department
  // Create department
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!departmentName.trim()) return alert("Please enter a department name.");

    const exists = departments.some(
      (d) => d.deptName.toLowerCase() === departmentName.trim().toLowerCase()
    );
    if (exists) return alert("Department already exists.");

    try {
      const payload = {
        logId: uuidv4(), // ✅ auto-generate unique UUID
        deptName: departmentName.trim(),
        metadata: {
          ipAddress: window.location.hostname || "unknown",
          userAgent: navigator.userAgent,
          channel: "WEB",
          headers: "N/A",
          auditMetadata: {
            createdBy: "admin", // replace with actual logged-in user if available
            createdDate: new Date().toISOString(),
            modifiedBy: "admin",
            modifiedDate: new Date().toISOString(),
          },
        },
      };

      await axios.post(
        `${API_BASE_URL}/ums/api/UserManagement/department_create`,
        payload
      );

      setDepartmentName("");
      setShowForm(false);
      fetchDepartments();
    } catch (err) {
      console.error("Failed to create department:", err);
      alert("Error occurred while creating department.");
    }
  };

  // Update department
  const handleUpdate = async (deptId) => {
    if (!newDeptName.trim()) return alert("Enter new name");

    try {
      // Find the department being updated
      const dept = departments.find((d) => d.deptId === deptId);

      const payload = {
        deptId,
        newName: newDeptName.trim(),
        logId:
          dept?.logId && dept.logId !== "00000000-0000-0000-0000-000000000000"
            ? dept.logId
            : uuidv4(), // ✅ reuse existing logId or generate new one if null/empty
        metadata: {
          ipAddress: window.location.hostname || "unknown",
          userAgent: navigator.userAgent,
          channel: "WEB",
          headers: "N/A",
          auditMetadata: {
            modifiedBy: "admin",
            modifiedDate: new Date().toISOString(),
          },
        },
      };

      await axios.put(
        `${API_BASE_URL}/ums/api/UserManagement/department_update`,
        payload
      );

      setEditingDeptId(null);
      setNewDeptName("");
      fetchDepartments();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Error updating department.");
    }
  };

  // Filtered list
  const filteredDepartments = departments.filter((d) =>
    d.deptName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="department-page">
      {/* Header */}
      <div className="form-header">
        <div className="back-title flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          {/* Top row for mobile: Arrow + Title + Building Icon */}
          <div className="flex items-center justify-between w-full sm:hidden">
            {/* Arrow */}
            <button className="header-icon-btn" onClick={onBack}>
              <ArrowLeft className="primary-color w-4 h-4" />
            </button>

            {/* Title & Subtitle centered */}
            <div className="flex flex-col items-center text-center">
              <h1 className="header-title text-base">Department Management</h1>
              <p className="header-subtext text-xs">
                Create and manage organizational departments
              </p>
            </div>

            {/* Building Icon */}
            <div className="header-icon-box">
              <Building2 className="primary-color w-4 h-4" />
            </div>
          </div>

          {/* Active Departments below for mobile */}
          <div className="flex justify-center w-full sm:hidden mt-2">
            <button className="btn-count text-xs">
              <span className="w-2 h-2 rounded-full bg-[#04CF6A] plus"></span>
              {departments.length} Active Departments
            </button>
          </div>

          {/* Desktop layout (sm and above) */}
          <div className="hidden sm:flex sm:justify-between sm:items-center w-full gap-[10px]">
            {/* Left: Arrow + Building Icon + Title */}
            <div className="header-left flex items-center gap-[10px]">
              <button className="header-icon-btn " onClick={onBack}>
                <ArrowLeft className="primary-color w-4 h-4" />
              </button>
              <div className="header-icon-box">
                <Building2 className="primary-color w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <h1 className="header-title text-lg">Department Management</h1>
                <p className="header-subtext text-sm">
                  Create and manage organizational departments
                </p>
              </div>
            </div>

            {/* Right: Active Departments */}
            <div className="flex items-center gap-4">
              <button className="btn-count text-sm">
                <span className="w-2 h-2 rounded-full bg-[#04CF6A] plus"></span>
                {departments.length} Active Departments
              </button>
            </div>
          </div>
        </div>

        <div className="search-toggle flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 items-center">
          {/* Search */}
          <div className="search-box relative">
            <Search className="absolute left-3 top-2 text-gray-400 !w-3 h-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search departments..."
              className="search-input !w-[250px]" // fixed width for all screens
            />
          </div>

          {/* Toggle form */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-toggle flex items-center justify-center align-center gap-1 "
          >
            <Plus className="w-3 h-3" />
            {showForm ? "Close Form" : "Create Department"}
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="department-form">
          <h2 className="form-title">Create New Department</h2>

          <div>
            <label className="form-label">Department Name</label>
            <input
              type="text"
              value={departmentName}
              onChange={handleDepartmentNameChange}
              placeholder="Enter department name (letters only)..."
              className="form-input"
            />
            <p className="text-xs text-gray-500 mt-1">
              Only letters, spaces, and hyphens are allowed
            </p>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-cancel"
            >
              Cancel
            </button>
            <button type="submit" className="btn-toggle">
              Create Department
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="table-card">
        <div className="table-header">
          <p className="table-title">
            <Building2 className="w-5 h-5" /> Existing Departments
          </p>
          <span className="table-subtext">
            Total: {filteredDepartments.length} departments
          </span>
        </div>

        <div className="w-full overflow-x-auto overflow-y-auto table-scrollbar">
              <div className="max-h-[350px] sm:max-h-full">
          <table className="w-full text-left">
            <thead className="table-head sticky top-0 z-10">
              <tr>
                <th className="table-cell">Department Name</th>
                <th className="table-cell-icon flex gap-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((dept) => (
                  <tr key={dept.deptId} className="table-row">
                    <td className="table-cell-name">
                      {editingDeptId === dept.deptId ? (
                        <div>
                          <input
                            type="text"
                            value={newDeptName}
                            onChange={handleNewDeptNameChange}
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
                          <Building2 className="w-4 h-4 primary-color " />
                          {dept.deptName}
                        </div>
                      )}
                    </td>
                    <td className="table-cell-icon flex gap-4 ">
                      {editingDeptId === dept.deptId ? (
                        <>
                          <button
                            onClick={() => handleUpdate(dept.deptId)}
                            className="primary-color hover:underline"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingDeptId(null);
                              setNewDeptName("");
                            }}
                            className="text-gray-400 hover:underline"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingDeptId(dept.deptId);
                              setNewDeptName(dept.deptName);
                            }}
                            className="primary-color hover:underline flex items-center gap-1"
                          >
                            <Pencil className="w-4 h-4" /> Edit
                          </button>
                          {/* <button className="text-red-500 hover:underline flex items-center gap-1">
                            <Trash2 className="w-4 h-4" /> Delete
                          </button> */}
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="table-cell table-cell-muted text-center"
                  >
                    No departments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>

      {/* Guidelines */}
      <div className="guidelines-card">
        <h3 className="guidelines-title text-base sm:text-lg">
          Department Management Guidelines
        </h3>
        <div className="guidelines-grid text-sm sm:text-base">
          <p>
            📘 <span className="font-semibold">Create:</span> Add new
            departments
          </p>
          <p>
            🔍 <span className="font-semibold">Search:</span> Find departments
            quickly
          </p>
        </div>
        <div className="guidelines-grid text-sm sm:text-base">
          <p>
            ✏️ <span className="font-semibold">Edit:</span> Modify department
            names inline
          </p>
          <p>
            ⚠️ <span className="font-semibold">Validation:</span> Only letters,
            spaces, and hyphens allowed
          </p>
        </div>
      </div>
    </div>
  );
}
