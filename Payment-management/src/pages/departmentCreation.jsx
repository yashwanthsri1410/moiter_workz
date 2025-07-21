import React, { useEffect, useState } from "react";
import axios from "axios";
import usePublicIp from "../hooks/usePublicIp";
import {
  PencilIcon,
  Search
} from "lucide-react";

export default function DepartmentCreation() {
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDeptId, setEditingDeptId] = useState(null);
  const [newDeptName, setNewDeptName] = useState("");
  const [headersError, setheadersError] = useState("");
  const ip = usePublicIp();
  const username = localStorage.getItem("username");
  const fetchDepartments = async () => {
    try {
      const res = await axios.get(
        "http://192.168.22.247:7090/api/Export/simple-departments"
      );
      setDepartments(res.data || []);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!department.trim()) {
      alert("Please enter a department name.");
      return;
    }

    const nameExists = departments.some(
      (d) => d.deptName.toLowerCase() === department.trim().toLowerCase()
    );

    if (nameExists) {
      alert("Department already exists.");
      return;
    }

    const now = new Date().toISOString();
    const userId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

    const payload = {
      deptName: department,
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
      const res = await axios.post(
        "http://192.168.22.247:5229/ums/api/UserManagement/department_create",
        payload
      );

      const msg = res?.data?.message;
      if (msg?.toLowerCase().includes("already exists")) {
        alert(msg);
      } else {
        alert("Department created successfully!");
        setDepartment("");
        fetchDepartments();
      }
    } catch (err) {
      console.error("Failed to create department:", err);

      setheadersError(" Error occurred while creating department." + err);
      alert("Error occurred while creating department.");
    }
  };

  const handleUpdate = async (deptId) => {
    if (!newDeptName.trim()) {
      alert("Please enter the new department name.");
      return;
    }

    const originalDept = departments.find((d) => d.deptId === deptId);
    if (!originalDept) {
      alert("Department not found.");
      return;
    }

    const newNameLower = newDeptName.trim().toLowerCase();

    // 1. No change
    if (newNameLower === originalDept.deptName.toLowerCase()) {
      alert("No changes detected. The department name is already the same.");
      setEditingDeptId(null);
      setNewDeptName("");
      return;
    }

    // 2. Name already exists in another department
    const nameExistsInAnother = departments.some(
      (d) =>
        d.deptId !== deptId &&
        d.deptName.trim().toLowerCase() === newNameLower
    );

    if (nameExistsInAnother) {
      alert("A department with this name already exists. Please choose a different name.");
      return;
    }

    const now = new Date().toISOString();
    const userId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

    const payload = {
      deptId,
      newName: newDeptName,
      metadata: {
        ipAddress: ip,
        userAgent: navigator.userAgent,
        headers: "N/A",
        channel: "web",
        auditMetadata: {
          createdBy: userId,
          createdDate: now,
          modifiedBy: userId,
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
      const response = await axios.put(
        "http://192.168.22.247:5229/ums/api/UserManagement/department_update",
        payload
      );

      if (response.data.message?.toLowerCase().includes("updated")) {
        alert("Department updated successfully.");
        setEditingDeptId(null);
        setNewDeptName("");
        fetchDepartments();
      } else {
        alert("Failed to update department. " + (response.data.message || ""));
      }
    } catch (error) {
      console.error("API error:", error);
      alert("Something went wrong.");
    }
  };

  const filteredDepartments = departments.filter((d) =>
    d.deptName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#060e1f] p-6 text-white">
      <div className="max-w-6xl mx-auto bg-[#0a132f] p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Department Management</h2>
          <button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
          >
            Create
          </button>
        </div>

        {/* Input field for department */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Enter department name"
            maxLength={50}
            className="flex-1 px-4 py-2 rounded-md bg-[#131c3a] border border-gray-600 placeholder-gray-400"
          />
        </div>

        {/* Search bar */}
        <div className="flex items-center justify-start mb-4 space-x-2">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search department..."
              className="w-64 pl-10 pr-4 py-2 rounded-md bg-[#131c3a] border border-gray-600 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#0f1a37] text-left text-gray-400">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 ">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((item, idx) => (
                  <tr key={`${item.deptId}-${idx}`} className="border-t border-[#1d2b4f] hover:bg-[#131c3a]">
                    <td className="py-3 px-4">#{item.deptId}</td>
                    <td className="py-3 px-4">
                      {editingDeptId === item.deptId ? (
                        <input
                          type="text"
                          value={newDeptName}
                          onChange={(e) => setNewDeptName(e.target.value)}
                          className="bg-[#1e2b4f] text-white px-2 py-1 rounded-md border border-gray-600"
                        />
                      ) : (
                        item.deptName
                      )}
                    </td>
                    <td className="py-3 px-4 ">
                      {editingDeptId === item.deptId ? (
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleUpdate(item.deptId)}
                            className="text-green-500 hover:underline"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingDeptId(null);
                              setNewDeptName('');
                            }}
                            className="text-gray-400 hover:underline"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingDeptId(item.deptId);
                            setNewDeptName(item.deptName);
                          }}
                          className="text-blue-500 hover:underline"
                        ><div className="flex gap-[10px]"><PencilIcon className="w-4 h-4 text-gray-400 " />Edit</div>
                        </button>

                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center text-gray-500 py-6">
                    No departments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );


}
