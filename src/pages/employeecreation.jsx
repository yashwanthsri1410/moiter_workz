import React, { useEffect, useState } from "react";
import axios from "axios";
import backgroundImg from "../assets/background.jpeg";
import logo from "../assets/favicon.png";
import usePublicIp from "../hooks/usePublicIp";
import Headers from "../components/Header";
import Footer from "../components/Footer";
import Select from "react-select";

const EmployeeCreationForm = () => {
  const [empId, setEmpId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusId] = useState(1);
  const [userType, setusertype] = useState();
  const [createdBy] = useState("admin");
  const [deptId, setDeptId] = useState("");
  const [designationId, setDesignationId] = useState("");
  const [roleAccessId, setRoleAccessId] = useState("");
  const [selectedRoleScreens, setSelectedRoleScreens] = useState({});

  const [accessList, setAccessList] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [errors, setErrors] = useState({});
  const username = localStorage.getItem("username");
  const ip = usePublicIp();
  const userAgent = navigator.userAgent;

  useEffect(() => {
    // Fetch department-designation data
    axios
      .get("http://192.168.22.247:7090/api/Export/role-departments")
      .then((res) => setAccessList(res.data))
      .catch((err) => console.error("Error fetching access list:", err));

    // Fetch role-module-screen data
    axios
      .get("http://192.168.22.247:7090/api/Export/role-module-screen")
      .then((res) => setRoleData(res.data))
      .catch((err) => console.error("Error fetching role data:", err));
  }, []);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) newErrors.email = "Invalid email";
    if (name.length > 25) newErrors.name = "Name max 25 characters";
    if (!/^[0-9]+$/.test(empId)) newErrors.empId = "Employee ID must be numeric";

    const pwErrors = [];
    if (!/[A-Z]/.test(password)) pwErrors.push("one uppercase");
    if (!/[a-z]/.test(password)) pwErrors.push("one lowercase");
    if (!/[0-9]/.test(password)) pwErrors.push("one number");
    if (!/[^A-Za-z0-9]/.test(password)) pwErrors.push("one special character");
    if (pwErrors.length) newErrors.password = pwErrors.join(", ");

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
            additionalProp2: {
              options: { propertyNameCaseInsensitive: true },
              parent: "user",
              root: "root2",
            },
            additionalProp3: {
              options: { propertyNameCaseInsensitive: true },
              parent: "user",
              root: "root3",
            },
          },
        },
      },
    };
    try {
      await axios.post(
        "http://192.168.22.247:5229/ums/api/UserManagement/createEmployee",
        payload
      );
      alert("✅ Employee created successfully");
    } catch (err) {
      console.error("❌ API error:", err);
      alert("❌ Failed to create user. See console.");
    }
  };

  // Unique departments (remove duplicates by deptId)
  const uniqueDepts = Array.from(new Map(accessList.map(item => [item.deptId, item])).values());

  // Unique designations filtered by selected department
  const uniqueDesigns = Array.from(new Map(
    accessList
      .filter(item => item.deptId.toString() === deptId)
      .map(item => [item.designationId, item])
  ).values());

  // Map roles to Select options
  const uniqueRoles = Array.from(
    new Map(roleData.map(item => [item.roleAccessId, item])).values()
  ).map(role => ({
    value: role.roleAccessId.toString(),
    label: role.roleDescription,
  }));

  // When user selects a role, update roleAccessId and group associated screens by module
  const handleRoleChange = (selectedOption) => {
    if (!selectedOption) {
      setRoleAccessId("");
      setSelectedRoleScreens({});
      return;
    }

    const roleId = selectedOption.value;
    setRoleAccessId(roleId);

    const filtered = roleData.filter((r) => r.roleAccessId.toString() === roleId);
    const grouped = {};

    filtered.forEach(({ moduleName, screenDesc }) => {
      if (!grouped[moduleName]) grouped[moduleName] = [];
      if (!grouped[moduleName].includes(screenDesc)) grouped[moduleName].push(screenDesc);
    });

    setSelectedRoleScreens(grouped);
  };
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#1b1b3b',
      borderColor: '#333',
      color: 'white',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#1b1b3b',
      color: 'white',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#333' : '#1b1b3b',
      color: 'white',
      cursor: 'pointer',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'white',
    }),
    input: (provided) => ({
      ...provided,
      color: 'white',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'gray',
    }),
  };

  return (
    <>
      <div className="page-container">
        <div className="login-container">
          {/* Glow Corners */}
          {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => {
            const isRight = pos.includes("right-0");
            return (
              <div
                key={i}
                className={`glow-corner ${pos} ${isRight ? "glow-corner-right" : "glow-corner-left"}`}
              />
            );
          })}

          <img src={logo} alt="Logo" className="w-14 h-14 mx-auto mb-6" />
          <h2 className="form-heading">Employee Creation</h2>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-[#0c0f11] p-6 rounded-xl shadow-lg border border-gray-800 space-y-5">
            {/* Heading */}
            <div className="text-center">
              <h2 className="text-teal-400 text-xl font-semibold">User Creation</h2>
              <p className="text-gray-400 text-sm">Add new team member with role-based access</p>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Full Name *</label>
              <input
                type="text"
                placeholder="Enter user's full name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-[#10141a] text-white px-3 py-2 rounded-md border border-teal-900 focus:outline-none focus:border-teal-500"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Email Address *</label>
              <input
                type="email"
                placeholder="Enter user's email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#10141a] text-white px-3 py-2 rounded-md border border-teal-900 focus:outline-none focus:border-teal-500"
              />
              <p className="text-gray-500 text-xs">Password will be sent to this email</p>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Department *</label>
              <select
                value={deptId}
                onChange={e => { setDeptId(e.target.value); setDesignationId(""); }}
                className="w-full bg-[#10141a] text-white px-3 py-2 rounded-md border border-teal-900 focus:outline-none focus:border-teal-500"
              >
                <option value="">Select department</option>
                {uniqueDepts.map(d => (
                  <option key={d.deptId} value={d.deptId}>{d.deptName}</option>
                ))}
              </select>
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Designation *</label>
              <select
                value={designationId}
                onChange={e => setDesignationId(e.target.value)}
                className="w-full bg-[#10141a] text-white px-3 py-2 rounded-md border border-teal-900 focus:outline-none focus:border-teal-500"
                disabled={!deptId}
              >
                <option value="">Select designation</option>
                {uniqueDesigns.map(d => (
                  <option key={d.designationId} value={d.designationId}>{d.designationDesc}</option>
                ))}
              </select>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Role *</label>
              <Select
                className="react-select-container"
                classNamePrefix="react-select"
                styles={customStyles}
                options={uniqueRoles}
                onChange={handleRoleChange}
                placeholder="Select role"
                isClearable
              />
            </div>

            {/* User Type */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">User Type *</label>
              <select
                onChange={e => { setusertype(e.target.value) }}
                className="w-full bg-[#10141a] text-white px-3 py-2 rounded-md border border-teal-900 focus:outline-none focus:border-teal-500"
              >
                <option value="">Select user type</option>
                <option value="1">Super User</option>
                <option value="4">Maker</option>
                <option value="3">Checker</option>
                <option value="5">Infra manager</option>
              </select>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-500 text-white py-2 rounded-md shadow-[0_0_10px_rgba(0,255,200,0.6)] hover:shadow-[0_0_20px_rgba(0,255,200,0.9)] transition"
            >
              + Create User
            </button>
          </form>

        </div>
      </div>

    </>
  );
};

export default EmployeeCreationForm;
