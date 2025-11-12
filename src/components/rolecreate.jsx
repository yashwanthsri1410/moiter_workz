import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Pencil, Search, Plus, UserCog, ArrowLeft, X } from "lucide-react";
import usePublicIp from "../hooks/usePublicIp";
import {
  getModulesScreens,
  getAllRoles,
  createRoleAccess,
  updateRoleAccess,
} from "../services/service";
import GuidelinesCard from "./reusable/guidelinesCard";
import { roleGuidelines } from "../constants/guidelines";
import customConfirm from "./reusable/CustomConfirm";

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

  const ip = usePublicIp();
  const username = localStorage.getItem("username");

  // ✅ Input validation
  const validateInput = (input) => /^[a-zA-Z\s-_]*$/.test(input);

  // ✅ Fetch data
  useEffect(() => {
    getModulesScreens()
      .then((res) => setModulesData(res.data))
      .catch((err) => console.error("Error fetching modules:", err));

    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await getAllRoles();

      if (!res?.data || !Array.isArray(res.data)) {
        console.error("Invalid response from getAllRoles:", res);
        return;
      }

      // 🔹 Map roles with grouped screens
      const roleMap = new Map();

      res.data.forEach((item) => {
        const desc = item.roleDescription?.trim() || "";
        const roleAccessId = item.roleAccessId;

        if (!roleMap.has(desc)) {
          roleMap.set(desc, {
            roleDescription: desc,
            roleAccessId,
            screenModuleList: [],
          });
        }

        // Push screen/module data into its role's list
        const roleEntry = roleMap.get(desc);
        roleEntry.screenModuleList.push({
          moduleId: item.moduleId,
          moduleName: item.moduleName,
          screenId: item.screenId,
          screenDesc: item.screenDesc,
        });
      });

      const groupedRoles = Array.from(roleMap.values());
      console.log("✅ Final grouped roles:", groupedRoles);

      setRoleDescriptions(groupedRoles);
    } catch (err) {
      console.error("❌ Error fetching roles:", err);
    }
  };

  // ✅ Extract unique modules
  const uniqueModules = [
    ...new Set(modulesData.map((item) => item.moduleName)),
  ];

  // ✅ Handle input changes
  const handleRoleDescriptionChange = (e) => {
    const value = e.target.value;
    if (validateInput(value)) setRoleDescription(value);
  };

  const handleEditedRoleNameChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s-_]/g, "");
    setEditedRoleName(value);
  };

  // ✅ Handle module checkbox
  const handleModuleCheckboxChange = (module) => {
    const updatedModules = selectedModules.includes(module)
      ? selectedModules.filter((m) => m !== module)
      : [...selectedModules, module];

    setSelectedModules(updatedModules);

    const screensObj = {};
    updatedModules.forEach((mod) => {
      const screens = [
        ...new Set(
          modulesData
            .filter((item) => item.moduleName === mod)
            .map((item) => item.screenDesc)
        ),
      ];
      screensObj[mod] = screens;
    });
    setScreensPerModule(screensObj);

    const updatedSelectedScreens = { ...selectedScreensPerModule };
    Object.keys(updatedSelectedScreens).forEach((mod) => {
      if (!updatedModules.includes(mod)) delete updatedSelectedScreens[mod];
    });
    setSelectedScreensPerModule(updatedSelectedScreens);
  };

  // ✅ Handle screen checkbox
  const handleScreenCheckboxChange = (module, screen) => {
    setSelectedScreensPerModule((prev) => {
      const prevScreens = prev[module] || [];
      const updated = prevScreens.includes(screen)
        ? prevScreens.filter((s) => s !== screen)
        : [...prevScreens, screen];
      return { ...prev, [module]: updated };
    });
  };

  // ✅ Submit new role
  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmAction = await customConfirm(
      "Are you sure you want to create this role?"
    );
    if (!confirmAction) return;

    const screenModuleList = [];
    selectedModules.forEach((module) => {
      const screens = selectedScreensPerModule[module] || [];
      screens.forEach((screen) => {
        screenModuleList.push({
          logId: uuidv4(),
          module,
          screen,
        });
      });
    });

    if (screenModuleList.length === 0) {
      alert("Please select at least one screen.");
      return;
    }

    const bulkPayload = {
      roleDescription,
      screenModuleList: selectedModules.flatMap((module) =>
        (selectedScreensPerModule[module] || []).map((screen) => ({
          module,
          screen,
        }))
      ),
    };
    console.log(bulkPayload);

    try {
      await createRoleAccess(bulkPayload);
      alert("✅ Role access created successfully!");
      fetchRoles();
      resetForm();
    } catch (error) {
      console.error("Error submitting role access:", error);
      alert("❌ Submission failed!");
    }
  };
  // ✅ Edit role and prefill selections
  const handleEditClick = (role) => {
    console.log("Editing role:", role);

    setEditRole(role);
    setEditedRoleName(role.roleDescription);
    setRoleDescription(role.roleDescription);

    // 🔹 Extract module names from role data
    const selectedMods = [
      ...new Set(role.screenModuleList.map((item) => item.moduleName)),
    ];
    setSelectedModules(selectedMods);

    // 🔹 Build available screens per module (from modulesData)
    const screensObj = {};
    selectedMods.forEach((mod) => {
      screensObj[mod] = [
        ...new Set(
          modulesData
            .filter((item) => item.moduleName === mod)
            .map((item) => item.screenDesc)
        ),
      ];
    });
    setScreensPerModule(screensObj);

    // 🔹 Mark which screens are selected
    const selectedScreensObj = {};
    role.screenModuleList.forEach((item) => {
      const mod = item.moduleName;
      const scr = item.screenDesc;

      if (!selectedScreensObj[mod]) {
        selectedScreensObj[mod] = [];
      }
      selectedScreensObj[mod].push(scr);
    });
    setSelectedScreensPerModule(selectedScreensObj);

    // 🔹 Show form
    setShowForm(true);
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    if (!editRole) return;

    const payload = {
      roleDescription: editedRoleName,
      roleId: editRole.roleAccessId,
      screenModuleList: Object.entries(selectedScreensPerModule).flatMap(
        ([module, screens]) =>
          screens.map((screen) => ({
            module,
            screen,
          }))
      ),
    };
    console.log(payload);

    console.log("🔹 Update Payload:", payload);

    try {
      await updateRoleAccess(payload); // your service adds logId
      alert("✅ Role updated successfully!");
      fetchRoles(); // reload updated data
      resetForm(); // clear form fields
    } catch (error) {
      console.error("❌ Failed to update role:", error);
      alert("❌ Update failed!");
    }
  };

  // ✅ Reset form
  const resetForm = () => {
    setSelectedModules([]);
    setScreensPerModule({});
    setSelectedScreensPerModule({});
    setRoleDescription("");
    setEditRole(null);
    setEditedRoleName("");
    setShowForm(false);
  };

  const filteredRoles = roleDescriptions.filter((role) =>
    role.roleDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // console.log(filteredRoles);

  return (
    <div>
      {/* Header */}
      <div className="form-header">
        <div className="back-title flex justify-between items-center">
          <button className="header-icon-btn" onClick={onBack}>
            <ArrowLeft className="primary-color w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <UserCog className="primary-color w-5 h-5" />
            <h1 className="text-lg text-white">Role Access Management</h1>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) resetForm();
            }}
            className="btn-toggle flex items-center justify-center gap-1"
          >
            {showForm ? (
              <>
                <X className="w-3 h-3" /> Close
              </>
            ) : (
              <>
                <Plus className="w-3 h-3" /> Create Role
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mt-4 flex gap-2">
        <Search className="w-4 h-4 text-gray-400 mt-1" />
        <input
          type="text"
          placeholder="Search roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input w-[300px]"
        />
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={editRole ? handleUpdateRole : handleSubmit}
          className="department-form mt-6"
        >
          <div className="mb-4">
            <label className="form-label">Role Description</label>
            <input
              type="text"
              value={editRole ? editedRoleName : roleDescription}
              onChange={
                editRole
                  ? handleEditedRoleNameChange
                  : handleRoleDescriptionChange
              }
              placeholder="Enter role description..."
              className="form-input"
              required
            />
          </div>

          {/* Modules */}
          <div className="mt-4">
            <label className="form-label-role text-sm">Select Modules</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {uniqueModules.map((module, index) => (
                <label
                  key={`${module}-${index}`}
                  className="flex items-center gap-2 text-gray-200 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedModules.includes(module)}
                    onChange={() => handleModuleCheckboxChange(module)}
                    className="accent-[var(--primary-color)]"
                  />
                  {module}
                </label>
              ))}
            </div>
          </div>

          {/* Screens */}
          {selectedModules.map((module) => (
            <div key={module}>
              <label className="form-label-role text-sm mt-3">
                Screens for {module}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Array.from(new Set(screensPerModule[module] || [])).map(
                  (screen, idx) => (
                    <label
                      key={`${module}-${screen}-${idx}`}
                      className="flex items-center gap-2 text-gray-200 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={
                          selectedScreensPerModule[module]?.includes(screen) ||
                          false
                        }
                        onChange={() =>
                          handleScreenCheckboxChange(module, screen)
                        }
                        className="accent-[var(--primary-color)]"
                      />
                      {screen}
                    </label>
                  )
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-end mt-4 gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button type="submit" className="btn-toggle">
              {editRole ? "Update Role" : "Create Role"}
            </button>
          </div>
        </form>
      )}

      {/* Role list */}
      <div className="table-card-bg mt-6 rounded-xl border p-4">
        <div className="flex justify-between mb-3">
          <h3 className="text-white text-base flex items-center gap-2">
            <UserCog className="w-4 h-4 primary-color" /> Existing Roles
          </h3>
          <span className="text-sm text-gray-400">
            Total: {roleDescriptions.length} roles
          </span>
        </div>

        <table className="w-full text-sm text-gray-300">
          <thead>
            <tr>
              <th className="text-left p-2">Role Description</th>
              <th className="text-right p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.length > 0 ? (
              filteredRoles.map((role) => (
                <tr key={role.roleAccessId}>
                  <td className="p-2">{role.roleDescription}</td>
                  <td className="p-2 text-right">
                    <button
                      onClick={() => handleEditClick(role)}
                      className="primary-color flex items-center gap-1"
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center text-gray-500 p-4">
                  No roles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <GuidelinesCard
        title="Role Management Guidelines"
        guidelines={roleGuidelines}
      />
    </div>
  );
};

export default RoleAccessForm;
