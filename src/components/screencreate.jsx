import React, { useEffect, useState } from "react";
import axios from "axios";
import usePublicIp from "../hooks/usePublicIp";
import {
  ArrowLeft,
  LayoutGrid,
  Monitor,
  Pencil,
  Plus,
  ScreenShareIcon,
  Search,
  Settings,
  X,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export default function ScreenManagement({ onBack }) {
  const [modules, setModules] = useState([]);
  const [screens, setScreens] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [screenName, setScreenName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
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
    fetchModules();
    fetchScreens();
  }, []);

  const fetchModules = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/fes/api/Export/modules`);
      setModules(res.data || []);
    } catch (err) {
      console.error("Failed to fetch modules:", err);
    }
  };

  const fetchScreens = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/fes/api/Export/screens`);
      setScreens(res.data || []);
    } catch (err) {
      console.error("Failed to fetch screens:", err);
    }
  };

  // Handle screen name input change with validation
  const handleScreenNameChange = (e) => {
    const value = e.target.value;
    if (validateInput(value)) {
      setScreenName(value);
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
    if (!selectedModuleId || !screenName.trim()) {
      return alert("Please select a module and enter screen name");
    }

    const now = new Date().toISOString();
    const payload = {
      moduleId: Number(selectedModuleId),
      screenDescription: screenName.trim(),
      logId: uuidv4(),
      metadata: {
        ipAddress: ip,
        userAgent: navigator.userAgent,
        headers: "N/A",
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
        `${API_BASE_URL}/ums/api/UserManagement/screen_create`,
        payload
      );
      setScreenName("");
      fetchScreens();
      setShowForm(false);
    } catch (err) {
      console.error("Error creating screen:", err);
      alert("Failed to create screen");
    }
  };

  const handleEditInline = (screen) => {
    setEditId(screen.screenId);
    setEditText(screen.screenDesc);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  const handleSaveEdit = async (screen) => {
    if (!editText.trim()) return alert("Screen name cannot be empty");

    const now = new Date().toISOString();
    const payload = {
      screenId: screen.screenId,
      logId:
        screen.logId && screen.logId !== "00000000-0000-0000-0000-000000000000"
          ? screen.logId // reuse existing
          : uuidv4(), // fallback new UUID
      newDescription: editText.trim(),
      metadata: {
        ipAddress: ip,
        userAgent: navigator.userAgent,
        headers: "N/A",
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
        `${API_BASE_URL}/ums/api/UserManagement/screen_update`,
        payload
      );
      handleCancelEdit();
      fetchScreens();
    } catch (err) {
      console.error("Error updating screen:", err);
      alert("Update failed");
    }
  };

  const groupedScreens = modules.reduce((acc, mod) => {
    const filtered = screens.filter(
      (s) =>
        s.moduleId === mod.moduleId &&
        (mod.moduleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.screenDesc?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    if (filtered.length > 0) {
      acc.push({ moduleName: mod.moduleName, screens: filtered });
    }
    return acc;
  }, []);

  return (
    <div className="p-6 space-y-6 min-h-screen text-white">
      {/* Header */}

      <div className="form-header">
        {/* Header Wrapper */}
        <div className="back-title flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          {/* Mobile Header */}
          <div className="flex items-center justify-between w-full sm:hidden">
            {/* Back button */}
            <button className="header-icon-btn" onClick={onBack}>
              <ArrowLeft className="primary-color w-4 h-4" />
            </button>

            {/* Title & Subtitle */}
            <div className="flex flex-col items-center text-center">
              <h1 className="header-title text-base">Screen Management</h1>
              <p className="header-subtext text-xs">
                Create and manage screens under modules
              </p>
            </div>

            {/* Icon */}
            <div className="header-icon-box">
              <Monitor className="primary-color w-4 h-4" />
            </div>
          </div>

          {/* Active Screens below for mobile */}
          <div className="flex justify-center w-full sm:hidden mt-2">
            <button className="btn-count text-xs">
              <span className="w-2 h-2 rounded-full bg-[#04CF6A]"></span>
              {screens.length} Active Screens
            </button>
          </div>

          {/* Desktop Header */}
          <div className="hidden sm:flex sm:justify-between sm:items-center w-full gap-[10px]">
            {/* Left: Back + Icon + Title */}
            <div className="header-left flex items-center gap-[10px]">
              <button className="header-icon-btn" onClick={onBack}>
                <ArrowLeft className="primary-color w-5 h-5" />
              </button>
              <div className="header-icon-box">
                <Monitor className="primary-color w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h1 className="header-title text-lg">Screen Management</h1>
                <p className="header-subtext text-sm">
                  Create and manage screens under modules
                </p>
              </div>
            </div>

            {/* Right: Active Screens */}
            <div className="flex items-center gap-4">
              <button className="btn-count text-sm">
                <span className="w-2 h-2 rounded-full bg-[#04CF6A]"></span>
                {screens.length} Active Screens
              </button>
            </div>
          </div>
        </div>

        {/* Search & Toggle */}
        <div className="search-toggle flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 items-center mt-2">
          {/* Search */}
          <div className="search-box relative w-full sm:w-auto">
            <Search className="absolute left-3 top-2 text-gray-400 w-3 h-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search screens..."
              className="search-input !w-full sm:!w-[250px]"
            />
          </div>

          {/* Toggle form button */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-toggle flex items-center justify-center gap-1"
          >
            <Plus className="w-3 h-3" />
            {showForm ? "Close Form" : "Create Screen"}
          </button>
        </div>
      </div>
      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="department-form mt-4">
          <h2 className="form-title">Create New Screen</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Select Module</label>
              <select
                value={selectedModuleId}
                onChange={(e) => setSelectedModuleId(e.target.value)}
                className="form-input"
              >
                <option value="">-- Select Module --</option>
                {modules.map((mod) => (
                  <option key={mod.moduleId} value={mod.moduleId}>
                    {mod.moduleName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Screen Name</label>
              <input
                type="text"
                value={screenName}
                onChange={handleScreenNameChange}
                placeholder="Enter screen name (letters only)..."
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
              className="text-sm font-medium text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button type="submit" className="btn-toggle">
              Create Screen
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="table-card rounded-xl border border-gray-800 p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h2 className="flex items-center gap-2 text-lg primary-color table-title">
            <Monitor className="w-5 h-5" /> Existing Screens
          </h2>
          <span className="text-sm text-gray-400 table-subtext">
            Total: {screens.length} screens
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-200 rounded-lg table-scrollbar">
              <div className="max-h-[350px] sm:max-h-full">
          <table className="w-full min-w-[600px] text-left table-auto border-collapse">
            <thead className="table-head sticky top-0 z-10">
              <tr>
                <th className="table-cell px-4 py-2">Module</th>
                <th className="table-cell px-4 py-2">Screen</th>
                <th className="table-cell px-4 py-2 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {groupedScreens.length > 0 ? (
                groupedScreens.map((group) =>
                  group.screens.map((screen, idx) => (
                    <tr key={screen.screenId} className="table-row">
                      <td className="table-cell-name px-4 py-2">
                        <div className="flex items-center gap-1 ">
                          {" "}
                          {idx === 0 ? (
                            <Settings className="w-4 h-4 primary-color" />
                          ) : (
                            ""
                          )}
                          {idx === 0 ? group.moduleName : ""}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {editId === screen.screenId ? (
                          <div>
                            <input
                              type="text"
                              value={editText}
                              onChange={handleEditTextChange}
                              className="form-input  w-full"
                              placeholder="Enter new name (letters only)..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Only letters, spaces, and hyphens are allowed
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 ">
                            {" "}
                            <Monitor className="w-4 h-4 primary-color " />
                            {screen.screenDesc}
                          </div>
                        )}
                      </td>
                      <td className="table-cell-icon px-4 py-2 flex justify-end gap-4">
                        {editId === screen.screenId ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(screen.screenId)}
                              className="text-teal-400 hover:underline"
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
                            onClick={() => handleEditInline(screen)}
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
                    className="table-cell table-cell-muted text-center px-4 py-2"
                  >
                    No screens found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
        {/* Guidelines */}
    <div className="guidelines-card mt-4">
  <h3 className="guidelines-title text-base sm:text-lg text-teal-400 font-semibold">
    Screen Management Guidelines
  </h3>

  <div className="guidelines-grid text-sm sm:text-base">
    <p>📘 <span className="font-semibold">Create:</span> Add new screens under modules</p>
    <p>🔍 <span className="font-semibold">Search:</span> Quickly find screens</p>
  </div>

  <div className="guidelines-grid text-sm sm:text-base">
    <p>✏️ <span className="font-semibold">Edit:</span> Update screen inline</p>
    <p>⚠️ <span className="font-semibold">Validation:</span> Only letters, spaces, and hyphens allowed</p>
  </div>
</div>
    </div>
  );
}
