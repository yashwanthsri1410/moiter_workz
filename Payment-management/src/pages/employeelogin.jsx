import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImg from "../assets/background.jpeg";
import logo from "../assets/favicon.png";
import usePublicIp from "../hooks/usePublicIp";

const Employeelogin = ({ setRole }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [headersError, setheadersError] = useState("Login error");
    // console.log("???????????",headersError)
    const user_name = localStorage.getItem("username");
    const navigate = useNavigate();
    const ip = usePublicIp();
    const getMetadata = () => {
        const timestamp = new Date().toISOString();

        return {
            ipAddress: ip || "127.0.0.1",
            userAgent: navigator.userAgent,
            headers: headersError ? headersError : JSON.stringify({ "content-type": "application/json" }),
            channel: "WEB",
            auditMetadata: {
                createdBy: username,
                createdDate: timestamp,
                modifiedBy: username,
                modifiedDate: timestamp,
                header: {
                    additionalProp1: {
                        options: { propertyNameCaseInsensitive: true },
                        parent: "string",
                        root: "string",
                    },
                    additionalProp2: {
                        options: { propertyNameCaseInsensitive: true },
                        parent: "string",
                        root: "string",
                    },
                    additionalProp3: {
                        options: { propertyNameCaseInsensitive: true },
                        parent: "string",
                        root: "string",
                    }
                }
            }
        };
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const metadata = getMetadata();
        try {
            const response = await axios.post(
                "http://192.168.22.247:5229/ums/api/UserManagement/user_login",
                {
                    username,
                    password,
                    metadata
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            const user = response.data.message;
            if (!user) {
                alert("Login failed. User not found.");
                return;
            }

            localStorage.setItem("username", user.name);
            localStorage.setItem("userType", user.userType);

            switch (user.userType) {
                case 1:
                    navigate("/Dashboard");
                    break;
                case 4:
                    navigate("/Employee-Registration");
                    break;
                case 3:
                    navigate("/checkers-approval");
                    break;
                default:
                    alert("/Makers-creation");
                    break;
            }
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            setheadersError("Login error" + error.response?.data || error.message);
            alert(error.response?.data?.message || "Invalid username or password.");
        }
    };

    return (
       <div className="min-h-screen bg-[#0d0f24] flex items-center justify-center px-4">
  <div className="w-full max-w-md bg-[#0f122d] rounded-xl shadow-lg p-8 text-white relative">
    
    {/* Centered Logo */}
    <div className="flex justify-center mb-4">
      <img src={logo} alt="Logo" className="w-10 h-10" />
    </div>

    {/* Centered Login Form */}
    <div className="text-center mt-2 mb-4">
      <h2 className="text-2xl font-bold mb-2">LogIn</h2>
    </div>

    {/* Login Form */}
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your username"
          className="w-full px-4 py-2 rounded-md bg-[#1a1d3b] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your Password"
          className="w-full px-4 py-2 rounded-md bg-[#1a1d3b] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-2.5 text-sm text-gray-400 cursor-pointer"
        >
          {showPassword ? "Hide" : "Show"}
        </span>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-400">
        <label className="flex items-center">
          <input type="checkbox" className="mr-2 accent-purple-500" />
          Remember me
        </label>
        {/* <a href="#" className="hover:text-purple-500">Forgot password?</a> */}
      </div>

      <button
        type="submit"
        className="w-full py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold text-white shadow-md hover:opacity-90"
      >
        Submit
      </button>
    </form>

  </div>
</div>

    );
};

export default Employeelogin;
