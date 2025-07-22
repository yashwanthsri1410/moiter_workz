import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import backgroundImg from "../assets/background.jpeg";
import logo from "../assets/favicon.png";
import usePublicIp from "../hooks/usePublicIp";

export default function Signup() {
  const navigate = useNavigate();
  const ip = usePublicIp();

  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
    usertype: "",
  });

  const [emailValid, setEmailValid] = useState(true);
  const [ageError, setAgeError] = useState("");
  const [headersError, setheadersError] = useState("");
  const [passwordValid, setPasswordValid] = useState(true);
  const [usernameValid, setUsernameValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const username = localStorage.getItem("username");
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmailValid(value.endsWith("@gmail.com"));
    }

    if (name === "name") {
      setUsernameValid(/^[A-Za-z\s]*$/.test(value) || value === "");
    }

    if (name === "password") {
      const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
      setPasswordValid(strongPasswordRegex.test(value));
    }

    if (name === "age") {
      if (/^\d*$/.test(value)) {
        const age = parseInt(value, 10);
        if (!value) setAgeError("Age is required.");
        else if (age < 18 || age > 60)
          setAgeError("Enter valid age between 18 - 60");
        else setAgeError("");
        setForm({ ...form, age: value });
      }
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const userTypeMap = {
    "Super User": 1,
    Maker: 4,
    Checker: 3,
    User: 2,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailValid) {
      alert("Email must end with '@gmail.com'.");
      return;
    }

    if (!usernameValid) {
      alert("Name should contain only alphabets.");
      return;
    }

    if (!passwordValid) {
      alert(
        "Password must be at least 8 characters with uppercase, lowercase, number, and symbol."
      );
      return;
    }

    if (ageError) {
      alert("Please correct the age field.");
      return;
    }

    if (!form.usertype) {
      alert("Please select a user type.");
      return;
    }

    const now = new Date().toISOString();
    const commonAuditId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

    const payload = {
      name: form.name.trim(),
      age: parseInt(form.age, 10),
      email: form.email.trim(),
      password: form.password,
      userType: userTypeMap[form.usertype],
      metadata: {
        ipAddress: ip || "UNKNOWN",
        userAgent: window.navigator.userAgent,
        headers: JSON.stringify({
          language: navigator.language,
          platform: navigator.platform,
        }),
        channel: "WEB",
        auditMetadata: {
          createdBy: username,
          createdDate: now,
          modifiedBy: username,
          modifiedDate: now,
          header: {
            additionalProp1: {
              options: {
                propertyNameCaseInsensitive: true,
              },
              parent: "SignupForm",
              root: "UserModule",
            },
            additionalProp2: {
              options: {
                propertyNameCaseInsensitive: true,
              },
              parent: "SignupForm",
              root: "UserModule",
            },
            additionalProp3: {
              options: {
                propertyNameCaseInsensitive: true,
              },
              parent: "SignupForm",
              root: "UserModule",
            },
          },
        },
      },
    };

    console.log("Payload:", payload);
    console.log("Payload before submission:", JSON.stringify(payload, null, 2));

    try {
      const response = await axios.post(
        "http://192.168.22.247:5229/ums/api/UserManagement/user_create",
        payload
      );

      if (response.status === 200 || response.status === 201) {
        alert("User registered successfully!");
        // navigate("/login");
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      setheadersError(
        error.response?.data?.message
          ? `Registration failed: ${error.response.data.message}`
          : "Registration failed: Something went wrong."
      );
      alert(
        error.response?.data?.message
          ? `Registration failed: ${error.response.data.message}`
          : "Registration failed: Something went wrong."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F172A] p-6">
      <div className="w-full max-w-md bg-[#111827] rounded-2xl shadow-2xl p-8 space-y-6 text-white">
        {/* Logo + Title */}
        <div className="flex items-center justify-center">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full mr-2" />
          {/* <h1 className="text-xl font-semibold">Dashdark X</h1> */}
        </div>

        <h2 className="text-2xl font-bold text-center">user creation</h2>


        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            maxLength="15"
            value={form.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-[#1E293B] text-white border rounded-md focus:outline-none focus:ring-2 ${usernameValid ? 'border-gray-600' : 'border-red-500'}`}
            required
          />
          {!usernameValid && <p className="text-sm text-red-400">Name should contain only alphabets.</p>}

          <input
            type="number"
            name="age"
            placeholder="Your Age"
            value={form.age}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-[#1E293B] text-white border rounded-md focus:outline-none focus:ring-2 ${ageError ? 'border-red-500' : 'border-gray-600'}`}
            required
          />
          {ageError && <p className="text-sm text-red-400">{ageError}</p>}

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-[#1E293B] text-white border rounded-md focus:outline-none focus:ring-2 ${emailValid ? 'border-gray-600' : 'border-red-500'}`}
            required
          />
          {!emailValid && <p className="text-sm text-red-400">Email must end with "@gmail.com".</p>}

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Your Password"
              value={form.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-[#1E293B] text-white border rounded-md pr-12 focus:outline-none focus:ring-2 ${passwordValid ? 'border-gray-600' : 'border-red-500'}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-sm text-gray-400 hover:text-white"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {!passwordValid && (
            <p className="text-sm text-red-400">
              Password must be 8+ characters, with uppercase, lowercase, number, and symbol.
            </p>
          )}

          {/* Dropdown */}
          <select
            name="usertype"
            value={form.usertype}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[#1E293B] text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2"
            required
          >
            <option value="">Select User Type</option>
            <option value="Super User">Super User</option>
            <option value="Maker">Maker</option>
            <option value="Checker">Checker</option>
          </select>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-700 hover:to-indigo-700 transition text-white font-semibold"
          >
            Create User
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400">
          Already have an account? <a href="\" className="text-fuchsia-500 hover:underline">Login</a>
        </p>
      </div>
    </div>

  );
}
