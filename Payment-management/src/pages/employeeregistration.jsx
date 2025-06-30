import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import backgroundImg from "../assets/background.jpeg";
import logo from "../assets/favicon.png";
import { useNavigate } from "react-router-dom";

const UserRegistration = () => {
  const navigate = useNavigate();
  const [empId, setEmpId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [designationId, setDesignationId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [statusId, setStatusId] = useState("");

  const [statusOptions, setStatusOptions] = useState([]);
  const [moduleOptions, setModuleOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [passwordStrengthLevel, setPasswordStrengthLevel] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [nameError, setNameError] = useState("");
  const [empIdError, setEmpIdError] = useState("");
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    axios
      .get("http://192.168.22.247/app1/api/Department/get-all-details")
      .then((res) => {
        const data = res.data;
        setStatusOptions(data.data.statusDetails || []);
        setModuleOptions(data.data.moduleDetails || []);
        setDesignationOptions(data.data.departmentDesignations || []);
        const uniqueDepts = [
          ...new Map(
            (data.data.departmentDesignations || []).map((item) => [
              item.deptId,
              { deptId: item.deptId, deptName: item.deptName },
            ])
          ).values(),
        ];
        setDepartmentOptions(uniqueDepts);
      })
      .catch(() => setApiError(true));
  }, []);

  const validateEmail = (val) => {
    const regex = /^[\w-.]+@gmail\.com$/;
    setEmailError(regex.test(val) ? "" : "Email must be a valid Gmail address.");
  };

  const validatePassword = (val) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    setPasswordStrength(
      strongRegex.test(val)
        ? ""
        : " (Password must be 8+ chars with uppercase, lowercase, number & symbol.)"
    );
  };

  const validateName = (val) => {
    setNameError(/^[A-Za-z\s]*$/.test(val) ? "" : "Name should contain only letters.");
  };

  const validateEmpId = (val) => {
    setEmpIdError(/^\d+$/.test(val) ? "" : "Employee ID must be an integer.");
  };

  const getClientIp = async () => {
    try {
      const res = await axios.get("https://api.ipify.org?format=json");
      return res.data.ip;
    } catch {
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      emailError ||
      password !== confirmPassword ||
      nameError ||
      empIdError ||
      !departmentId ||
      !designationId ||
      !moduleId ||
      !statusId
    ) {
      alert("Please fix the validation errors.");
      return;
    }

    const payload = {
      empId: "emp" + empId,
      deptId: parseInt(departmentId),
      designationId: parseInt(designationId),
      name: name,
      email: email,
      password: password,
      statusId: parseInt(statusId),
      moduleAccessId: parseInt("13"),
      createdBy: "sathish",
      userType: parseInt("1"),
    };

    console.log("Submitting payload:", payload);

    const clientIp = await getClientIp();

    try {
      const response = await axios.post(
        "http://192.168.22.247/app1/api/Department/userCreate",
        payload
      );

      await axios.post("http://192.168.22.247/app2/api/Audit/log-audit", {
        EntityName: "User",
        EntityId: response.data?.userId || "",
        Action: "insert",
        ChangedBy: email,
        ChangedOn: new Date().toISOString(),
        OldValues: "",
        NewValues: JSON.stringify(payload),
        ChangedColumns: Object.keys(payload).join(","),
        SourceIP: clientIp,
      });

      alert("User registered successfully!");
    } catch (err) {
      console.error("Registration failed:", err);

      try {
        await axios.post("http://192.168.22.247/app2/api/Audit/log-audit", {
          EntityName: "User",
          EntityId: "",
          Action: "Create-Failed",
          ChangedBy: email,
          ChangedOn: new Date().toISOString(),
          OldValues: "",
          NewValues: JSON.stringify(payload),
          ChangedColumns: Object.keys(payload).join(","),
          SourceIP: clientIp,
        });
      } catch {}

      alert("Failed to register. Please check the form or contact admin.");
    }
  };

  const filteredDesignations = designationOptions.filter(
    (des) => des.deptId === parseInt(departmentId)
  );

  const filteredModules = useMemo(() => {
    if (!designationId) return [];
    const filtered = moduleOptions.filter(
      (mod) => mod.designationId === parseInt(designationId)
    );

    const uniqueModulesMap = new Map();
    filtered.forEach((mod) => {
      if (!uniqueModulesMap.has(mod.moduleDescription)) {
        uniqueModulesMap.set(mod.moduleDescription, mod);
      }
    });

    return Array.from(uniqueModulesMap.values());
  }, [designationId, moduleOptions]);

  const evaluatePasswordStrength = (val) => {
    let strength = 0;
    if (val.length >= 8) strength++;
    if (/[A-Z]/.test(val)) strength++;
    if (/[a-z]/.test(val)) strength++;
    if (/\d/.test(val)) strength++;
    if (/[\W_]/.test(val)) strength++;

    if (strength <= 2) {
      setPasswordStrengthLevel("Weak");
    } else if (strength === 3 || strength === 4) {
      setPasswordStrengthLevel("Moderate");
    } else if (strength === 5) {
      setPasswordStrengthLevel("Strong");
    } else {
      setPasswordStrengthLevel("");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl p-8 shadow-lg space-y-6">
        <div className="text-center">
          <img src={logo} alt="Logo" className="w-12 h-12 mx-auto mb-2" />
          <h2 className="text-2xl font-bold">User Registration</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={empId}
            onChange={(e) => {
              setEmpId(e.target.value);
              validateEmpId(e.target.value);
            }}
            maxLength={25}
            placeholder="Employee ID"
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          {empIdError && <p className="text-red-600 text-sm">{empIdError}</p>}

          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              validateName(e.target.value);
            }}
            maxLength={25}
            placeholder="Name"
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          {nameError && <p className="text-red-600 text-sm">{nameError}</p>}

          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateEmail(e.target.value);
            }}
            maxLength={25}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          {emailError && <p className="text-red-600 text-sm">{emailError}</p>}

          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
              evaluatePasswordStrength(e.target.value);
              setPasswordMatchError(
                e.target.value !== confirmPassword ? "Passwords do not match." : ""
              );
            }}
            maxLength={25}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          {password && (
            <div className="mt-1">
              <div className="h-2 w-full bg-gray-300 rounded">
                <div
                  className={`h-2 rounded transition-all duration-300 ${passwordStrengthLevel === "Weak"
                    ? "w-1/3 bg-red-500"
                    : passwordStrengthLevel === "Moderate"
                      ? "w-2/3 bg-yellow-500"
                      : passwordStrengthLevel === "Strong"
                        ? "w-full bg-green-500"
                        : ""
                    }`}
                ></div>
              </div>
              <p className={`text-sm mt-1 ${passwordStrengthLevel === "Weak"
                ? "text-red-600"
                : passwordStrengthLevel === "Moderate"
                  ? "text-yellow-600"
                  : "text-green-600"
                }`}>
                {passwordStrengthLevel && `Password Strength: ${passwordStrengthLevel}`}
              </p>
              <p className={`text-sm ${passwordStrength ? "text-red-600" : ""}`}>
                {passwordStrength}
              </p>
            </div>
          )}

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setPasswordMatchError(
                password !== e.target.value ? "Passwords do not match." : ""
              );
            }}
            maxLength={25}
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          {passwordMatchError && <p className="text-red-600 text-sm">{passwordMatchError}</p>}

          <select
            value={departmentId}
            onChange={(e) => {
              setDepartmentId(e.target.value);
              setDesignationId("");
              setModuleId("");
            }}
            className="w-full px-4 py-2 border rounded-md"
            required
          >
            <option value="">Select Department</option>
            {departmentOptions.map((dept) => (
              <option key={dept.deptId} value={dept.deptId}>
                {dept.deptName}
              </option>
            ))}
          </select>

          <select
            value={designationId}
            onChange={(e) => {
              setDesignationId(e.target.value);
              setModuleId("");
            }}
            className="w-full px-4 py-2 border rounded-md"
            required
            disabled={!departmentId}
          >
            <option value="">Select Designation</option>
            {filteredDesignations.map((des) => (
              <option key={des.designationId} value={des.designationId}>
                {des.designationName}
              </option>
            ))}
          </select>

          <select
            value={moduleId}
            onChange={(e) => setModuleId(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
            disabled={!designationId}
          >
            <option value="">Select Module</option>
            {filteredModules.map((mod) => (
              <option key={mod.moduleId} value={mod.moduleId}>
                {mod.moduleDescription}
              </option>
            ))}
          </select>

          <select
            value={statusId}
            onChange={(e) => setStatusId(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          >
            <option value="">Select Status</option>
            {statusOptions.map((status) => (
              <option key={status.statusId} value={status.statusId}>
                {status.statusDescription}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={
              emailError ||
              passwordMatchError ||
              nameError ||
              empIdError ||
              !empId ||
              !name ||
              !email ||
              !password ||
              !confirmPassword ||
              !moduleId ||
              !designationId ||
              !departmentId ||
              !statusId
            }
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            Register
          </button>
        </form>

        {apiError && (
          <p className="text-red-600 text-center mt-2">
            Error loading dropdown data. Please try again later.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserRegistration;
