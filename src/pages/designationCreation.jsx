import React, { useEffect, useState } from "react";
import axios from "axios";
import usePublicIp from "../hooks/usePublicIp";
import {
  PencilIcon,
  Search
} from "lucide-react";

export default function CreateDesignationForm() {
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [designationDesc, setDesignationDesc] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [headersError, setheadersError] = useState("");

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const ip = usePublicIp();
  const userId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
  const username = localStorage.getItem("username");
  useEffect(() => {
    fetchDepartments();
    fetchDesignations();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://192.168.22.247:7090/api/Export/simple-departments");
      setDepartments(res.data || []);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    }
  };

  const fetchDesignations = async () => {
    try {
      const res = await axios.get("http://192.168.22.247:7090/api/Export/designations");
      setDesignations(res.data || []);
    } catch (err) {
      console.error("Failed to fetch designations:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDeptId || !designationDesc.trim()) {
      alert("Please select department and enter designation");
      return;
    }

    const now = new Date().toISOString();

    const payload = {
      deptName: selectedDeptId,
      designationName: designationDesc.trim(),
      metadata: {
        ipAddress: ip,
        userAgent: navigator.userAgent,
        headers: headersError ? headersError : JSON.stringify({ "content-type": "application/json" }),
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
              root: "web"
            }
          }
        }
      }
    };

    try {
      const res = await axios.post(
        "http://192.168.22.247:5229/ums/api/UserManagement/designation_create",
        payload
      );
      alert(res.data.message || "Designation created");
      setDesignationDesc("");
      fetchDesignations();
    } catch (err) {
      console.error("Error creating designation:", err);
      alert("Creation failed");
    }
  };

  const handleEditInline = (desig) => {
    setEditId(desig.designationId);
    setEditText(desig.designationDesc);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  const handleSaveEdit = async (designationId) => {
    if (!editText.trim()) {
      alert("Designation cannot be empty");
      return;
    }

    const now = new Date().toISOString();

    const payload = {
      designationId: designationId,
      newDescription: editText.trim(),
      metadata: {
        ipAddress: ip,
        userAgent: navigator.userAgent,
        headers: headersError ? headersError : JSON.stringify({ "content-type": "application/json" }),
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
            additionalProp2: {
              options: { propertyNameCaseInsensitive: true },
              parent: "web",
              root: "web",
            },
            additionalProp3: {
              options: { propertyNameCaseInsensitive: true },
              parent: "web",
              root: "web",
            },
          },
        },
      },
    };
    try {
      const res = await axios.put(
        "http://192.168.22.247:5229/ums/api/UserManagement/designation_update",
        payload
      );
      alert(res.data.message || "Designation updated");
      handleCancelEdit();
      fetchDesignations();
    } catch (err) {
      console.error("Error updating designation:", err);

      setheadersError("Error updating designation:" + err);
      alert("Update failed");
    }
  };

  const groupedDesignations = departments.reduce((acc, dept) => {
    const deptDesignations = designations.filter((d) =>
      d.deptId === dept.deptId &&
      (dept.deptName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.designationDesc.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    if (deptDesignations.length > 0) {
      acc.push({
        deptName: dept.deptName,
        designations: deptDesignations,
      });
    }
    return acc;
  }, []);

  return (
   <div
  className="min-h-screen flex items-start justify-center bg-[#060e1f] p-6"
>
  <div className="relative z-10 w-full max-w-5xl bg-[#0a132f] text-white rounded-2xl shadow-lg p-8">
    <h2 className="text-2xl font-bold text-center mb-6 text-white">
      Create Designation
    </h2>

    {/* Form */}
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-6">
      <select
        value={selectedDeptId}
        onChange={(e) => setSelectedDeptId(e.target.value)}
        className="flex-1 px-4 py-2 bg-[#131c3a] text-white border border-gray-600 rounded-md placeholder-gray-400"
      >
        <option value="">Select Department</option>
        {departments.map((dept) => (
          <option key={dept.deptId} value={dept.deptName}>
            {dept.deptName}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={designationDesc}
        onChange={(e) => setDesignationDesc(e.target.value)}
        placeholder="Enter designation"
        maxLength={50}
        className="flex-1 px-4 py-2 bg-[#131c3a] text-white border border-gray-600 rounded-md placeholder-gray-400"
      />
      <button
        type="submit"
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition text-sm"
      >
        Submit
      </button>
    </form>

    {/* Search Box */}
   <div className="relative w-full mb-6">
  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
    <Search className="w-4 h-4" />
  </span>
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search by department or designation"
    className="w-full pl-10 pr-4 py-2 bg-[#131c3a] text-white border border-gray-600 rounded-md placeholder-gray-400"
  />
</div>

    {/* Designation List */}
    <div className="max-h-[450px] overflow-y-auto space-y-6">
      {groupedDesignations.length > 0 ? (
        groupedDesignations.map((group, idx) => (
          <div
            key={idx}
            className="bg-[#0f1a37] border border-[#1d2b4f] rounded-md p-4"
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              {group.deptName}
            </h3>
            <ul className="space-y-2 list-disc pl-6">
              {group.designations.map((desig) => (
                <li key={desig.designationId} className="relative">
                  {editId === desig.designationId ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="px-2 py-1 bg-[#1e2b4f] text-white border border-gray-600 rounded-md w-full max-w-xs text-sm"
                      />
                      <button
                        onClick={() => handleSaveEdit(desig.designationId)}
                        className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center pr-2">
                      <span>{desig.designationDesc}</span>
                      <button
                        onClick={() => handleEditInline(desig)}
                        className="text-blue-400 hover:underline text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-center">No designations found.</p>
      )}
    </div>
  </div>
</div>

  );
}
