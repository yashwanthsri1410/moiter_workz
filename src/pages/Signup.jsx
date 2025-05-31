// src/pages/Signup.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // <-- add this

export default function Signup() {
  const navigate = useNavigate(); // <-- initialize navigate

  const [form, setForm] = useState({
    username: "",
    age: "",
    email: "",
    password: "",
    usertype: "1", // default to 1
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5002/register", form);
      if (response.status === 200 || response.status === 201) {
        alert("User registered!");
        navigate("/login"); // <-- navigate after successful signup
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
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto space-y-4">
      <input
        type="text"
        name="username"
        placeholder="Username"
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input
        type="text"
        name="age"
        placeholder="Age"
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input
        type="text"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <select
        name="usertype"
        onChange={handleChange}
        value={form.usertype}
        className="border p-2 w-full"
        required
      >
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">
        Sign Up
      </button>

      <button
        type="button"
        onClick={() => navigate("/login")} // <-- navigation button
        className="bg-gray-500 text-white px-4 py-2 ml-2"
      >
        Go to Login
      </button>

      <button
        type="button"
        onClick={async () => {
          try {
            const res = await axios.post("http://localhost:5002/register", {
              name: "Test User",
              age: "25",
              email: "test@example.com",
              password: "test123",
              username: "testuser",
              usertype: "1",
            });
            alert("API is working! Response: " + JSON.stringify(res.data));
          } catch (err) {
            if (err.response) {
              alert("API Error: " + err.response.data.message);
            } else {
              alert("API not reachable. Check if backend is running.");
            }
          }
        }}
        className="bg-green-500 text-white px-4 py-2 mt-4"
      >
        Test API
      </button>
    </form>
  );
}
