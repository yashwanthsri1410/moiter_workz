import React, { useEffect, useState } from "react";
import axios from "axios";
import usePublicIp from "../hooks/usePublicIp";
import { Pencil, Search, Plus, Users, UserCog, ArrowLeft } from "lucide-react";

const RoleAccessForm = ({ onBack }) => {
  const [modulesData, setModulesData] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [screensPerModule, setScreensPerModule] = useState({});
  const [selectedScreensPerModule, setSelectedScreensPerModule] = useState({});
  const [roleDescription, setRoleDescription] = useState("");
  const [roleDescriptions, setRoleDescriptions] = useState([]);
  const [editRole, setEditRole] = useState(null);
  const [editedRoleName, setEditedRoleName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const username = localStorage.getItem("username");
  const ip = usePublicIp();

  // Function to validate input - allows only letters, spaces, and hyphens
  const validateInput = (input) => {
    // Regular expression to allow only letters, spaces, and hyphens
    const regex = /^[a-zA-Z\s-]*$/;
    return regex.test(input);
  };

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/fes/api/Export/modules-screens`)
      .then((res) => setModulesData(res.data))
      .catch((err) => console.error("Error fetching modules:", err));
    fetchRoles();
  }, []);

  const fetchRoles = () => {
    axios
      .get(`${API_BASE_URL}/fes/api/Export/role-module-screen`)
      .then((res) => {
        const uniqueRolesMap = new Map();
        res.data.forEach((item) => {
          const desc = item.roleDescription.trim();
          if (!uniqueRolesMap.has(desc)) {
            uniqueRolesMap.set(desc, {
              roleDescription: desc,
              roleAccessId: item.roleAccessId,
            });
          }
        });
        setRoleDescriptions(Array.from(uniqueRolesMap.values()));
      })
      .catch((err) => console.error("Error fetching roles:", err));
  };

  const uniqueModules = [...new Set(modulesData.map((item) => item.moduleName))];

  // Handle role description input change with validation
  const handleRoleDescriptionChange = (e) => {
    const value = e.target.value;
    if (validateInput(value)) {
      setRoleDescription(value);
    }
  };

  // Handle edited role name input change with validation
  const handleEditedRoleNameChange = (e) => {
    const value = e.target.value;
    if (validateInput(value)) {
      setEditedRoleName(value);
    }
  };

  const handleModuleCheckboxChange = (module) => {
    const updatedModules = selectedModules.includes(module)
      ? selectedModules.filter((m) => m !== module)
      : [...selectedModules, module];

    setSelectedModules(updatedModules);

    const screensObj = {};
    updatedModules.forEach((mod) => {
      const screens = modulesData
        .filter((item) => item.moduleName === mod)
        .map((item) => item.screenDesc);
      screensObj[mod] = screens;
    });
    setScreensPerModule(screensObj);

    const updatedSelectedScreens = { ...selectedScreensPerModule };
    Object.keys(updatedSelectedScreens).forEach((mod) => {
      if (!updatedModules.includes(mod)) {
        delete updatedSelectedScreens[mod];
      }
    });
    setSelectedScreensPerModule(updatedSelectedScreens);
  };

  const handleScreenCheckboxChange = (module, screen) => {
    setSelectedScreensPerModule((prev) => {
      const prevScreens = prev[module] || [];
      const updated = prevScreens.includes(screen)
        ? prevScreens.filter((s) => s !== screen)
        : [...prevScreens, screen];
      return { ...prev, [module]: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const screenModuleList = [];

    selectedModules.forEach((module) => {
      const screens = selectedScreensPerModule[module] || [];
      screens.forEach((screen) => {
        screenModuleList.push({ module, screen });
      });
    });

    if (screenModuleList.length === 0) {
      alert("Please select at least one screen.");
      return;
    }

    const bulkPayload = {
      roleDescription,
      screenModuleList,
      metadata: {
        ipAddress: ip,
        userAgent: navigator.userAgent,
        channel: "web",
        auditMetadata: {
          createdBy: username,
          createdDate: new Date().toISOString(),
          modifiedBy: username,
          modifiedDate: new Date().toISOString(),
        },
      },
    };

    try {
      await axios.post(
        `${API_BASE_URL}/ums/api/UserManagement/role-access/bulk`,
        bulkPayload
      );
      alert("Role access submitted successfully!");
      fetchRoles();
      setSelectedModules([]);
      setScreensPerModule({});
      setSelectedScreensPerModule({});
      setRoleDescription("");
      setShowForm(false);
    } catch (error) {
      console.error("Error submitting role access:", error);
      alert("Submission failed!");
    }
  };

  const handleUpdateRole = async () => {
    if (!editRole) return;

    const payload = {
      roleAccessId: editRole.roleAccessId,
      newRoleDescription: editedRoleName,
      metadata: {
        ipAddress: ip,
        userAgent: navigator.userAgent,
        channel: "web",
        auditMetadata: {
          createdBy: username,
          createdDate: new Date().toISOString(),
          modifiedBy: username,
          modifiedDate: new Date().toISOString(),
        },
      },
    };

    try {
      await axios.put(
        `${API_BASE_URL}/ums/api/UserManagement/update-role-description`,
        payload
      );
      alert("Role description updated!");
      setEditRole(null);
      setEditedRoleName("");
      fetchRoles();
    } catch (error) {
      console.error("Failed to update role description:", error);
      alert("Update failed!");
    }
  };
  const filteredRoles = roleDescriptions.filter((role) =>
    role.roleDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
                <UserCog className="text-[#00d4aa] w-4 h-4" />
              </div>
            </div>
            <div>
              <h1 className="header-title">Role Access Management</h1>
              <p className="header-subtext">Assign modules and screens to roles</p>
            </div>

          </div>

          <div className="flex items-center gap-4">


            {/* Active count */}
            <button className="btn-count">
              <span className="w-2 h-2 rounded-full bg-[#04CF6A]  plus"></span>
              {roleDescriptions.length} Active roles
            </button>


          </div>
        </div>
        <div className="search-toggle">
          {/* Search */}
          <div className="search-box">
            <Search className="absolute left-3 top-2 text-gray-400 w-3 h-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search roles..."
              className="search-input"
            />
          </div>
          {/* Toggle form */}
          <button onClick={() => setShowForm(!showForm)} className="btn-toggle">
            <Plus className="w-3 h-3" />
            {showForm ? "Close Form" : "Create Role"}
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="department-form">
          <h2 className="form-title">Create New Role</h2>

          <div>
            <label className="form-label">Role Description</label>
            <input
              type="text"
              value={roleDescription}
              onChange={handleRoleDescriptionChange}
              placeholder="Enter role description (letters only)..."
              className="form-input"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Only letters, spaces, and hyphens are allowed</p>
          </div>

          {/* Modules */}
          <div className="mt-[15px]">
            <label className="form-label-role ">Select Modules</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {uniqueModules.map((module) => (
                <label
                  key={module}
                  className="flex items-center gap-2 text-gray-200 text-sm "
                >
                  <input
                    type="checkbox"
                    checked={selectedModules.includes(module)}
                    onChange={() => handleModuleCheckboxChange(module)}
                    className="accent-[#00d4aa]"
                  />
                  {module}
                </label>
              ))}
            </div>
          </div>

          {/* Screens */}
          {selectedModules.map((module) => (
            <div key={module}>
              <label className="form-label-role ">Screens for {module}</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(screensPerModule[module] || []).map((screen) => (
                  <label
                    key={screen}
                    className="flex items-center gap-2 text-gray-200 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={
                        selectedScreensPerModule[module]?.includes(screen) || false
                      }
                      onChange={() => handleScreenCheckboxChange(module, screen)}
                      className="accent-[#00d4aa]"
                    />
                    {screen}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm font-medium text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button type="submit" className="btn-toggle">
              Create Role
            </button>
          </div>
        </form>
      )}

      {/* Role List */}
      <div className="bg-[#0D0F12] rounded-xl border border-gray-800 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2 text-teal-400 font-semibold text-lg">
            <UserCog className="w-5 h-5" /> Existing Roles
          </h2>
          <span className="text-sm text-gray-400">
            Total: {roleDescriptions.length} roles
          </span>
        </div>

        <div className="table-wrapper">
          <table className="w-full text-left">
            <thead className="table-head">
              <tr>
                <th className="table-cell">Role Description</th>
                <th className="table-cell-icon color-[#00d4aa] flex gap-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {filteredRoles.length > 0 ? (
                filteredRoles
                  .filter((role) =>
                    role.roleDescription
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((role) => (
                    <tr key={role.roleAccessId} className="table-row">
                      <td className="table-cell-name">
                        {editRole?.roleAccessId === role.roleAccessId ? (
                          <div>
                            <input
                              type="text"
                              value={editedRoleName}
                              onChange={handleEditedRoleNameChange}
                              className="form-input"
                              placeholder="Enter new name (letters only)..."
                            />
                            <p className="text-xs text-gray-500 mt-1">Only letters, spaces, and hyphens are allowed</p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 "> <UserCog className="w-4 h-4 text-teal-400 " />{role.roleDescription}</div>
                        )}
                      </td>
                      <td className="table-cell-icon flex gap-4">
                        {editRole?.roleAccessId === role.roleAccessId ? (
                          <>
                            <button
                              onClick={handleUpdateRole}
                              className="text-teal-400 hover:underline"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditRole(null)}
                              className="text-gray-400 hover:underline"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setEditRole(role);
                              setEditedRoleName(role.roleDescription);
                            }}
                            className="flex items-center gap-1 text-teal-400 hover:underline"
                          >
                            <Pencil className="w-4 h-4" /> Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={2} className="table-cell table-cell-muted text-center">
                    No roles found.
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
          Role Management Guidelines
        </h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-300">
          <p>
            📘 <span className="text-white">Create:</span> Add new role
            under departments
          </p>
          <p>
            🔍 <span className="text-white">Search:</span> Quickly find
            role
          </p>
          <p>
            ✏️ <span className="text-white">Edit:</span> Update designation
            inline
          </p>
          <p>
            ⚠️ <span className="text-white">Validation:</span> Only letters, spaces, and hyphens allowed
          </p>
        </div>
      </div>
    </div>

  );
};

export default RoleAccessForm;