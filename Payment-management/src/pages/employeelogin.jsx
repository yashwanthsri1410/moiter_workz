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
    const [headersError, setheadersError] = useState("");
    const navigate = useNavigate();
    const ip = usePublicIp();

    const getMetadata = async () => {
        const timestamp = new Date().toISOString();
        const dummyId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

        return {
            ipAddress: ip,
            userAgent: navigator.userAgent,
            headers: headersError ? headersError : JSON.stringify({ "content-type": "application/json" }),
            headers: JSON.stringify({
                Accept: "application/json",
                ContentType: "application/json",
            }),
            channel: "WEB",
            auditMetadata: {
                createdBy: dummyId,
                createdDate: timestamp,
                modifiedBy: dummyId,
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
        const metadata = await getMetadata();

        try {
            const response = await axios.post(
                "http://192.168.22.247/us/api/Department/super-user-login",
                {
                    name: username,
                    password: password,
                    metadata: metadata
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            const user = response.data.user;
            localStorage.setItem("username", user.name);
            // setRole(user.userType);
            // console.log("?????????",user) 
            if (user.userType === 1) {
                navigate("/Usercreation");
            } else if (user.userType === 2) {
                navigate("/Employee-Registration");
            } else if (user.userType === 3) {
                navigate("/checkers-approval");
            } else {
                alert("Unknown user type.");
            }
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            setheadersError(" KYC Submission failed");
            alert(error.response?.data?.message || "Invalid username or password.");
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
                    <h2 className="text-2xl font-bold">Employee Log in</h2>
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
            </div>
        </div>
    );
};

export default Employeelogin;
