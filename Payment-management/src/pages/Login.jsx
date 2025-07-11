import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImg from "../assets/background.jpeg";
import logo from "../assets/favicon.png";

const Login = ({ setRole }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://192.168.22.247/us/api/Department/super-user-login",
        {
          name: username.trim(),
          password: password.trim(),
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const user = response.data.user;
      localStorage.setItem("username", user.name);
      setRole(user.userType);
      console.log(response)
      if (user.userType === 1) {
        navigate("/Employee-Registration");
      } else if ([2, 3, 4].includes(user.userType)) {
        navigate("/Dashboard");
      } else {
        alert("Unknown user type.");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Invalid username or password.");
    }
  };

  const handleApiTest = async () => {
    const testUsername = "admin";
    const testPassword = "admin123";

    try {
      const response = await axios.post(
        "http://192.168.22.247/us/api/Department/super-user-login",
        {
          name: testUsername.trim(),
          password: testPassword.trim(),
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const user = response.data.user;
      localStorage.setItem("username", user.name);
      setRole(user.userType);

      if (user.userType === 1) {
        navigate("/Employee-Registration");
      } else if ([2, 3, 4].includes(user.userType)) {
        navigate("/Dashboard");
      } else {
        alert("Unknown user type.");
      }
    } catch (err) {
      console.error("API test error:", err.response?.data || err.message);
      alert(
        err.response?.data?.message ||
        "API not reachable. Check if backend is running."
      );
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl p-8 shadow-lg">
        <div className="text-center">
          <div className="inset-0 flex items-start justify-center p-4 z-[99] rounded-full">
            <img src={logo} alt="Logo" className="w-12 h-12 rounded-full" />
          </div>
          <h2 className="text-2xl font-bold">Log in</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-bold text-gray-800">Your Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your Username"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="text-bold text-gray-800">Your Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1 w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          <div className="text-right">
            <a href="#" className="text-sm text-gray-600 underline">
              Forgot your password
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-full cursor-pointer hover:bg-gray-400"
          >
            Log in
          </button>
        </form>

        <button
          type="button"
          onClick={handleApiTest}
          className="w-full bg-blue-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-600"
        >
          Test Login as Super User
        </button>
      </div>
    </div>
  );
};

export default Login;