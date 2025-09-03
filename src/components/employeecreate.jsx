import React, { useEffect, useState } from "react";
import axios from "axios";
import usePublicIp from "../hooks/usePublicIp";
import Select from "react-select";
import { ArrowLeft, User, Monitor } from "lucide-react";
import "../styles/styles.css"

const EmployeeCreationForm = ({ onBack }) => {
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
        axios
            .get("http://192.168.22.247:7090/api/Export/role-departments")
            .then((res) => setAccessList(res.data))
            .catch((err) => console.error("Error fetching access list:", err));

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
        console.log(payload)
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

    const uniqueDepts = Array.from(new Map(accessList.map(item => [item.deptId, item])).values());

    const uniqueDesigns = Array.from(new Map(
        accessList
            .filter(item => item.deptId.toString() === deptId)
            .map(item => [item.designationId, item])
    ).values());

    const uniqueRoles = Array.from(
        new Map(roleData.map(item => [item.roleAccessId, item])).values()
    ).map(role => ({
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

        const filtered = roleData.filter((r) => r.roleAccessId.toString() === roleId);
        const grouped = {};

        filtered.forEach(({ moduleName, screenDesc }) => {
            if (!grouped[moduleName]) grouped[moduleName] = [];
            if (!grouped[moduleName].includes(screenDesc)) grouped[moduleName].push(screenDesc);
        });

        setSelectedRoleScreens(grouped);
    };

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
                    <p className="form-subtitle">Add new team member with role-based access</p>
                </div>

                {/* Full Name */}
                <div className="label-input">
                    <label className="form-label">Full Name *</label>
                    <input
                        type="text"
                        placeholder="Enter user's full name"
                        value={name}
                        onChange={e => setName(e.target.value)}
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
                        onChange={e => setEmail(e.target.value)}
                        className="form-input"
                    />
                    <p className="helper-text">Password will be sent to this email</p>
                    {errors.email && <p className="error-text">{errors.email}</p>}
                </div>

                {/* Department */}
                <div className="label-input" >
                    <label className="form-label">Department *</label>
                    <select
                        value={deptId}
                        onChange={e => { setDeptId(e.target.value); setDesignationId(""); }}
                        className="form-select"
                    >
                        <option value="">Select department</option>
                        {uniqueDepts.map(d => (
                            <option key={d.deptId} value={d.deptId}>{d.deptName}</option>
                        ))}
                    </select>
                </div>

                {/* Designation */}
                <div className="label-input">
                    <label className="form-label">Designation *</label>
                    <select
                        value={designationId}
                        onChange={e => setDesignationId(e.target.value)}
                        className="form-select"
                        disabled={!deptId}
                    >
                        <option value="">Select designation</option>
                        {uniqueDesigns.map(d => (
                            <option key={d.designationId} value={d.designationId}>{d.designationDesc}</option>
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
                        styles={{
                            control: (base, state) => ({
                                ...base,
                                background: "#10141a", // background color
                                color: "#fff",              // text color
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
                            {Object.entries(selectedRoleScreens).map(([moduleName, screens]) => (
                                <div key={moduleName}>
                                    {screens.map((screen, index) => (
                                        <span key={index} className="screen-pill">
                                            {screen}
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}



                {/* User Type */}
                <div className="label-input">
                    <label className="form-label">User Type *</label>
                    <select
                        onChange={e => setusertype(e.target.value)}
                        className="form-select"
                    >
                        <option value="">Select user type</option>
                        <option value="1">Super User</option>
                        <option value="4">Maker</option>
                        <option value="3">Checker</option>
                        <option value="5">Infra manager</option>
                    </select>
                </div>

                {/* Submit */}
                <button type="submit" className="submit-btn" >+ Create User</button>
            </form>
        </>
    );
};

export default EmployeeCreationForm;
