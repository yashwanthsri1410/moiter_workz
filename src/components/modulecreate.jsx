import React, { useEffect, useState } from "react";
import axios from "axios";
import usePublicIp from "../hooks/usePublicIp";
import {
  ArrowLeft,
  Boxes,
  Pencil,
  Trash2,
  Search,
  Plus,
  Settings,
  X,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export default function ModuleCreation({ onBack }) {
  const [modules, setModules] = useState([]);
  const [newModuleName, setNewModuleName] = useState("");
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [editedModuleName, setEditedModuleName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [headersError, setHeadersError] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const ip = usePublicIp();
  const username = localStorage.getItem("username");

  // Function to validate input - allows only letters, spaces, and hyphens
  const validateInput = (input) => {
    // Regular expression to allow only letters, spaces, and hyphens
    const regex = /^[a-zA-Z\s-]*$/;
    return regex.test(input);
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/fes/api/Export/modules`);
      setModules(res.data || []);
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  // Handle new module name input change with validation
  const handleNewModuleNameChange = (e) => {
    const value = e.target.value;
    if (validateInput(value)) {
      setNewModuleName(value);
    }
  };

  // Handle edited module name input change with validation
  const handleEditedModuleNameChange = (e) => {
    const value = e.target.value;
    if (validateInput(value)) {
      setEditedModuleName(value);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newModuleName.trim()) return alert("Please enter module name.");

    const exists = modules.some(
      (mod) =>
        mod.moduleName.toLowerCase() === newModuleName.trim().toLowerCase()
    );
    if (exists) return alert("Module already exists.");

    const now = new Date().toISOString();
    const payload = {
      logId: uuidv4(),
      moduleName: newModuleName.trim(),
      metadata: {
        ipAddress: ip,
        userAgent: navigator.userAgent,
        headers: headersError
          ? headersError
          : JSON.stringify({ "content-type": "application/json" }),
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
        `${API_BASE_URL}/ums/api/UserManagement/module_create`,
        payload
      );
      setNewModuleName("");
      setShowForm(false);
      fetchModules();
    } catch (err) {
      console.error("Error creating module:", err);
      setHeadersError(" Error occurred while creating module." + err);
      alert("Failed to create module.");
    }
  };

  const handleUpdate = async (moduleId) => {
  if (!editedModuleName.trim()) return alert("Please enter module name.");

  const original = modules.find((mod) => mod.moduleId === moduleId);
  if (!original) return alert("Module not found.");

  const newNameLower = editedModuleName.trim().toLowerCase();
  if (newNameLower === original.moduleName.toLowerCase()) {
    alert("No changes detected.");
    setEditingModuleId(null);
    setEditedModuleName("");
    return;
  }

  const exists = modules.some(
    (mod) =>
      mod.moduleId !== moduleId &&
      mod.moduleName.trim().toLowerCase() === newNameLower
  );
  if (exists) return alert("A module with this name already exists.");

  const now = new Date().toISOString();
  const payload = {
    moduleId,
    logId:
      original.logId && original.logId !== "00000000-0000-0000-0000-000000000000"
        ? original.logId // reuse existing logId
        : uuidv4(),      // generate new one if missing
    newName: editedModuleName.trim(),
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
      `${API_BASE_URL}/ums/api/UserManagement/module_update`,
      payload
    );
    setEditingModuleId(null);
    setEditedModuleName("");
    fetchModules();
  } catch (error) {
    console.error("Update error:", error);
    alert("Failed to update module.");
  }
};


  const filteredModules = modules.filter((mod) =>
    mod.moduleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <Settings className="primary-color w-4 h-4" />
              </div>
            </div>
            <div>
              <h1 className="header-title">Module Management</h1>
              <p className="header-subtext">
                Create and manage application modules
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Active count */}
            <button className="btn-count">
              <span className="w-2 h-2 rounded-full bg-[#00f5a0]"></span>
              {modules.length} Active Modules
            </button>
          </div>
        </div>

        <div className="search-toggle">
          {/* Search */}
          <div className="search-box">
            <Search className="absolute left-3 top-2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search modules..."
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
        <form onSubmit={handleCreate} className="department-form">
          <h2 className="form-title">Create New Module</h2>

          <div>
            <label className="form-label">Module Name</label>
            <input
              type="text"
              value={newModuleName}
              onChange={handleNewModuleNameChange}
              placeholder="Enter module name (letters only)..."
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
              Create Module
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="table-card">
        <div className="table-header">
          <p className="table-title">
            <Settings className="w-5 h-5" /> Existing Modules
          </p>
          <span className="table-subtext">
            Total: {filteredModules.length} modules
          </span>
        </div>

        <div className="table-wrapper">
          <table className="w-full text-left">
            <thead className="table-head">
              <tr>
                <th className="table-cell">Module Name</th>
                <th className="table-cell-icon flex gap-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredModules.length > 0 ? (
                filteredModules.map((mod) => (
                  <tr key={mod.moduleId} className="table-row">
                    <td className="table-cell-name">
                      {editingModuleId === mod.moduleId ? (
                        <div>
                          <input
                            type="text"
                            value={editedModuleName}
                            onChange={handleEditedModuleNameChange}
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
                          <Settings className="w-4 h-4 primary-color " />
                          {mod.moduleName}
                        </div>
                      )}
                    </td>
                    <td className="table-cell-icon flex gap-4">
                      {editingModuleId === mod.moduleId ? (
                        <>
                          <button
                            onClick={() => handleUpdate(mod.moduleId)}
                            className="primary-color hover:underline"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingModuleId(null);
                              setEditedModuleName("");
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
                              setEditingModuleId(mod.moduleId);
                              setEditedModuleName(mod.moduleName);
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
                    colSpan={2}
                    className="table-cell table-cell-muted text-center"
                  >
                    No modules found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guidelines */}
      <div className="guidelines-card">
        <h3 className="guidelines-title">Module Management Guidelines</h3>
        <div className="guidelines-grid">
          <p>
            📘 <span>Create:</span> Add new modules
          </p>
          <p>
            🔍 <span>Search:</span> Find modules quickly
          </p>
        </div>
        <div className="guidelines-grid">
          <p>
            ✏️ <span>Edit:</span> Modify module names inline
          </p>
          <p>
            ⚠️ <span>Validation:</span> Only letters, spaces, and hyphens
            allowed
          </p>
        </div>
      </div>
    </div>
  );
}
