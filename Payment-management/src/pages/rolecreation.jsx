import React, { useEffect, useState } from 'react';
import axios from 'axios';
import backgroundImg from '../assets/background.jpeg';
import usePublicIp from "../hooks/usePublicIp";

const RoleAccessForm = () => {
  const [modulesData, setModulesData] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [screensPerModule, setScreensPerModule] = useState({});
  const [selectedScreensPerModule, setSelectedScreensPerModule] = useState({});
  const [roleDescription, setRoleDescription] = useState('');
  const [roleDescriptions, setRoleDescriptions] = useState([]);
  const username = localStorage.getItem("username");
  const [editRole, setEditRole] = useState(null);
  const [editedRoleName, setEditedRoleName] = useState('');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const ip = usePublicIp();

  useEffect(() => {
    axios
      .get('http://192.168.22.247:7090/api/Export/modules-screens')
      .then((res) => setModulesData(res.data))
      .catch((err) => console.error('Error fetching modules:', err));

    fetchRoles();
  }, []);

  const fetchRoles = () => {
    axios
      .get('http://192.168.22.247:7090/api/Export/role-departments')
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
      .catch((err) => console.error('Error fetching roles:', err));
  };

  const uniqueModules = [...new Set(modulesData.map((item) => item.moduleName))];

  const handleModuleCheckboxChange = (module) => {
    let updatedModules;
    if (selectedModules.includes(module)) {
      updatedModules = selectedModules.filter((m) => m !== module);
    } else {
      updatedModules = [...selectedModules, module];
    }
    setSelectedModules(updatedModules);

    const screensObj = { ...screensPerModule };
    updatedModules.forEach((mod) => {
      if (!screensObj[mod]) {
        const screens = modulesData
          .filter((item) => item.moduleName === mod)
          .map((item) => item.screenDesc);
        screensObj[mod] = screens;
      }
    });

    Object.keys(screensObj).forEach((mod) => {
      if (!updatedModules.includes(mod)) {
        delete screensObj[mod];
      }
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
      alert('Please select at least one screen.');
      return;
    }

    const bulkPayload = {
      roleDescription,
      screenModuleList,
      metadata: {
        ipAddress: ip,
        userAgent: navigator.userAgent,
        headers: 'Sample headers',
        channel: 'web',
        auditMetadata: {
          createdBy: username,
          createdDate: new Date().toISOString(),
          modifiedBy: username,
          modifiedDate: new Date().toISOString(),
          header: {
            additionalProp1: {
              options: { propertyNameCaseInsensitive: true },
              parent: 'string',
              root: 'string',
            },
          },
        },
      },
    };

    try {
      await axios.post(
        'http://192.168.22.247:5229/ums/api/UserManagement/role-access/bulk',
        bulkPayload
      );
      alert('Role access submitted successfully!');
      fetchRoles();
      setSelectedModules([]);
      setScreensPerModule({});
      setSelectedScreensPerModule({});
      setRoleDescription('');
    } catch (error) {
      console.error('Error submitting role access:', error);
      alert('Submission failed!');
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
        headers: 'Sample headers',
        channel: 'web',
        auditMetadata: {
          createdBy: username,
          createdDate: new Date().toISOString(),
          modifiedBy: username,
          modifiedDate: new Date().toISOString(),
          header: {
            additionalProp1: {
              options: { propertyNameCaseInsensitive: true },
              parent: 'string',
              root: 'string',
            },
          },
        },
      },
    };

    try {
      await axios.put(
        'http://192.168.22.247:5229/ums/api/UserManagement/update-role-description',
        payload
      );
      alert('Role description updated!');
      setShowEditDialog(false);
      setEditRole(null);
      setEditedRoleName('');
      fetchRoles();
    } catch (error) {
      console.error('Failed to update role description:', error);
      alert('Update failed!');
    }
  };

  return (
  <div className="min-h-screen bg-[#0c1121] flex items-center justify-center p-6">
  <div className="bg-[#111936] text-white rounded-xl shadow-lg p-6 w-full max-w-7xl">
    <h2 className="text-2xl font-semibold text-center mb-6">Assign Role Access</h2>

    <div className="flex flex-col lg:flex-row gap-6">
      {/* LEFT SIDE - Role Creation Form */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 space-y-6 border border-slate-700 p-4 rounded-lg bg-[#0c1121]"
      >
        <div>
          <label className="block font-medium mb-2">Role Description</label>
          <input
            type="text"
            value={roleDescription}
            onChange={(e) => setRoleDescription(e.target.value)}
            className="w-full px-4 py-2 bg-[#1c2541] border border-slate-600 text-white rounded-md placeholder-gray-400"
            placeholder="Enter role description"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Select Modules</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {uniqueModules.map((module) => (
              <label key={module} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedModules.includes(module)}
                  onChange={() => handleModuleCheckboxChange(module)}
                  className="mr-2 accent-purple-600"
                />
                {module}
              </label>
            ))}
          </div>
        </div>

        {selectedModules.map((module) => (
          <div key={module}>
            <label className="block font-medium mt-4 mb-2">
              Screens for {module}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(screensPerModule[module] || []).map((screen) => (
                <label key={screen} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedScreensPerModule[module]?.includes(screen) || false
                    }
                    onChange={() => handleScreenCheckboxChange(module, screen)}
                    className="mr-2 accent-purple-600"
                  />
                  {screen}
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center">
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition duration-200"
          >
            Submit
          </button>
        </div>
      </form>

      {/* RIGHT SIDE - Role List */}
      <div className="flex-1 border border-slate-700 p-4 rounded-lg bg-[#0c1121]">
        <h3 className="text-lg font-semibold mb-4">Available Roles:</h3>

        <input
          type="text"
          placeholder="Search roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-4 px-4 py-2 bg-[#1c2541] border border-slate-600 text-white rounded-md placeholder-gray-400"
        />

        <ul className="list-disc list-inside space-y-2 max-h-96 overflow-y-auto pr-1">
          {roleDescriptions
            .filter((role) =>
              role.roleDescription.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((role, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <span>{role.roleDescription}</span>
                <button
                  onClick={() => {
                    setEditRole(role);
                    setEditedRoleName(role.roleDescription);
                    setShowEditDialog(true);
                  }}
                  className="ml-4 text-blue-400 hover:underline"
                >
                  Edit
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  </div>

  {/* EDIT MODAL */}
  {showEditDialog && editRole && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#111936] text-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">
          Edit Role: {editRole.roleDescription}
        </h3>
        <input
          type="text"
          value={editedRoleName}
          onChange={(e) => setEditedRoleName(e.target.value)}
          className="w-full px-4 py-2 mb-4 bg-[#1c2541] border border-slate-600 text-white rounded-md"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setShowEditDialog(false)}
            className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateRole}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )}
</div>


  );
};

export default RoleAccessForm;
