import React, { useEffect, useState } from "react";
import axios from "axios";
import backgroundImg from "../assets/background.jpeg";
import logo from "../assets/favicon.png";
import usePublicIp from "../hooks/usePublicIp";

const RoleSetup = () => {
  const [roleDescription, setRoleDescription] = useState("");
  const [screenDesc, setScreenDesc] = useState("");
  const [deptData, setDeptData] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedDesignationId, setSelectedDesignationId] = useState("");

  const ip = usePublicIp();
  useEffect(() => {
  axios
    .get("http://192.168.22.247:7227/api/CombinedDetails/departments")
    .then((res) => {
      // console.log("Fetched data:", res.data); // ✅ confirm it's coming
      setDeptData(res.data);
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      alert("Failed to load department/designation data.");
    });
}, []);


  // Extract unique departments
  const uniqueDepartments = [
    ...new Map(deptData.map((item) => [item.deptId, item])).values(),
  ];

  // Get designations filtered by selected department
  const filteredDesignations = deptData.filter(
    (item) => item.deptId.toString() === selectedDept
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roleDescription || !screenDesc || !selectedDesignationId) {
      alert("Please fill all the fields.");
      return;
    }

    const payload = {
      roleId: 0,
      roleDescription,
      screenId: 0,
      screenDesc,
      roleAccess: 0,
      designationId: parseInt(selectedDesignationId),
      metadata: {
             ipAddress: ip || "UNKNOWN",
        userAgent: navigator.userAgent,
        headers: "custom-header",
        channel: "web",
        auditMetadata: {
           createdBy: username,
          createdDate: new Date().toISOString(),
         modifiedBy: username,
          modifiedDate: new Date().toISOString(),
          header: {
            additionalProp1: {
              options: { propertyNameCaseInsensitive: true },
              parent: "parent1",
              root: "root1",
            },
          },
        },
      },
    };

    try {
      await axios.post(
        "http://192.168.22.247/us/api/Department/Role",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      alert("Role submitted successfully!");
    } catch (error) {
      console.error("Submission failed:", error);
      alert(
        "Submission failed: " +
          (error?.response?.data?.message || "Unknown error")
      );
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl p-8 shadow-lg space-y-6">
        <div className="text-center">
          <img src={logo} alt="Logo" className="w-12 h-12 mx-auto mb-2" />
          <h2 className="text-2xl font-bold">Role Setup</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold">
              Role Description
            </label>
            <input
              type="text"
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-md"
              placeholder="Enter role description"
              maxLength={50}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Screen Description
            </label>
            <input
              type="text"
              value={screenDesc}
              onChange={(e) => setScreenDesc(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-md"
              placeholder="Enter screen description"
              maxLength={50}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Select Department
            </label>
            <select
              className="w-full mt-1 px-4 py-2 border rounded-md"
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setSelectedDesignationId("");
              }}
              required
            >
              <option value="">-- Select Department --</option>
              {uniqueDepartments.map((dept) => (
                <option key={dept.deptId} value={dept.deptId}>
                  {dept.deptName || `Dept #${dept.deptId}`}
                </option>
              ))}
            </select>
          </div>

          {selectedDept && (
            <div>
              <label className="block text-gray-700 font-semibold">
                Select Designation
              </label>
              <select
                className="w-full mt-1 px-4 py-2 border rounded-md"
                value={selectedDesignationId}
                onChange={(e) => setSelectedDesignationId(e.target.value)}
                required
              >
                <option value="">-- Select Designation --</option>
                {filteredDesignations.map((des) => (
                  <option key={des.designationId} value={des.designationId}>
                    {des.designationName || `Designation #${des.designationId}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Submit Role
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoleSetup;
