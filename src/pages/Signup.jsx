import React, { useEffect, useState } from "react";
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
    usertype: "1",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5002/User/register",
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

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = "http://localhost:5002/User/usertypes";

    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className=" inset-0 flex items-start justify-center p-4 z-[99] rounded-full">
          <img src={logo} alt="Logo" className="w-12 h-12 rounded-full" />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-2">Sign up</h2>
        <p className="text-sm text-center text-gray-500 mb-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer"
          >
            Log in
          </span>
        </p>

        <div className="flex items-center gap-4 mb-4">
          <hr className="flex-grow border-gray-300" />
          <span className="text-gray-400 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="text"
            name="age"
            placeholder="Age"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="text"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
          <select
            name="usertype"
            onChange={handleChange}
            value={form.usertype}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="1">Admin</option>
            <option value="2">User</option>
            <option value="3">Editor</option>
            <option value="4">Viewer</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        <button
          type="button"
          onClick={async () => {
            try {
              const res = await axios.post(
                "http://localhost:5002/User/usertypes",
                {
                  name: "Test User",
                  age: "25",
                  email: "test@example.com",
                  password: "test123",
                  username: "testuser",
                  usertype: "1",
                }
              );
              alert("API is working! Response: " + JSON.stringify(res.data));
            } catch (err) {
              alert(
                err.response
                  ? "API Error: " + err.response.data.message
                  : "API not reachable."
              );
            }
          }}
          className="bg-green-500 text-white px-4 py-2 mt-4 w-full"
        >
          Test API
        </button>
      </div>
    </div>
  );
}
