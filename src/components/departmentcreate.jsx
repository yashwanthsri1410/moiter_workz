import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Building2, Pencil, Trash2, Search, Plus } from "lucide-react";

export default function DepartmentCreation({ onBack }) {
  const [departmentName, setDepartmentName] = useState("");
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDeptId, setEditingDeptId] = useState(null);
  const [newDeptName, setNewDeptName] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Fetch departments
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

  // Create department
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!departmentName.trim()) return alert("Please enter a department name.");

    const exists = departments.some(
      (d) => d.deptName.toLowerCase() === departmentName.trim().toLowerCase()
    );
    if (exists) return alert("Department already exists.");

    try {
      await axios.post(
        "http://192.168.22.247:5229/ums/api/UserManagement/department_create",
        { deptName: departmentName }
      );
      setDepartmentName("");
      setShowForm(false);
      fetchDepartments();
    } catch (err) {
      console.error("Failed to create department:", err);
      alert("Error occurred while creating department.");
    }
  };

  // Update department
  const handleUpdate = async (deptId) => {
    if (!newDeptName.trim()) return alert("Enter new name");

    try {
      await axios.put(
        "http://192.168.22.247:5229/ums/api/UserManagement/department_update",
        { deptId, newName: newDeptName }
      );
      setEditingDeptId(null);
      setNewDeptName("");
      fetchDepartments();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Error updating department.");
    }
  };

  // Filtered list
  const filteredDepartments = departments.filter((d) =>
    d.deptName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="department-page">
      {/* Header */}
      <div className="form-header">
        <div className="back-title">
          <div className="header-left">
            <div className="flex items-center gap-[10px]">
              <button className="header-icon-btn" onClick={onBack}>
                <ArrowLeft className="text-[#00d4aa] w-4 h-4" />
              </button>

              <div className="header-icon-box">
                <Building2 className="text-[#00d4aa] w-4 h-4" />
              </div>
            </div>
            <div>
              <h1 className="header-title">Department Management</h1>
              <p className="header-subtext">Create and manage organizational departments</p>
            </div>

          </div>

          <div className="flex items-center gap-4">


            {/* Active count */}
            <button className="btn-count">
              <span className="w-2 h-2 rounded-full bg-[#04CF6A]  plus"></span>
              {departments.length} Active Departments
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
              placeholder="Search departments..."
              className="search-input"
            />
          </div>
          {/* Toggle form */}
          <button onClick={() => setShowForm(!showForm)} className="btn-toggle">
            <Plus className="w-3 h-3" />
            {showForm ? "Close Form" : "Create Department"}
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="department-form">
          <h2 className="form-title">Create New Department</h2>

          <div>
            <label className="form-label">Department Name</label>
            <input
              type="text"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              placeholder="Enter department name..."
              className="form-input"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setShowForm(false)} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-toggle">Create Department</button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="table-card">
        <div className="table-header">
          <p className="table-title"><Building2 className="w-5 h-5" /> Existing Departments</p>
          <span className="table-subtext">
            Total: {filteredDepartments.length} departments
          </span>
        </div>

        <div className="table-wrapper">
          <table className="w-full text-left">
            <thead className="table-head">
              <tr>
                <th className="table-cell">Department Name</th>
                <th className="table-cell">Created Date</th>
                <th className="table-cell-icon color-[#00d4aa]  flex gap-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((dept) => (
                  <tr key={dept.deptId} className="table-row">
                    <td className="table-cell-name">
                      {editingDeptId === dept.deptId ? (
                        <input
                          type="text"
                          value={newDeptName}
                          onChange={(e) => setNewDeptName(e.target.value)}
                          className="form-input"
                        />
                      ) : (
                       
                        <div className="flex items-center gap-1 "> <Building2 className="w-4 h-4 text-teal-400 " />{ dept.deptName}</div> 
                      )}
                    </td>
                    <td className="table-cell table-cell-muted">
                      {dept.createdDate?.split("T")[0]}
                    </td>
                    <td className="table-cell-icon flex gap-4 ">
                      {editingDeptId === dept.deptId ? (
                        <>
                          <button onClick={() => handleUpdate(dept.deptId)} className="text-teal-400 hover:underline">
                            Save
                          </button>
                          <button onClick={() => { setEditingDeptId(null); setNewDeptName(""); }} className="text-gray-400 hover:underline">
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setEditingDeptId(dept.deptId); setNewDeptName(dept.deptName); }} className="text-[#00d4aa] hover:underline flex items-center gap-1">
                            <Pencil className="w-4 h-4" /> Edit
                          </button>
                          {/* <button className="text-red-500 hover:underline flex items-center gap-1">
                            <Trash2 className="w-4 h-4" /> Delete
                          </button> */}
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="table-cell table-cell-muted text-center">
                    No departments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guidelines */}
      <div className="guidelines-card">
        <h3 className="guidelines-title">Department Management Guidelines</h3>
        <div className="guidelines-grid">
          <p>📘 <span>Create:</span> Add new departments</p>
          <p>🔍 <span>Search:</span> Find departments quickly</p>
        </div>
        <div className="guidelines-grid">
          <p>✏️ <span >Edit:</span> Modify department names inline</p>
          <p>🗑️ <span>Delete:</span> Remove unused departments</p>

        </div>
      </div>
    </div>
  );
}
