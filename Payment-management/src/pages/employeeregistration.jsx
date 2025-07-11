import React, { useEffect, useState } from "react";
import axios from "axios";
import backgroundImg from "../assets/background.jpeg";
import logo from "../assets/favicon.png";
import usePublicIp from "../hooks/usePublicIp";

const EmployeeCreateForm = () => {
  const [empId, setEmpId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusId, setStatusId] = useState(1);
  const [userType, setUserType] = useState(2);
  const [createdBy, setCreatedBy] = useState("admin");
  const [roleDescription, setRoleDescription] = useState("");
  const [accessList, setAccessList] = useState([]);
  const [deptId, setDeptId] = useState("");
  const [designationId, setDesignationId] = useState("");
  const [roleAccessId, setRoleAccessId] = useState("");

  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [empIdError, setEmpIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const ip = usePublicIp();
  const userAgent = navigator.userAgent;

  useEffect(() => {
    axios
      .get("http://192.168.22.247/us/api/Department/getApprove")
      .then((res) => setAccessList(res.data))
      .catch((err) => console.error("Error fetching role access data:", err));
  }, []);

  const validate = () => {
    let valid = true;
    setEmailError("");
    setNameError("");
    setEmpIdError("");
    setPasswordError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Email must contain '@' and end with '.com'");
      valid = false;
    }

    if (name.length > 25) {
      setNameError("Name must be within 25 characters");
      valid = false;
    }

    if (!/^[0-9]+$/.test(empId)) {
      setEmpIdError("Employee ID must be an integer");
      valid = false;
    }

    const passwordRules = [
      { regex: /[A-Z]/, msg: "Include at least one UPPERCASE letter" },
      { regex: /[a-z]/, msg: "Include at least one lowercase letter" },
      { regex: /[0-9]/, msg: "Include at least one number" },
      { regex: /[^A-Za-z0-9]/, msg: "Include at least one special character" },
    ];

    const errors = passwordRules
      .filter((rule) => !rule.regex.test(password))
      .map((rule) => rule.msg);

    if (errors.length) {
      setPasswordError(errors.join(", "));
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const timestamp = new Date().toISOString();
    const auditUserId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

    const payload = {
      empId,
      deptId: parseInt(deptId),
      designationId: parseInt(designationId),
      name,
      email,
      password,
      statusId: parseInt(statusId),
      roleAccessId: parseInt(roleAccessId),
      roleDescription,
      createdBy,
      userType: parseInt(userType),
      metadata: {
        ipAddress: ip || "0.0.0.0",
        userAgent: userAgent,
        headers: "custom-header",
        channel: "web",
        auditMetadata: {
          createdBy: auditUserId,
          createdDate: timestamp,
          modifiedBy: auditUserId,
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
    // console.log(payload)
    try {
      const res = await axios.post(
        "http://192.168.22.247/us/api/Department/makerEmployeeCreate",
        payload
      );
      alert("✅ Maker user created successfully");
    } catch (err) {
      console.error("❌ Error submitting form:", err);
      alert("❌ Failed to create maker user. Check console for details.");
    }
  };

  const uniqueDepartments = Array.from(
    new Map(accessList.map((item) => [item.deptId, item])).values()
  );

  const uniqueDesignations = Array.from(
    new Map(
      accessList
        .filter((item) => item.deptId == deptId)
        .map((item) => [item.designationId, item])
    ).values()
  );

  const uniqueRoleScreens = Array.from(
    new Map(
      accessList
        .filter((item) => item.designationId == designationId)
        .map((item) => [item.roleAccessId, item])
    ).values()
  );
  const uniqueRoles = Array.from(
    new Map(
      accessList
        .filter((item) => item.designationId == designationId)
        .map((item) => [item.roleDescription, item])
    ).values()
  );
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start bg-cover bg-center relative p-6"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />
      <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
        <img src={logo} alt="Logo" className="w-20 h-20 mx-auto mb-6" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Employee ID"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
            className="w-full border rounded px-4 py-2"
            required
          />
          {empIdError && <p className="text-red-500 text-sm">{empIdError}</p>}

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-4 py-2"
            required
          />
          {nameError && <p className="text-red-500 text-sm">{nameError}</p>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-4 py-2"
            required
          />
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-4 py-2"
            required
          />
          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}

          <select
            value={deptId}
            onChange={(e) => {
              setDeptId(e.target.value);
              setDesignationId("");
              setRoleAccessId("");
            }}
            className="w-full border rounded px-4 py-2"
            required
          >
            <option value="">Select Department</option>
            {uniqueDepartments.map((item) => (
              <option key={item.deptId} value={item.deptId}>
                {item.deptName}
              </option>
            ))}
          </select>

          <select
            value={designationId}
            onChange={(e) => {
              setDesignationId(e.target.value);
              setRoleAccessId("");
            }}
            className="w-full border rounded px-4 py-2"
            required
          >
            <option value="">Select Designation</option>
            {uniqueDesignations.map((item) => (
              <option key={item.designationId} value={item.designationId}>
                {item.designationDesc}
              </option>
            ))}
          </select>
          <select
            value={roleDescription}
            onChange={(e) => setRoleDescription(e.target.value)}
            className="w-full border rounded px-4 py-2"
            required
          >
            <option value="">Select Role</option>
            {uniqueRoles.map((item) => (
              <option key={item.roleDescription} value={item.roleDescription}>
                {item.roleDescription}
              </option>
            ))}
          </select>
          <select
            value={roleAccessId}
            onChange={(e) => setRoleAccessId(e.target.value)}
            className="w-full border rounded px-4 py-2"
            required
          >
            <option value="">Select Screen</option>
            {uniqueRoleScreens.map((item) => (
              <option key={item.roleAccessId} value={item.roleAccessId}>
                {item.screenDesc} ({item.roleDescription})
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Create Maker User
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeCreateForm;
