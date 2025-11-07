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
import GuidelinesCard from "./reusable/guidelinesCard";
import { moduleGuidelines } from "../constants/guidelines";
import customConfirm from "./reusable/CustomConfirm";
import { getModuleData, ModuleCreate, ModuleUpdate } from "../services/service";

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
      const res = await getModuleData();
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
    const confirmAction = await customConfirm("Are you sure you want to continue?");
    if (!confirmAction) return;
    if (!newModuleName.trim()) return alert("Please enter module name.");

    const exists = modules.some(
      (mod) =>
        mod.moduleName.toLowerCase() === newModuleName.trim().toLowerCase()
    );
    if (exists) return alert("Module already exists.");

    const payload = {
      logId: uuidv4(),
      moduleName: newModuleName.trim(),
    };

    try {
      await ModuleCreate(payload);
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

    const payload = {
      moduleId,
      logId:
        original.logId &&
          original.logId !== "00000000-0000-0000-0000-000000000000"
          ? original.logId // reuse existing logId
          : uuidv4(), // generate new one if missing
      newName: editedModuleName.trim(),
    };

    try {
      await ModuleUpdate(payload);
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
    <div>
      {/* Header */}
      <div className="form-header">
        <div className="back-title flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          {/* Mobile Header */}
          <div className="flex items-center justify-between w-full sm:hidden">
            <button className="header-icon-btn" onClick={onBack}>
              <ArrowLeft className="primary-color w-4 h-4" />
            </button>
            <div className="flex flex-col items-center text-center">
              <h1 className="header-title text-base">Module Management</h1>
              <p className="header-subtext text-xs">
                Create and manage application modules
              </p>
            </div>
            <div className="header-icon-box">
              <Settings className="primary-color w-4 h-4" />
            </div>
          </div>

          {/* Active Modules below for mobile */}
          <div className="flex justify-center w-full sm:hidden mt-2">
            <button className="btn-count text-xs">
              <span className="w-2 h-2 rounded-full bg-[#00f5a0]"></span>
              {modules.length} Active Modules
            </button>
          </div>

          {/* Desktop Header */}
          <div className="hidden sm:flex sm:justify-between sm:items-center w-full gap-[10px]">
            <div className="header-left flex items-center gap-[10px]">
              <button className="header-icon-btn" onClick={onBack}>
                <ArrowLeft className="primary-color w-4 h-4" />
              </button>
              <div className="header-icon-box">
                <Settings className="primary-color w-4 h-4" />
              </div>
              <div>
                <h1 className="user-title">Module Management</h1>
                <p className="user-subtitle">
                  Create and manage application modules
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="btn-count text-sm">
                <span className="w-2 h-2 rounded-full bg-[#00f5a0]"></span>
                {modules.length} Active Modules
              </button>
            </div>
          </div>
        </div>

        {/* Search & Toggle */}
        <div className="search-toggle flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 items-center mt-2">
          <div className="search-box relative">
            <Search className="absolute left-3 top-2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search modules..."
              className="search-input !w-[250px]"
            />
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-toggle flex items-center justify-center gap-1"
          >
            <Plus className="w-4 h-4" />
            {showForm ? "Close Form" : "Create Module"}
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="department-form mt-4">
          <h2 className="form-title">Create New Module</h2>
          <div className="grid md:grid-cols-2 gap-4">
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
              Create Module
            </button>
          </div>
        </form>
      )}
      {/* Table */}
      <div className="table-card">
        <div className="table-header flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 primary-color">
            <Settings className="w-4 h-4" />
            <p className="user-table-header">Existing Modules</p>
          </div>
          <span className="table-subtext">
            Total: {filteredModules.length} modules
          </span>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Module Name</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredModules.length > 0 ? (
                filteredModules.map((mod) => (
                  <tr key={mod.moduleId}>
                    <td>
                      <div className="my-2">
                        {editingModuleId === mod.moduleId ? (
                          <div>
                            <input
                              type="text"
                              value={editedModuleName}
                              onChange={handleEditedModuleNameChange}
                              className="form-input w-full"
                              placeholder="Enter new name (letters only)..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Only letters, spaces, and hyphens are allowed
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Settings className="w-4 h-4 primary-color" />
                            {mod.moduleName}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 flex justify-end gap-4">
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
                        <button
                          onClick={() => {
                            setEditingModuleId(mod.moduleId);
                            setEditedModuleName(mod.moduleName);
                          }}
                          className="primary-color hover:underline flex items-center gap-1"
                        >
                          <Pencil className="w-4 h-4" /> Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    className="text-center text-gray-500 px-4 py-2"
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
      <GuidelinesCard
        title="Module Management Guidelines"
        guidelines={moduleGuidelines}
      />
    </div>
  );
}
