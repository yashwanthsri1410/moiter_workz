import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import usePublicIp from "../hooks/usePublicIp";
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
  Eye,
  EyeOff,
} from "lucide-react";
import "../styles/styles.css";
import ErrorText from "./reusable/errorText";
import { v4 as uuidv4 } from "uuid";
import { paginationStyle } from "../constants";
import customConfirm from "./reusable/CustomConfirm";

const EmployeeCreationForm = ({ onBack }) => {
  const username = localStorage.getItem("username");
  const [empId, setEmpId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusId] = useState(1);
  const [userType, setusertype] = useState("");
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
  const [showPassword, setShowPassword] = useState(false);
  const [designation, setDesignation] = useState([]);
  const [isApiCalled, setIsApiCalled] = useState(false);
  const ip = usePublicIp();
  const targetRef = useRef(null);
  const userAgent = navigator.userAgent;
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const itemsPerPage = 8;

  const handleScroll = () => {
    targetRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const generatedId = Date.now().toString().slice(-6);
    setEmpId(generatedId);
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      const status = selectedEmployee.status;
      setEmpId(selectedEmployee.empId || "");
      setName(selectedEmployee.userName || "");
      setEmail(selectedEmployee.email || "");
      setDeptId(selectedEmployee.deptName?.toString() || "");
      setDesignationId(selectedEmployee.designationDesc?.toString() || "");
      setRoleAccessId(selectedEmployee.roleAccessId?.toString() || "");
      setusertype(
        status === 1
          ? "Super User"
          : status === 2
            ? "Normal User"
            : status === 3
              ? "Checker"
              : status === 4
                ? "Maker"
                : "Infra Manager"
      );
      setPassword("");
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

  const clearState = () => {
    setName("");
    setEmail("");
    setPassword("");
    setDeptId("");
    setDesignationId("");
    setRoleAccessId("");
    setusertype("");
    setErrors({});
  };

  const api = `${API_BASE_URL}/fes/api/Export/`;

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = () => {
    Promise.all([
      axios.get(`${api}simple-departments`),
      axios.get(`${api}role-module-screen`),
      axios.get(`${api}pending-employees`),
      axios.get(`${api}designations`),
    ])
      .then(([departmentsRes, modulesRes, employeesRes, designationsRes]) => {
        setAccessList(departmentsRes.data);
        setRoleData(modulesRes.data);
        setEmployees(employeesRes.data);
        setDesignation(designationsRes.data);
      })
      .catch((err) => console.error("Error fetching data:", err));
  };

  const uniqueDepts = Array.from(
    new Set(designation.map((item) => item.deptName))
  );

  const uniqueRoles = Array.from(
    new Map(roleData?.map((item) => [item.roleAccessId, item])).values()
  ).map((role) => ({
    value: role.roleAccessId.toString(),
    label: role.roleDescription,
  }));

  const dedupedRoles = Array.from(
    new Map(uniqueRoles.map((item) => [item.label, item])).values()
  );

  const uniqueDesigns = designation
    .filter((d) => d.deptName === deptId)
    .map((e) => e.designationDesc);

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

  const validate = (isUpdate) => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).+$/;
    const isRoleLength = Object.keys(selectedRoleScreens).length === 0;
    if (!name) newErrors.name = "Enter user name";
    else if (name.length > 25) newErrors.name = "Name max 25 characters";
    if (!email) newErrors.email = "Enter Email Id";
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email";
    if (!isUpdate) {
      if (!/^[0-9]+$/.test(empId))
        newErrors.empId = "Employee ID must be numeric";
    }
    if (!isUpdate) {
      if (!password) newErrors.password = "Enter password";
      else if (!passwordRegex.test(password)) {
        newErrors.password =
          "One uppercase, One lowercase, One number, and One special character.";
      }
    }
    if (!deptId) {
      newErrors.deptId = "Select Department";
      newErrors.designationId = "Select Department";
    }
    if (deptId && !designationId)
      newErrors.designationId = "Select Designation";
    if (!userType) newErrors.userType = "Select User Type";
    if (isRoleLength) newErrors.selectedRoleScreens = "Select Role";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const usersId = {
    "Super User": 1,
    "Normal User": 2,
    Checker: 3,
    Maker: 4,
    "Infra Manager": 5,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmAction = await customConfirm("Are you sure you want to continue?");
    if (!confirmAction) return;
    if (!validate(selectedEmployee)) return;
    if (selectedEmployee && !designationId) return;

    const timestamp = new Date().toISOString();

    // 🔹 get original employee object (for logId)
    const original = employees.find(
      (emp) => emp.userId === selectedEmployee?.userId
    );

    const payload = {
      deptId,
      designationId,
      name,
      email,
      password,
      statusId,
      roleAccessId: parseInt(roleAccessId),
      userType,
      // 🔹 logId handling
      logId: selectedEmployee && original?.logId ? original.logId : uuidv4(), // new only on create or missing
      ...(selectedEmployee
        ? {
          modifiedBy: createdBy,
          userId: selectedEmployee?.userId,
          empId: selectedEmployee?.empId,
        }
        : { createdBy: createdBy, empId: `Emp${empId}` }),
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
        },
      },
    };

    // map department + designation
    const deptObj = designation.find((d) => d.deptName === payload.deptId);
    if (deptObj) payload.deptId = deptObj.deptId;

    const desigObj = designation.find(
      (d) => d.designationDesc === payload.designationId
    );
    if (desigObj) payload.designationId = desigObj.designationId;

    if (usersId[payload.userType]) payload.userType = usersId[payload.userType];

    try {
      if (selectedEmployee) {
        await axios.put(
          `${API_BASE_URL}/ums/api/UserManagement/updateEmployee`,
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
    } finally {
      fetchData();
      clearState();
      setSelectedEmployee("");
      setIsApiCalled(true);
    }
  };

  const handleRoleChange = (e) => {
    const roleId = e.target.value;
    setRoleAccessId(roleId);

    if (!roleId) {
      setSelectedRoleScreens({});
      return;
    }

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

  return (
    <div>
      {/* Top Bar */}
      <div className="back-title flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        {/* Mobile Header */}
        <div className="flex items-center justify-between w-full sm:hidden">
          <button className="header-icon-btn" onClick={onBack}>
            <ArrowLeft className="primary-color w-4 h-4" />
          </button>
          <div className="flex flex-col items-center text-center">
            <h1 className="header-title text-base">User Management</h1>
            <p className="header-subtext text-xs">Create new team members</p>
          </div>
          <div className="header-icon-box">
            <User className="primary-color w-4 h-4" />
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:flex sm:justify-between sm:items-center w-full gap-[10px]">
          <div className="header-left flex items-center gap-[10px]">
            <button className="header-icon-btn" onClick={onBack}>
              <ArrowLeft className="primary-color w-4 h-4" />
            </button>
            <div className="header-icon-box">
              <User className="primary-color w-4 h-4" />
            </div>
            <div>
              <h1 className="user-title">User Management</h1>
              <p className="user-subtitle">Create new team members</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        ref={targetRef}
        onSubmit={handleSubmit}
        className="form-container text-sm sm:text-base"
      >
        {/* Full Name */}
        <div className="label-input">
          <label className="form-label text-sm sm:text-base mandatory-space">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter user's full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input text-sm sm:text-base"
          />
          <ErrorText errTxt={errors.name} />
        </div>

        {/* Email */}
        <div className="label-input">
          <label className="form-label text-sm sm:text-base mandatory-space">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter user's email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input text-sm sm:text-base"
          />
          <ErrorText errTxt={errors.email} />
        </div>

        {/* Password */}
        {!selectedEmployee && (
          <div className="label-input relative">
            <label className="form-label text-sm sm:text-base mandatory-space">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create user's password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input pr-10 text-sm sm:text-base"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[40px] text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <ErrorText errTxt={errors.password} />
          </div>
        )}

        {/* Department */}
        <div className="label-input">
          <label className="form-label text-sm sm:text-base mandatory-space">
            Department
          </label>
          <select
            value={deptId}
            onChange={(e) => {
              setDeptId(e.target.value);
              setDesignationId("");
            }}
            className="form-select text-sm sm:text-base"
          >
            <option value="" disabled hidden>
              Select department
            </option>
            {uniqueDepts.map((ele) => (
              <option key={ele} value={ele}>
                {ele}
              </option>
            ))}
          </select>
          <ErrorText errTxt={errors.deptId} />
        </div>

        {/* Designation */}
        <div className="label-input">
          <label className="form-label text-sm sm:text-base mandatory-space">
            Designation
          </label>
          <select
            value={designationId}
            onChange={(e) => setDesignationId(e.target.value)}
            className="form-select text-sm sm:text-base"
            disabled={!deptId}
          >
            <option value="" disabled hidden>
              Select designation
            </option>
            {uniqueDesigns.map((ele) => (
              <option key={ele} value={ele}>
                {ele}
              </option>
            ))}
          </select>
          <ErrorText errTxt={errors.designationId} />
        </div>

        {/* Role */}
        <div className="label-input">
          <label className="form-label text-sm sm:text-base mandatory-space">
            Role
          </label>
          <select
            value={roleAccessId}
            onChange={handleRoleChange}
            className="form-select text-sm sm:text-base"
            disabled={!designationId}
          >
            <option value="" disabled hidden>
              Select role
            </option>
            {dedupedRoles.map((ele) => (
              <option key={ele.value} value={ele.value}>
                {ele.label}
              </option>
            ))}
          </select>
          <ErrorText errTxt={errors.selectedRoleScreens} />
        </div>

        {!isApiCalled && Object.keys(selectedRoleScreens).length > 0 && (
          <div className="accessible-screens">
            <div className="accessible-header">
              <Monitor className="icon" size={16} />
              <label className="text-sm sm:text-base">Accessible Screens</label>
            </div>
            <div className="accessible-box">
              {Object.entries(selectedRoleScreens).map(
                ([moduleName, screens]) => (
                  <div key={moduleName}>
                    {screens.map((screen, index) => (
                      <span
                        key={index}
                        className="screen-pill text-xs sm:text-sm"
                      >
                        {screen}
                      </span>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* User Type */}
        <div className="label-input">
          <label className="form-label text-sm sm:text-base mandatory-space">
            User Type
          </label>
          <select
            onChange={(e) => setusertype(e.target.value)}
            className="form-select text-sm sm:text-base"
            value={userType}
          >
            <option value="" disabled hidden>
              Select user type
            </option>
            <option value="Super User">Super User</option>
            <option value="Maker">Maker</option>
            <option value="Checker">Checker</option>
            <option value="Infra Manager">Infra Manager</option>
          </select>
          <ErrorText errTxt={errors.userType} />
        </div>

        <button
          type="submit"
          className="submit-btn text-sm sm:text-base md:text-[12px]"
        >
          {selectedEmployee ? "Update User" : "+ Create User"}
        </button>
      </form>

      <div className="card-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-center sm:text-left">
        {/* Left Side (icon + text always in one row) */}
        <div className="flex items-center justify-center sm:justify-start gap-3">
          <div className="header-icon-box">
            <FileText className="primary-color w-4 h-4" />
          </div>
          <div>
            <h1 className="header-title">Employees</h1>
            <p className="header-subtext">View and manage employee records</p>
          </div>
        </div>

        {/* Right Side (same row on sm and above, stacks below on mobile) */}
        <div className="card-header-right flex justify-center sm:justify-end">
          <div className="portal-info !text-center sm:text-right">
            <p className="portal-label">{employees.length} total</p>
            <p className="portal-link">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Filters & Pagination */}
      <div className="table-card rounded-xl p-3 flex flex-col gap-3 items-center md:items-start mt-2.5">
        <div className="flex flex-col items-center md:items-start md:flex-row gap-2 w-full">
          {/* Search */}
          <div className="search-box relative flex-1">
            <Search className="absolute left-3 top-2 text-gray-400 w-3 h-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input-approval !w-full !sm:w-[50rem]"
              placeholder="Search employees..."
            />
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setSearchQuery("");
              setCurrentPage(1);
            }}
            className="reset-btn"
          >
            <Filter className="w-3 h-3" />
            Reset
          </button>
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-6 h-6 flex items-center justify-center rounded-md transition ${currentPage === 1
                ? "bg-[#0f131d] text-gray-500 cursor-not-allowed"
                : "bg-[#0f131d] text-white hover:border hover:border-[var(--primary-color)]"
              }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className={paginationStyle}>{currentPage}</span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`w-6 h-6 flex items-center justify-center rounded-md transition ${currentPage === totalPages
                ? "bg-[#0f131d] text-gray-500 cursor-not-allowed"
                : "bg-[#0f131d] text-white hover:border hover:border-[var(--primary-color)]"
              }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-card mt-[18px]">
        <div className="table-header">
          <div className="flex items-center gap-2 primary-color">
            <FileText className="w-4 h-4" />
            <p className="user-table-header">Employee List</p>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>EMP ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>DEPARTMENT</th>
                <th>DESIGNATION</th>
                <th>ROLE</th>
                <th>STATUS</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedConfigurations.length > 0 ? (
                paginatedConfigurations.map((emp) => (
                  <tr key={emp.empId} className="table-row">
                    <td>{emp.empId}</td>
                    <td>{emp.userName}</td>
                    <td>{emp.email}</td>
                    <td>{emp.deptName}</td>
                    <td>{emp.designationDesc}</td>
                    <td>{emp.roleDescription}</td>
                    <td>
                      <span
                        className={`px-2 py-1 text-[10px] rounded ${emp.status === 0
                            ? "checker"
                            : emp.status === 1
                              ? "infra"
                              : emp.status === 2
                                ? "inactive"
                                : "maker"
                          }`}
                      >
                        {emp.status === 0
                          ? "Approved"
                          : emp.status === 1
                            ? "Pending"
                            : emp.status === 2
                              ? "Rejected"
                              : emp.status === 3
                                ? "Recheck"
                                : ""}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2 my-1">
                        <button
                          className="header-icon-box"
                          onClick={() => {
                            setSelectedEmployee(emp);
                            setErrors({});
                            handleScroll();
                          }}
                        >
                          <EyeIcon size="16" className="primary-color" />
                        </button>
                      </div>
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
  );
};

export default EmployeeCreationForm;
