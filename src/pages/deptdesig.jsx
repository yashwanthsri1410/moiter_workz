import React, { useState, useEffect } from "react";
import axios from "axios";
import backgroundImg from "../assets/background.jpeg";

export default function Signup() {
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://192.168.22.247:5002/api/department/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!department.trim() || !designation.trim()) {
      alert("Please enter both department and designation.");
      return;
    }

    try {
      await axios.post("http://192.168.22.247:5002/api/department/create", {
        department,
        designation,
      });
      alert("Department and Designation created successfully!");
      setDepartment("");
      setDesignation("");
      fetchDepartments();
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Failed to create.");
    }
  };

  const handleDeleteDepartment = async (deptName) => {
    try {
      await axios.delete(`http://192.168.22.247:5002/api/department/department/${deptName}`);
      alert("Department deleted.");
      fetchDepartments();
    } catch (err) {
      console.error("Error deleting department:", err);
    }
  };

  const handleDeleteDesignation = async (designationName) => {
    try {
      await axios.delete(`http://192.168.22.247:5002/api/department/designation/${designationName}`);
      alert("Designation deleted.");
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

        {/* Combined Form */}
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Enter department"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            placeholder="Enter designation"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>

        {/* Department List with Delete Buttons */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Departments</h3>
          {departments.length > 0 ? (
            <ul className="space-y-2">
              {departments.map((dept, index) => (
                <li key={index} className="bg-gray-100 p-4 rounded-md">
                  <p className="font-semibold">Department: {dept.department}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {dept.designations?.map((des, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-white border px-3 py-1 rounded-md"
                      >
                        <span>{des}</span>
                        <button
                          className="ml-2 text-red-600 text-sm hover:underline"
                          onClick={() => handleDeleteDesignation(des)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleDeleteDepartment(dept.department)}
                    className="mt-2 text-sm text-red-600 hover:underline"
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
