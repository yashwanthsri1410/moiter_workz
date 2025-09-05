import React, { useState } from "react";
import Headers from "../components/Header";
import banner from "../assets/banner.png";
import {
  ArrowDown,
  Mail,
  MapPin,
  HelpCircle,
  Users,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ⬇️ optional hook to fetch public IP
const usePublicIp = () => {
  const [ip, setIp] = useState("");
  React.useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setIp(data.ip))
      .catch(() => setIp("127.0.0.1"));
  }, []);
  return ip;
};

const EmployeeCreateForm = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const ip = usePublicIp();

  const [formData, setFormData] = useState({
    empId: "",
    deptId: "",
    designationId: "",
    name: "",
    email: "",
    password: "",
    statusId: "",
    roleAccessId: "",
    createdBy: username || "",
    userType: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const scrollToFooter = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  // metadata generator
  const getMetadata = () => {
    const timestamp = new Date().toISOString();
    return {
      ipAddress: ip || "127.0.0.1",
      userAgent: navigator.userAgent,
      headers: JSON.stringify({ "content-type": "application/json" }),
      channel: "WEB",
      auditMetadata: {
        createdBy: formData.createdBy,
        createdDate: timestamp,
        modifiedBy: formData.createdBy,
        modifiedDate: timestamp,
        header: {
          additionalProp1: {
            options: { propertyNameCaseInsensitive: true },
            parent: "string",
            root: "string",
          },
        },
      },
    };
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        empId: Number(formData.empId),
        deptId: Number(formData.deptId),
        designationId: Number(formData.designationId),
        statusId: Number(formData.statusId),
        roleAccessId: Number(formData.roleAccessId),
        userType: Number(formData.userType),
        metadata: getMetadata(),
      };

      console.log("Payload:", payload);

      const response = await axios.post(
        "http://192.168.22.247/ums/api/UserManagement/createEmployee",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      alert("✅ Employee created successfully!");
      console.log("Response:", response.data);
      navigate("/Employee-creation"); // redirect if needed
    } catch (err) {
      console.error("❌ Create employee error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Employee creation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Headers />
      <div className="flex min-h-screen bg-[#081028] text-white">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0A1330] border-r border-[#1a233a] p-4 flex flex-col justify-between">
          <div>
            <nav className="space-y-2 text-sm">
              <div
                className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-[#151f42] cursor-pointer"
                onClick={() => navigate("/Employee-creation")}
              >
                <UserPlus className="w-4 h-4 text-gray-400" />
                <span>Employee creation</span>
              </div>
              <div
                className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-[#151f42] cursor-pointer"
                onClick={() => navigate("/customer-On-boarding")}
              >
                <Users className="w-4 h-4 text-gray-400" />
                <span>Customer on boarding</span>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold mb-4">
            Welcome, <span className="text-yellow-300">{username}</span>
          </h1>

          {/* Employee Creation Form */}
          <div className="bg-[#0A1330] p-6 rounded-lg shadow-lg border border-[#1a233a] max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Create Employee</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {Object.keys(formData).map((field) => (
                <div key={field} className="flex flex-col">
                  <label className="capitalize text-sm mb-1">{field}</label>
                  <input
                    type={field === "password" ? "password" : "text"}
                    value={formData[field]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [field]: e.target.value,
                      }))
                    }
                    className="p-2 rounded bg-[#151f42] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    required
                  />
                </div>
              ))}

              {error && <p className="text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-500 transition-colors"
              >
                {isLoading ? "Creating..." : "Create Employee"}
              </button>
            </form>
          </div>
        </main>

        {/* Floating scroll to footer button */}
        <button
          onClick={scrollToFooter}
          className="fixed bottom-6 right-6 bg-[#151f42] p-3 rounded-full shadow-lg hover:bg-[#1e2a5a] transition-colors"
          aria-label="Scroll to footer"
        >
          <ArrowDown className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-[#0A1330] text-white border-t border-[#1a233a]">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Contact Info */}
            <div className="flex flex-col md:flex-row gap-8 w-full md:w-auto">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium">Help & Support</h4>
                  <p className="text-gray-400 text-sm">Available 24/7</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium">Email</h4>
                  <a
                    href="mailto:sales@moiterworkz.com"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    sales@moiterworkz.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium">Address</h4>
                  <p className="text-gray-400 text-sm">
                    Guindy, Chennai, Tamil Nadu
                  </p>
                </div>
              </div>
            </div>

            <div className="text-gray-400 text-sm md:text-base">
              <p>© {new Date().getFullYear()} Moiterworkz. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default EmployeeCreateForm;
