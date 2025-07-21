import React, { useEffect, useState } from "react";
import axios from "axios";
import usePublicIp from "../hooks/usePublicIp";
import backgroundImg from "../assets/background.jpeg";

export default function ScreenManagement() {
  const [modules, setModules] = useState([]);
  const [screens, setScreens] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [screenName, setScreenName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const username = localStorage.getItem("username");
  const ip = usePublicIp();
  const userId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

  useEffect(() => {
    fetchModules();
    fetchScreens();
  }, []);

  const fetchModules = async () => {
    try {
      const res = await axios.get("http://192.168.22.247:7090/api/Export/modules");
      setModules(res.data || []);
    } catch (err) {
      console.error("Failed to fetch modules:", err);
    }
  };

  const fetchScreens = async () => {
    try {
      const res = await axios.get("http://192.168.22.247:7090/api/Export/screens");
      setScreens(res.data || []);
    } catch (err) {
      console.error("Failed to fetch screens:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedModuleId || !screenName.trim()) {
      alert("Please select a module and enter screen name");
      return;
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
          header: {
            additionalProp1: {
              options: { propertyNameCaseInsensitive: true },
              parent: "web",
              root: "web",
            },
          },
        },
      },
    };
    try {
      const res = await axios.post(
        "http://192.168.22.247:5229/ums/api/UserManagement/screen_create",
        payload
      );
      alert(res.data.message || "Screen created successfully");
      setScreenName(""); // reset input
      fetchScreens(); // refresh screen list
    } catch (err) {
      console.error("Error creating screen:", err);
      alert("Failed to create screen");
    }
  };

  const handleEditInline = (screen) => {
    setEditId(screen.screenId);
    setEditText(screen.screenDesc); // use the original screenDesc here
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  const handleSaveEdit = async (screenId) => {
    const trimmedEditText = editText.trim();

    if (!trimmedEditText) {
      alert("Screen name cannot be empty");
      return;
    }

    // Find the original screen object by ID
    const originalScreen = screens.find((s) => s.screenId === screenId);

    if (!originalScreen) {
      alert("Original screen not found");
      return;
    }

    // Check if the new name is the same as original (case-insensitive)
    if (trimmedEditText.toLowerCase() === originalScreen.screenDesc.toLowerCase()) {
      alert("Screen already has this value");
      return;
    }

    // Check if the new name already exists on another screen (case-insensitive)
    const duplicateScreen = screens.find(
      (s) =>
        s.screenId !== screenId &&
        s.screenDesc.toLowerCase() === trimmedEditText.toLowerCase()
    );

    if (duplicateScreen) {
      alert("Screen name already exists");
      return;
    }

    // If all good, proceed to update
    const now = new Date().toISOString();

    const payload = {
      screenId,
      newDescription: trimmedEditText,
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
          header: {
            additionalProp1: {
              options: { propertyNameCaseInsensitive: true },
              parent: "web",
              root: "web",
            },
          },
        },
      },
    };

// console.log(payload,"??????????????????")
    try {
      const res = await axios.put(
        "http://192.168.22.247:5229/ums/api/UserManagement/screen_update",
        payload
      );
      alert(res.data.message || "Screen updated");
      handleCancelEdit();
      fetchScreens();
    } catch (err) {
      console.error("Error updating screen:", err);
      alert("Update failed");
    }
  };

  const groupedScreens = modules.reduce((acc, mod) => {
    const moduleScreens = screens.filter(
      (s) =>
        s.moduleId === mod.moduleId &&
        (mod.moduleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.screenDesc?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    if (moduleScreens.length > 0) {
      acc.push({
        moduleName: mod.moduleName,
        screens: moduleScreens,
      });
    }
    return acc;
  }, []);

  return (
  <div className="min-h-screen flex items-start justify-center bg-[#0c1121] p-6">
  <div className="w-full max-w-5xl bg-[#111936] rounded-2xl shadow-lg p-8 text-white">
    <h2 className="text-2xl font-bold text-center mb-6">Create Screen</h2>

    {/* Form */}
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-6">
      <select
        value={selectedModuleId}
        onChange={(e) => setSelectedModuleId(e.target.value)}
        className="flex-1 px-4 py-2 bg-[#1c2541] border border-slate-600 text-white rounded-md"
      >
        <option value="">Select Module</option>
        {modules.map((mod) => (
          <option key={mod.moduleId} value={mod.moduleId}>
            {mod.moduleName}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={screenName}
        onChange={(e) => setScreenName(e.target.value)}
        placeholder="Enter screen name"
        maxLength={50}
        className="flex-1 px-4 py-2 bg-[#1c2541] border border-slate-600 text-white rounded-md placeholder-gray-400"
      />
      <button
        type="submit"
        className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition"
      >
        Submit
      </button>
    </form>

    {/* Search Box */}
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search by module or screen"
      className="w-full mb-6 px-4 py-2 bg-[#1c2541] border border-slate-600 text-white rounded-md placeholder-gray-400"
    />

    {/* Screen List */}
    <div className="max-h-[450px] overflow-y-auto pr-2">
      {groupedScreens.length > 0 ? (
        <div className="space-y-6">
          {groupedScreens.map((group, idx) => (
            <div key={idx} className="bg-[#0f1a37] rounded-md border border-slate-600 p-4">
              <h3 className="text-lg font-semibold mb-2">{group.moduleName}</h3>
              <ul className="space-y-2 list-disc pl-6">
                {group.screens.map((screen) => (
                  <li key={screen.screenId} className="relative">
                    {editId === screen.screenId ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="px-2 py-1 bg-[#1c2541] text-white border border-slate-500 rounded-md w-full max-w-xs"
                        />
                        <button
                          onClick={() => handleSaveEdit(screen.screenId)}
                          className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center pr-2">
                        <span>{screen.screenDesc}</span>
                        <button
                          onClick={() => handleEditInline(screen)}
                          className="text-sm text-blue-400 hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">No screens found.</p>
      )}
    </div>
  </div>
</div>

  );
}
