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
} from "lucide-react";

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

  useEffect(() => {
    fetchModules();
    fetchScreens();
  }, []);

  const fetchModules = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}:7090/api/Export/modules`);
      setModules(res.data || []);
    } catch (err) {
      console.error("Failed to fetch modules:", err);
    }
  };

  const fetchScreens = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}:7090/api/Export/screens`);
      setScreens(res.data || []);
    } catch (err) {
      console.error("Failed to fetch screens:", err);
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
        `${API_BASE_URL}:5229/ums/api/UserManagement/screen_create`,
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

  const handleSaveEdit = async (screenId) => {
    if (!editText.trim()) return alert("Screen name cannot be empty");

    const now = new Date().toISOString();
    const payload = {
      screenId,
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
        `${API_BASE_URL}:5229/ums/api/UserManagement/screen_update`,
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
        <div className="back-title">
          <div className="header-left">
            <div className="flex items-center gap-[10px]">
              <button className="header-icon-btn" onClick={onBack}>
                <ArrowLeft className="text-[#00d4aa] w-4 h-4" />
              </button>

              <div className="header-icon-box">
                <LayoutGrid className="text-[#00d4aa] w-4 h-4" />
              </div>
            </div>

            <div>
              <h1 className="header-title">Screen Management</h1>
              <p className="header-subtext">
                Create and manage screens under modules
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Active count */}
            <button className="btn-count">
              <span className="w-2 h-2 rounded-full bg-[#04CF6A] plus"></span>
              {screens.length} Active Screens
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
              placeholder="Search screens..."
              className="search-input"
            />
          </div>

          {/* Toggle form */}
          <button onClick={() => setShowForm(!showForm)} className="btn-toggle">
            <Plus className="w-3 h-3" />
            {showForm ? "Close Form" : "Create Screen"}
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="department-form">
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
                onChange={(e) => setScreenName(e.target.value)}
                placeholder="Enter screen name..."
                maxLength={50}
                className="form-input"
              />
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
      <div className="bg-[#0D0F12] rounded-xl border border-gray-800 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2 text-teal-400 font-semibold text-lg">
            <LayoutGrid className="w-5 h-5" /> Existing Screens
          </h2>
          <span className="text-sm text-gray-400">
            Total: {screens.length} screens
          </span>
        </div>

        <div className="table-wrapper">
          <table className="w-full text-left">
            <thead className="table-head">
              <tr>
                <th className="table-cell">Module</th>
                <th className="table-cell">Screen</th>
                <th className="table-cell-icon color-[#00d4aa] flex gap-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {groupedScreens.length > 0 ? (
                groupedScreens.map((group) =>
                  group.screens.map((screen, idx) => (
                    <tr key={screen.screenId} className="table-row">
                      <td className="table-cell-name">
                        <div className="flex items-center gap-1 ">
                          {" "}
                          {idx === 0 ? (
                            <Settings className="w-4 h-4 text-teal-400 " />
                          ) : (
                            ""
                          )}
                          {idx === 0 ? group.moduleName : ""}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {editId === screen.screenId ? (
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="form-input"
                          />
                        ) : (
                          <div className="flex items-center gap-1 ">
                            {" "}
                            <Monitor className="w-4 h-4 text-teal-400 " />
                            {screen.screenDesc}
                          </div>
                        )}
                      </td>
                      <td className="table-cell-icon flex gap-4">
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
                            className="flex items-center gap-1 text-teal-400 hover:underline"
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
                    No screens found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guidelines */}
      <div className="bg-[#0D0F12] rounded-xl border border-gray-800 p-4 mt-6 shadow-lg">
        <h3 className="text-teal-400 font-semibold mb-3">
          Screen Management Guidelines
        </h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-300">
          <p>
            📘 <span className="text-white">Create:</span> Add new screens under
            modules
          </p>
          <p>
            🔍 <span className="text-white">Search:</span> Quickly find screens
          </p>
          <p>
            ✏️ <span className="text-white">Edit:</span> Update screen inline
          </p>
          <p>
            🗑️ <span className="text-white">Delete:</span> Remove unused screens
          </p>
        </div>
      </div>
    </div>
  );
}
