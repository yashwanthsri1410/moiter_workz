import React, { useEffect, useState } from "react";
import axios from "axios";
import usePublicIp from "../hooks/usePublicIp";
import backgroundImg from "../assets/background.jpeg";

export default function ModuleCreation() {
  const [modules, setModules] = useState([]);
  const [newModuleName, setNewModuleName] = useState("");
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [editedModuleName, setEditedModuleName] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 Search feature
  const ip = usePublicIp();
  const username = localStorage.getItem("username");
  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const res = await axios.get("http://192.168.22.247:7090/api/Export/modules");
      setModules(res.data || []);
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newModuleName.trim()) {
      alert("Please enter module name.");
      return;
    }

    const exists = modules.some(
      (mod) => mod.moduleName.toLowerCase() === newModuleName.trim().toLowerCase()
    );

    if (exists) {
      alert("Module already exists.");
      return;
    }

    const now = new Date().toISOString(); 

    const payload = {
      moduleName: newModuleName.trim(),
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
        "http://192.168.22.247:5229/ums/api/UserManagement/module_create",
        payload
      );
      alert("Module created successfully.");
      setNewModuleName("");
      fetchModules();
    } catch (err) {
      console.error("Error creating module:", err);
      alert("Failed to create module.");
    }
  };

  const handleUpdate = async (moduleId) => {
    if (!editedModuleName.trim()) {
      alert("Please enter module name.");
      return;
    }

    const now = new Date().toISOString();
    const userId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

    const payload = {
      moduleId,
      newName: editedModuleName.trim(),
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
        "http://192.168.22.247:5229/ums/api/UserManagement/module_update",
        payload
      );
      alert("Module updated successfully.");
      setEditingModuleId(null);
      setEditedModuleName("");
      fetchModules();
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update module.");
    }
  };

  const filteredModules = modules.filter((mod) =>
    mod.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) // 🔍 Search filter
  );

  return (
<div
  className="min-h-screen flex items-start justify-center bg-[#0f1a37] p-6"
>
  <div className="relative z-10 w-full max-w-3xl bg-[#111c44] rounded-xl shadow-lg p-6 sm:p-8 text-white">
    <h2 className="text-2xl font-bold text-center mb-6 text-white">
      Module Manager
    </h2>

    {/* Create Module */}
    <form
      onSubmit={handleCreate}
      className="flex flex-col sm:flex-row gap-4 mb-4"
    >
      <input
        type="text"
        value={newModuleName}
        onChange={(e) => setNewModuleName(e.target.value)}
        placeholder="Enter new module name"
        className="flex-1 px-4 py-2 bg-[#1a274f] text-white border border-gray-600 rounded-md placeholder-gray-400"
      />
      <button
        type="submit"
        className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition"
      >
        Add Module
      </button>
    </form>

    {/* Search */}
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search modules..."
      className="w-full px-4 py-2 mb-6 bg-[#1a274f] text-white border border-gray-600 rounded-md placeholder-gray-400"
    />

    {/* Module Title */}
    <h3 className="text-xl font-semibold mb-3 text-blue-500 border-b border-gray-600 pb-2">
      Module List
    </h3>

    {/* Module Table */}
    <div className="grid grid-cols-1 gap-3">
      {filteredModules.map((mod) => (
        <div
          key={mod.moduleId}
          className="flex items-center justify-between px-4 py-3 rounded-md bg-[#1f2a4a] border border-gray-700"
        >
          {editingModuleId === mod.moduleId ? (
            <input
              type="text"
              value={editedModuleName}
              onChange={(e) => setEditedModuleName(e.target.value)}
              className="flex-1 px-3 py-1 mr-3 bg-[#283a5e] text-white border border-gray-500 rounded-md"
            />
          ) : (
            <span className="flex-1 text-white">{mod.moduleName}</span>
          )}

          {editingModuleId === mod.moduleId ? (
            <div className="flex gap-2">
              <button
                onClick={() => handleUpdate(mod.moduleId)}
                className="text-green-400 hover:underline"
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
            </div>
          ) : (
            <button
              onClick={() => {
                setEditingModuleId(mod.moduleId);
                setEditedModuleName(mod.moduleName);
              }}
              className="text-blue-500 hover:underline"
            >
              Edit
            </button>
          )}
        </div>
      ))}
    </div>
  </div>
</div>


  );
}
