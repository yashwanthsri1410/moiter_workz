import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import backgroundImg from "../assets/background.jpeg";
import logo from "../assets/favicon.png";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
    usertype: "",
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
    Maker: 2,
    Checker: 3,
    User: 4,
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

    const payload = {
      name: form.name.trim(),
      age: parseInt(form.age, 10),
      email: form.email.trim(),
      password: form.password,
      usertype: userTypeMap[form.usertype],
    };

    try {
      const response = await axios.post(
        "http://192.168.22.247/api/Department/create-super-user",
        payload
      );
      if (response.status === 200 || response.status === 201) {
        alert("User registered!");
        navigate("/login");
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      alert(
        error.response?.data?.message
          ? `Registration failed: ${error.response.data.message}`
          : "Registration failed: Something went wrong."
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
            name="name"
            placeholder="Name"
            maxLength="15"
            value={form.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md ${
              usernameValid ? "border-gray-300" : "border-red-500"
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
            <option value="User">User</option>
          </select>

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
