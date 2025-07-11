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
    const commonAuditId = "3fa85f64-5717-4562-b3fc-2c963f66afa6"; // You can dynamically generate this or get from context

    const payload = {
      user: {
        name: form.name.trim(),
        age: parseInt(form.age, 10),
        email: form.email.trim(),
        password: form.password,
        userType: userTypeMap[form.usertype],
      },
      metadata: {
        ipAddress: ip || "UNKNOWN",
        userAgent: window.navigator.userAgent,
        headers: JSON.stringify({
          language: navigator.language,
          platform: navigator.platform,
        }),
        channel: "WEB",
        headers: headersError,
        auditMetadata: {
          createdBy: commonAuditId,
          createdDate: now,
          modifiedBy: commonAuditId,
          modifiedDate: now,
          header: {
            additionalProp1: {
              options: { propertyNameCaseInsensitive: true },
              parent: "SignupForm",
              root: "UserModule",
            },
            additionalProp2: {
              options: { propertyNameCaseInsensitive: true },
              parent: "SignupForm",
              root: "UserModule",
            },
            additionalProp3: {
              options: { propertyNameCaseInsensitive: true },
              parent: "SignupForm",
              root: "UserModule",
            },
          },
        },
      },
    };
    // console.log("Submitting to:", "http://192.168.22.247/us/api/Department/create-superuser");
    // console.log("Payload:", payload);
    // console.log("Payload:", JSON.stringify(payload, null, 2));

    try {
      const response = await axios.post(
        "http://192.168.22.247/us/api/Department/create-superuser",
        payload
      );

      if (response.status === 200 || response.status === 201) {
        alert("User registered successfully!");
        navigate("/login");
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      // console.log("???????????", error)
      setheadersError(error.response?.data?.message ? `Registration failed: ${error.response.data.message}` : "Registration failed: Something went wrong.",),
        alert(
          error.response?.data?.message ? `Registration failed: ${error.response.data.message}` : error?.response?.data ? "Registration failed: Something went wrong." : "",
        );
    }
  };


  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start bg-cover bg-center relative p-6"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0" />
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-8 mb-6">
        <div className="flex items-start justify-center p-4 z-[99] rounded-full">
          <img src={logo} alt="Logo" className="w-12 h-12 rounded-full" />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-2">
          User creation
        </h2>
        {/* <p className="text-sm text-center text-gray-500 mb-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/Employee-Login")}
            className="text-blue-600 cursor-pointer"
          >
            Log in
          </span>
        </p> */}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Name"
            maxLength="15"
            value={form.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md ${usernameValid ? "border-gray-300" : "border-red-500"
              }`}
            required
          />
          {!usernameValid && (
            <p className="text-sm text-red-600 mt-1">
              Name should contain only alphabets.
            </p>
          )}

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md ${ageError ? "border-red-500" : "border-gray-300"
              }`}
            required
          />
          {ageError && (
            <p className="text-sm text-red-600 mt-1">{ageError}</p>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md ${emailValid ? "border-gray-300" : "border-red-500"
              }`}
            required
          />
          {!emailValid && (
            <p className="text-sm text-red-600 mt-1">
              Email must end with "@gmail.com".
            </p>
          )}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md pr-12 ${passwordValid ? "border-gray-300" : "border-red-500"
                }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-sm text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {!passwordValid && (
            <p className="text-sm text-red-600 mt-1">
              Password must be 8+ characters and include uppercase, lowercase,
              number, and special character.
            </p>
          )}

          <select
            name="usertype"
            value={form.usertype}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select User Type</option>
            <option value="Super User">Super User</option>
            <option value="Maker">Maker</option>
            <option value="Checker">Checker</option>
            {/* <option value="User">User</option> */}
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
           Create user
          </button>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="mx-3 text-gray-500 font-medium">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-10">
  <button
    onClick={() => navigate("/deptdesig")}
    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
  >
    Department & Designation Creation
  </button>

  <button
    onClick={() => navigate("/Modulescreen")}
    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
  >
    Role & Screen Access Creation
  </button>
</div>




      </div>
    </div>
  );
}
