import React, { useEffect, useState } from "react";
import axios from "axios";
import usePublicIp from "../hooks/usePublicIp";
import Select from "react-select";
import {
  ArrowLeft,
  User,
  Monitor,
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  EyeIcon,
  Filter,
} from "lucide-react";
import "../styles/styles.css";

const EmployeeCreationForm = ({ onBack }) => {
  const username = localStorage.getItem("username");
  const [empId, setEmpId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusId] = useState(1);
  const [userType, setusertype] = useState();
  const [createdBy] = useState(username);
  const [deptId, setDeptId] = useState("");
  const [designationId, setDesignationId] = useState("");
  const [roleAccessId, setRoleAccessId] = useState("");
  const [selectedRoleScreens, setSelectedRoleScreens] = useState({});
  const [accessList, setAccessList] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [errors, setErrors] = useState({});
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const ip = usePublicIp();
  const userAgent = navigator.userAgent;
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const itemsPerPage = 8;
  useEffect(() => {
    const generatedId = Date.now().toString().slice(-6); // last 6 digits of timestamp
    setEmpId(generatedId);
  }, []);
  // 🔹 Sync selectedEmployee → form
  useEffect(() => {
    if (selectedEmployee) {
      setEmpId(selectedEmployee.empId || "");
      setName(selectedEmployee.userName || "");
      setEmail(selectedEmployee.email || "");
      setDeptId(selectedEmployee.deptName?.toString() || "");
      setDesignationId(selectedEmployee.designationDesc?.toString() || "");
      setRoleAccessId(selectedEmployee.roleAccessId?.toString() || "");
      setusertype(selectedEmployee.userType?.toString() || "");
      setPassword(""); // don't autofill password for security

      // ✅ Auto-load role screens if role is already assigned
      if (selectedEmployee.roleAccessId) {
        const filtered = roleData.filter(
          (r) =>
            r.roleAccessId.toString() ===
            selectedEmployee.roleAccessId.toString()
        );

        const grouped = {};
        filtered.forEach(({ moduleName, screenDesc }) => {
          if (!grouped[moduleName]) grouped[moduleName] = [];
          if (!grouped[moduleName].includes(screenDesc))
            grouped[moduleName].push(screenDesc);
        });

        setSelectedRoleScreens(grouped);
      }
    }
  }, [selectedEmployee, roleData]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}:7090/api/Export/role-departments`)
      .then((res) => setAccessList(res.data))
      .catch((err) => console.error("Error fetching access list:", err));

    axios
      .get(`${API_BASE_URL}:7090/api/Export/role-module-screen`)
      .then((res) => setRoleData(res.data))
      .catch((err) => console.error("Error fetching role data:", err));
    axios
      .get(`${API_BASE_URL}:7090/fes/api/Export/pending-employees`)
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);
  // 🔹 Select employee → sync form
  // ✅ Filter + Search logic
  const filteredConfigurations = employees.filter((cfg) => {
    const query = searchQuery.toLowerCase();
    return Object.values(cfg).some(
      (value) => value && value.toString().toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredConfigurations.length / itemsPerPage);

  const paginatedConfigurations = filteredConfigurations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusLabel = (value) => {
    switch (value) {
      case 0:
        return "Approved";
      case 1:
        return "Pending";
      case 2:
        return "Disapproved";
      case 3:
        return "Recheck";
      default:
        return "Unknown";
    }
  };
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).+$/;
    const isRoleLength = Object.keys(selectedRoleScreens).length === 0;
    if (!name) newErrors.name = "Enter user name";
    else if (name.length > 25) newErrors.name = "Name max 25 characters";
    if (!email) newErrors.email = "Enter Email Id";
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email";
    if (!/^[0-9]+$/.test(empId))
      newErrors.empId = "Employee ID must be numeric";
    if (!password) newErrors.password = "Enter password";
    else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must contain at least one uppercase, one lowercase, one number, and one special character.";
    }
    if (!deptId) newErrors.deptId = "Enter Department";
    if (!designationId) newErrors.designationId = "Enter Designation";
    if (!userType) newErrors.userType = "Enter User Type";
    if (isRoleLength) newErrors.selectedRoleScreens = "Enter Role";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const timestamp = new Date().toISOString();

    const payload = {
      empId: `Emp${empId}`,
      deptId: parseInt(deptId),
      designationId: parseInt(designationId),
      name,
      email,
      password,
      statusId,
      roleAccessId: parseInt(roleAccessId),
      createdBy,
      userType: parseInt(userType),
      metadata: {
        ipAddress: ip || "0.0.0.0",
        userAgent,
        headers: "custom-header",
        channel: "web",
        auditMetadata: {
          createdBy: username,
          createdDate: timestamp,
          modifiedBy: username,
          modifiedDate: timestamp,
          header: {
            additionalProp1: {
              options: { propertyNameCaseInsensitive: true },
              parent: "user",
              root: "root1",
            },
          },
        },
      },
    };

    try {
      if (selectedEmployee) {
        await axios.put(
          `${API_BASE_URL}/ums/api/UserManagement/updateEmployee/${selectedEmployee.empId}`,
          payload,
          { headers: { "Content-Type": "application/json" } }
        );
        alert("✅ Employee updated successfully");
      } else {
        await axios.post(
          `${API_BASE_URL}/ums/api/UserManagement/createEmployee`,
          payload,
          { headers: { "Content-Type": "application/json" } }
        );
        alert("✅ Employee created successfully");
      }
    } catch (err) {
      console.error("❌ API error:", err.response?.data || err.message);
      alert("❌ Failed. See console.");
    }
  };

  const uniqueDepts = Array.from(
    new Map(accessList.map((item) => [item.deptId, item])).values()
  );

  const uniqueDesigns = Array.from(
    new Map(
      accessList
        .filter((item) => item.deptName.toString() === deptId)
        .map((item) => [item.designationId, item])
    ).values()
  );

  const uniqueRoles = Array.from(
    new Map(roleData.map((item) => [item.roleAccessId, item])).values()
  ).map((role) => ({
    value: role.roleAccessId.toString(),
    label: role.roleDescription,
  }));

  const handleRoleChange = (selectedOption) => {
    if (!selectedOption) {
      setRoleAccessId("");
      setSelectedRoleScreens({});
      return;
    }

    const roleId = selectedOption.value;
    setRoleAccessId(roleId);

    const filtered = roleData.filter(
      (r) => r.roleAccessId.toString() === roleId
    );
    const grouped = {};

    filtered.forEach(({ moduleName, screenDesc }) => {
      if (!grouped[moduleName]) grouped[moduleName] = [];
      if (!grouped[moduleName].includes(screenDesc))
        grouped[moduleName].push(screenDesc);
    });

    setSelectedRoleScreens(grouped);
  };
  console.log(uniqueDesigns);

  console.log(accessList);
  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="flex items-center space-x-3">
          <button className="icon-btn" onClick={onBack}>
            <ArrowLeft className="text-teal-400" size={18} />
          </button>
          <button className="icon-btn">
            <User className="text-teal-400" size={18} />
          </button>
          <div>
            <h1 className="top-title">User Management</h1>
            <p className="top-subtitle">Create new team members</p>
          </div>
        </div>

        <div className="badge">
          <span className="badge-dot"></span>
          <span className="badge-text">4 Users type</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-heading">
          <h2 className="form-title">User Creation</h2>
          <p className="form-subtitle">
            Add new team member with role-based access
          </p>
        </div>

        {/* Full Name */}
        <div className="label-input">
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            placeholder="Enter user's full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="label-input">
          <label className="form-label">Email Address *</label>
          <input
            type="email"
            placeholder="Enter user's email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />
          <p className="helper-text">Password will be sent to this email</p>
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>
        {/* ✅ Password Input */}
        <div className="label-input">
          <label className="form-label">Password</label>
          <input
            type="password"
            placeholder="Create user's password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>
        {/* Department */}
        <div className="label-input">
          <label className="form-label">Department *</label>
          <select
            value={deptId}
            onChange={(e) => {
              setDeptId(e.target.value);
              setDesignationId("");
            }}
            className="form-select"
          >
            <option value="">Select department</option>
            {uniqueDepts.map((d) => (
              <option key={d.deptId} value={d.deptName}>
                {d.deptName}
              </option>
            ))}
          </select>
          {errors.deptId && <p className="error-text">{errors.deptId}</p>}
        </div>

        {/* Designation */}
        <div className="label-input">
          <label className="form-label">Designation *</label>
          <select
            value={designationId}
            onChange={(e) => setDesignationId(e.target.value)}
            className="form-select"
            disabled={!deptId}
          >
            <option value="">Select designation</option>
            {uniqueDesigns.map((d) => (
              <option key={d.designationId} value={d.designationDesc}>
                {d.designationDesc}
              </option>
            ))}
          </select>
        </div>

        {/* Role */}
        <div className="label-input">
          <label className="form-label">Role *</label>
          <Select
            className="react-select-container"
            classNamePrefix="react-select"
            options={uniqueRoles}
            onChange={handleRoleChange}
            placeholder="Select role"
            isClearable
            value={
              uniqueRoles.find((role) => role.value === roleAccessId) || null
            }
            styles={{
              control: (base, state) => ({
                ...base,
                background: "#10141a", // background color
                color: "#fff", // text color
                borderColor: state.isFocused ? "#134e4a" : "#134e4a",
                boxShadow: state.isFocused ? "0 0 0 1px #134e4a" : "none",
                "&:hover": {
                  borderColor: "#134e4a",
                },
              }),
              menu: (base) => ({
                ...base,
                background: "#10141a", // dropdown background
                color: "#fff",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? "#10141a"
                  : state.isFocused
                  ? "#10141a"
                  : "#10141a",
                color: "#fff",
                cursor: "pointer",
              }),
              singleValue: (base) => ({
                ...base,
                color: "#fff",
              }),
              placeholder: (base) => ({
                ...base,
                color: "#94a3b8",
              }),
            }}
          />
        </div>
        {Object.keys(selectedRoleScreens).length > 0 && (
          <div className="accessible-screens">
            <div className="accessible-header">
              <Monitor className="icon" size={16} />
              <label>Accessible Screens</label>
            </div>

            <div className="accessible-box">
              {Object.entries(selectedRoleScreens).map(
                ([moduleName, screens]) => (
                  <div key={moduleName}>
                    {screens.map((screen, index) => (
                      <span key={index} className="screen-pill">
                        {screen}
                      </span>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        <div className="label-input">
          <label className="form-label">User Type *</label>
          <select
            onChange={(e) => setusertype(e.target.value)}
            className="form-select"
            value={userType}
          >
            <option value="">Select user type</option>
            <option value="1">Super User</option>
            <option value="4">Maker</option>
            <option value="3">Checker</option>
            <option value="5">Infra manager</option>
          </select>
          {errors.userType && <p className="error-text">{errors.userType}</p>}
        </div>

        {/* Submit */}
        <button type="submit" className="submit-btn">
          + Create User
        </button>
      </form>
      <div className="config-forms">
        <div className="card-header">
          <div className="card-header-left">
            <div className="flex items-center gap-[10px]">
              <div className="header-icon-box">
                <FileText className="text-[#00d4aa] w-4 h-4" />
              </div>
            </div>
            <div>
              <h1 className="header-title">Employees</h1>
              <p className="header-subtext">View and manage employee records</p>
            </div>
          </div>
          <div className="card-header-right">
            <div className="portal-info">
              <p className="portal-label">{employees.length} total</p>
              <p className="portal-link">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Filters & Pagination */}
        <div className="bg-[#0c0f16] border border-[#1a1f2e] rounded-xl p-3 flex flex-col gap-3 mt-6">
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="search-box relative">
              <Search className="absolute left-3 top-2 text-gray-400 w-3 h-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="search-input-approval"
                placeholder="Search employees..."
              />
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="filter-btn"
            >
              <Filter className="filter-icon" />
              Reset
            </button>
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`w-6 h-6 flex items-center justify-center rounded-md transition ${
                currentPage === 1
                  ? "bg-[#0f131d] text-gray-500 cursor-not-allowed"
                  : "bg-[#0f131d] text-white hover:border hover:border-[#00d4aa]"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="w-6 h-6 flex items-center justify-center rounded-md bg-[#00d4aa] text-black text-[12px]">
              {currentPage}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`w-6 h-6 flex items-center justify-center rounded-md transition ${
                currentPage === totalPages
                  ? "bg-[#0f131d] text-gray-500 cursor-not-allowed"
                  : "bg-[#0f131d] text-white hover:border hover:border-[#00d4aa]"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-card mt-[18px]">
          <div className="table-header">
            <p className="table-title">
              <FileText className="w-5 h-5" />
              Employee List
            </p>
          </div>

          <div className="table-wrapper mt-5">
            <table className="w-full text-left">
              <thead className="table-head">
                <tr>
                  <th className="table-cell">ID</th>
                  <th className="table-cell">NAME</th>
                  <th className="table-cell">EMAIL</th>
                  <th className="table-cell">DEPARTMENT</th>
                  <th className="table-cell">DESIGNATION</th>
                  <th className="table-cell">ROLE</th>
                  <th className="table-cell">STATUS</th>
                  <th className="table-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedConfigurations.length > 0 ? (
                  paginatedConfigurations.map((emp, idx) => (
                    <tr key={emp.empId} className="table-row">
                      <td className="table-content">{emp.empId}</td>
                      <td className="table-content">{emp.userName}</td>
                      <td className="table-content">{emp.email}</td>
                      <td className="table-content">{emp.deptName}</td>
                      <td className="table-content">{emp.designationDesc}</td>
                      <td className="table-content">{emp.roleDescription}</td>
                      <td className="table-content">
                        <span className={`px-2 py-1 rounded text-[10px] `}>
                          {emp.status === 1
                            ? "Super User"
                            : emp.status === 2
                            ? "Normal User"
                            : emp.status === 3
                            ? "Checker"
                            : emp.status === 4
                            ? "Maker"
                            : "Infra manager"}
                        </span>
                      </td>
                      <td className="table-content flex gap-2">
                        <button
                          className="header-icon-box"
                          onClick={() => setSelectedEmployee(emp)}
                        >
                          <EyeIcon className="text-[#00d4aa] w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-gray-500">
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeCreationForm;
