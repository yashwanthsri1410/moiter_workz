import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import usePublicIp from "../hooks/usePublicIp";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  AlertTriangle,
  ArrowRight,
  Shield,
  Fingerprint,
} from "lucide-react";
import logo from "../assets/logo.png";
import "../styles/styles.css";

const Employeelogin = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [particles, setParticles] = useState([]);

  const navigate = useNavigate();
  const ip = usePublicIp();

  // Floating particles
  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 23; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.1,
        speed: Math.random() * 0.5 + 0.2,
        direction: Math.random() * Math.PI * 2,
      });
    }
    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: (p.x + Math.cos(p.direction) * p.speed) % 100,
          y: (p.y + Math.sin(p.direction) * p.speed) % 100,
          direction: p.direction + (Math.random() - 0.5) * 0.1,
        }))
      );
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const getMetadata = () => {
    const timestamp = new Date().toISOString();
    return {
      ipAddress: ip || "127.0.0.1",
      userAgent: navigator.userAgent,
      headers: JSON.stringify({ "content-type": "application/json" }),
      channel: "WEB",
      auditMetadata: {
        createdBy: formData.username,
        createdDate: timestamp,
        modifiedBy: formData.username,
        modifiedDate: timestamp,
      },
    };
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!formData.username || !formData.password) {
      setError("Please enter both username and password");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.22.247:5229/ums/api/UserManagement/user_login",
        {
          username: formData.username,
          password: formData.password,
          metadata: getMetadata(),
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const user = response.data.message;
      if (!user) {
        setError("Login failed. User not found.");
        setIsLoading(false);
        return;
      }
      localStorage.setItem("username", user.username);
      localStorage.setItem("userType", user.userType);

      switch (user.userType) {
        case 1:
          navigate("/superuser-workplace");
          break;
        case 4:
          navigate("/Makers-dashboard");
          break;
        case 3:
          navigate("/Checkers-dashboard");
          break;
        default:
          navigate("/Makers-creation");
          break;
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Invalid username or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Particles */}
      <div className="particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size * 1}px`,
              height: `${p.size * 1}px`,
              borderRadius: "50%",
              backgroundColor: "#10B981",
              opacity: p.opacity + 5,
            }}
          />
        ))}
      </div>

      {/* Container */}
      <div className="login-box">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>

        <div className="login-card ">
          {/* Neon corners */}
          <div className="corner tl"></div>
          <div className="corner tr"></div>
          <div className="corner bl"></div>
          <div className="corner br"></div>
          <span className="corner-bottom-left"></span>
          <span className="corner-bottom-right"></span>
          <div className="login-header">
            <div className="secure-badge">
              <Shield className="icon" />
              <span>Secure Access</span>
              <div className="dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
            <p>Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Username */}
            <div className="form-group">
              <label>
                <User className="form-icon" /> Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label>
                <Lock className="form-icon" /> Password
              </label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="error-msg">
                <AlertTriangle className="icon" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? (
                "Authenticating..."
              ) : (
                <>
                  <Fingerprint className="login-btn-icon" /> Login
                  <ArrowRight className="login-btn-icon " />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="login-footer">
            <span> SSL Secured</span>
            <span> 256-bit Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employeelogin;
