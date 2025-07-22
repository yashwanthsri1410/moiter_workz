import React, { useState, useEffect } from "react";
import axios from "axios";
import backgroundImg from "../assets/background.jpeg";
import usePublicIp from "../hooks/usePublicIp";

export default function Signup() {
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [departments, setDepartments] = useState([]);

  const ip = usePublicIp();
  const baseUrl = "http://192.168.22.247:7227/api/CombinedDetails";

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${baseUrl}/departments`);
      const grouped = groupByDepartment(res.data);
      
      // console.log("?????",res)
      setDepartments(grouped);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  const groupByDepartment = (data) => {
    const grouped = {};
    data.forEach((item) => {
      if (!item.deptName?.trim()) return; // Skip empty dept
      if (!grouped[item.deptId]) {
        grouped[item.deptId] = {
          deptId: item.deptId,
          deptName: item.deptName,
          designations: [],
        };
      }
      if (item.designationName?.trim()) {
        grouped[item.deptId].designations.push({
          designationId: item.designationId,
          designationName: item.designationName,
        });
      }
    });
    return Object.values(grouped);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!department.trim() || !designation.trim()) {
      alert("Please enter both department and designation.");
      return;
    }

    const currentDate = new Date().toISOString();
    const auditUserId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

    const payload = {
      deptId: 0,
      deptName: department,
      designationId: 0,
      designationName: designation,
      metadata: {
        ipAddress: ip,
        userAgent: navigator.userAgent,
        //  headers: headersError ?  headersError : JSON.stringify({ "content-type": "application/json" }),
        headers: "N/A",
        channel: "web",
        auditMetadata: {
          createdBy: auditUserId,
          createdDate: currentDate,
          modifiedBy: auditUserId,
          modifiedDate: currentDate,
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
      await axios.post(`http://192.168.22.247/us/api/Department/create`, payload);
      alert("Department and Designation created successfully!");
      setDepartment("");
      setDesignation("");
      fetchDepartments();
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Failed to create department/designation.");
    }
  };

  const handleDeleteDepartment = async (deptName) => {
    try {
      await axios.delete(`http://192.168.22.247/us/api/Department/department/${deptName}`);
      alert("Department deleted.");
      fetchDepartments();
    } catch (err) {
      console.error("Error deleting department:", err);
    }
  };

  const handleDeleteDesignation = async (designationName, deptName) => {
    try {
      const dept = departments.find((d) => d.deptName === deptName);
      if (!dept) return;

      if (dept.designations.length === 1) {
        await axios.delete(`http://192.168.22.247/us/api/Department/department/${deptName}`);
        alert("Only designation deleted, so department also removed.");
      } else {
        await axios.delete(`http://192.168.22.247/us/api/Department/designation/${designationName}`);
        alert("Designation deleted.");
      }

      fetchDepartments();
    } catch (err) {
      console.error("Error deleting designation:", err);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start bg-cover bg-center relative p-6"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />
      <div className="relative z-10 w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Add Department & Designation
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-4 mb-4"
        >
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Enter department"
            maxLength={25}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            placeholder="Enter designation"
            maxLength={25}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>

        <div>
          <h3 className="text-lg font-semibold mb-2">Departments</h3>
          {departments.length > 0 ? (
            <ul className="space-y-4">
              {departments.map((dept) => (
                <li
                  key={dept.deptId}
                  className="bg-gray-100 p-4 rounded-md shadow-sm"
                >
                  <p className="font-semibold text-blue-800">
                    Department: {dept.deptName}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {dept.designations?.map((des) => (
                      <div
                        key={des.designationId}
                        className="flex items-center justify-between bg-white border px-3 py-1 rounded-md shadow-sm"
                      >
                        <span>{des.designationName}</span>
                        <button
                          className="ml-2 text-red-600 text-sm hover:underline"
                          onClick={() =>
                            handleDeleteDesignation(
                              des.designationName,
                              dept.deptName
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleDeleteDepartment(dept.deptName)}
                    className="mt-3 text-sm text-red-600 hover:underline"
                  >
                    Delete Department
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No departments available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
