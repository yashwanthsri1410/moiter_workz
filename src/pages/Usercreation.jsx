import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import backgroundImg from "../assets/background.jpeg";
import logo from "../assets/favicon.png";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    age: "",
    email: "",
    password: "",
    Empid: "",
    department: "",
    position: "",
  });

  const [emailValid, setEmailValid] = useState(true);
  const [ageError, setAgeError] = useState("");
  const [passwordValid, setPasswordValid] = useState(true);
  const [usernameValid, setUsernameValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmailValid(value.endsWith("@gmail.com"));
    }

    if (name === "username") {
      setUsernameValid(/^[A-Za-z]+$/.test(value) || value === "");
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

    if (name === "department") {
      setForm({ ...form, department: value, position: "" });
      return;
    }

    if (name === "Empid") {
      if (/^\d{0,4}$/.test(value)) {
        setForm({ ...form, Empid: value });
      }
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const age = parseInt(form.age, 10);

    if (!emailValid) {
      alert("Email must end with '@gmail.com'.");
      return;
    }

    if (!usernameValid) {
      alert("Username should contain only alphabets.");
      return;
    }

    if (!passwordValid) {
      alert(
        "Password must be at least 8 characters with uppercase, lowercase, number, and symbol."
      );
      return;
    }

    if (form.Empid.length !== 4) {
      alert("Employee ID must be exactly 4 digits.");
      return;
    }

    if (ageError) {
      alert("Please correct the age field.");
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.22.247:5002/User/register-employee",
        form
      );
      if (response.status === 200 || response.status === 201) {
        alert("User registered!");
        navigate("/login");
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        alert(`Registration failed: ${error.response.data.message}`);
      } else {
        alert("Registration failed: Something went wrong.");
      }
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
        <p className="text-sm text-center text-gray-500 mb-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer"
          >
            Log in
          </span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="username"
            placeholder="Username"
            maxLength="15"
            value={form.username}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md ${
              usernameValid ? "border-gray-300" : "border-red-500"
            }`}
            required
          />
          {!usernameValid && (
            <p className="text-sm text-red-600 mt-1">
              Username should contain only alphabets.
            </p>
          )}

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md ${
              ageError ? "border-red-500" : "border-gray-300"
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
            className={`w-full px-4 py-2 border rounded-md ${
              emailValid ? "border-gray-300" : "border-red-500"
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
              className={`w-full px-4 py-2 border rounded-md pr-12 ${
                passwordValid ? "border-gray-300" : "border-red-500"
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

          <input
            type="text"
            name="Empid"
            placeholder="Employee ID (4-digit number)"
            maxLength="4"
            value={form.Empid}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md border-gray-300"
            required
          />

          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Department</option>
            <option value="IT department">IT department</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="developer">developer</option>
            <option value="Testing">Testing</option>
          </select>

          <select
            name="position"
            value={form.position}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Position</option>
            {form.department === "Finance" ? (
              <>
                <option value="Finance Manager">Finance Manager</option>
                <option value="Budget Analyst">Budget Analyst</option>
                <option value="Cost Accountant">Cost Accountant</option>
              </>
            ) : form.department ? (
              <>
                <option value="Manager">Manager</option>
                <option value="Senior Employee">Senior Employee</option>
                <option value="Junior Employee">Junior Employee</option>
              </>
            ) : null}
          </select>

          {form.position && (
            <div className="bg-gray-100 border border-gray-300 rounded-md p-3 mb-3">
              <h4 className="font-semibold mb-1">Accessible Pages:</h4>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {form.position === "Manager" && (
                  <>
                    <li>Dashboard Page</li>
                    <li>Profile Page</li>
                    <li>Product Page</li>
                  </>
                )}
                {form.position === "Senior Employee" && (
                  <>
                    <li>Dashboard Page</li>
                    <li>Product Page</li>
                  </>
                )}
                {form.position === "Junior Employee" && (
                  <li>Dashboard Page</li>
                )}
                {form.department === "Finance" &&
                  form.position === "Finance Manager" && (
                    <>
                      <li>Dashboard Page</li>
                      <li>Profile Page</li>
                      <li>Product Page</li>
                    </>
                  )}
                {form.department === "Finance" &&
                  form.position === "Budget Analyst" && (
                    <>
                      <li>Dashboard Page</li>
                      <li>Product Page</li>
                    </>
                  )}
                {form.department === "Finance" &&
                  form.position === "Cost Accountant" && (
                    <li>Dashboard Page</li>
                  )}
              </ul>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
