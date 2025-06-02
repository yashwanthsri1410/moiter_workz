import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImg from "../assets/background.jpeg";
import logo from "../assets/favicon.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5002/User/login", {
        username,
        password,
      });
      const user = response.data;

      if (user.userType === 1) {
        navigate("/signup");
      } else if ([2, 3, 4].includes(user.userType)) {
        navigate("/dashboard");
      } else {
        alert("Unknown user type");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid username or password");
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
          {/* <div className="w-12 h-12 mx-auto bg-gray-300 rounded-full mb-4"></div> */}
          <div className=" inset-0 flex items-start justify-center p-4 z-[99] rounded-full">
            <img src={logo} alt="Logo" className="w-12 h-12 rounded-full" />
          </div>
          <h2 className="text-2xl font-bold">Log in</h2>
          <p className="text-sm text-gray-500 mt-1">
            Don’t have an account?{" "}
            <a href="#" className="text-blue-600 underline">
              Sign up
            </a>
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <button className="flex items-center justify-center w-full border border-gray-300 rounded-full py-2 hover:bg-gray-100 transition">
            <img
              src="https://img.icons8.com/color/48/facebook-new.png"
              alt="facebook"
              className="w-5 h-5 mr-2"
            />
            Log in with Facebook
          </button>
          <button className="flex items-center justify-center w-full border border-gray-300 rounded-full py-2 hover:bg-gray-100 transition">
            <img
              src="https://img.icons8.com/color/48/google-logo.png"
              alt="google"
              className="w-5 h-5 mr-2"
            />
            Log in with Google
          </button>
        </div>

        <div className="my-6 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-bold text-gray-800">Your email</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-bold text-gray-800">Your password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1 w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          onClick={async () => {
            try {
              const res = await axios.post("http://localhost:5002/User/login", {
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
          className="w-full bg-green-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-green-600"
        >
          Test API
        </button>
      </div>
    </div>
  );
};

export default Login;
