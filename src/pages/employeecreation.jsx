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
  const [userType] = useState(2);
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
      userType,
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
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d28] p-6">
        <div className="w-full max-w-md bg-[#11112b] rounded-xl shadow-lg p-8">
          <img src={logo} alt="Logo" className="w-14 h-14 mx-auto mb-6" />
          <h2 className="text-white text-center font-semibold text-xl mb-6">LogIn</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Employee ID"
              value={empId}
              onChange={e => setEmpId(e.target.value)}
              className="w-full bg-[#1b1b3b] border border-[#333] text-white rounded-md px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.empId && <p className="text-red-500 text-sm">{errors.empId}</p>}

            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-[#1b1b3b] border border-[#333] text-white rounded-md px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#1b1b3b] border border-[#333] text-white rounded-md px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#1b1b3b] border border-[#333] text-white rounded-md px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

            <select
              value={deptId}
              onChange={e => { setDeptId(e.target.value); setDesignationId(""); }}
              className="w-full bg-[#1b1b3b] border border-[#333] text-white rounded-md px-4 py-2 focus:outline-none"
            >
              <option value="">Select Department</option>
              {uniqueDepts.map(d => (
                <option key={d.deptId} value={d.deptId}>{d.deptName}</option>
              ))}
            </select>

            <select
              value={designationId}
              onChange={e => setDesignationId(e.target.value)}
              className="w-full bg-[#1b1b3b] border border-[#333] text-white rounded-md px-4 py-2 focus:outline-none"
              disabled={!deptId}
            >
              <option value="">Select Designation</option>
              {uniqueDesigns.map(d => (
                <option key={d.designationId} value={d.designationId}>{d.designationDesc}</option>
              ))}
            </select>
            <Select
              styles={customStyles}
              options={uniqueRoles}
              onChange={handleRoleChange}
              placeholder="Select Role Description"
              className="w-full"
              isClearable
            />

            {Object.keys(selectedRoleScreens).length > 0 && (
              <div className="bg-[#1b1b3b] text-white border border-[#333] rounded-md p-4">
                <h4 className="font-semibold mb-2 text-white">Accessible Modules & Screens:</h4>
                {Object.entries(selectedRoleScreens).map(([module, screens], idx) => (
                  <div key={idx} className="mb-2">
                    <h5 className="text-purple-400 font-bold">{module}</h5>
                    <ul className="list-disc list-inside text-sm">
                      {screens.map((screen, i) => (
                        <li key={i}>{screen}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-md hover:opacity-90 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

    </>
  );
};

export default EmployeeCreationForm;
