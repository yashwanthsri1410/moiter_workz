import React, { useEffect, useState } from "react";
import axios from "axios";
import backgroundImg from "../assets/background.jpeg";
import logo from "../assets/favicon.png";

const Modulescreen = () => {
  const [moduleDesc, setModuleDesc] = useState("");
  const [screenDesc, setScreenDesc] = useState("");
  const [deptData, setDeptData] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedDesignationId, setSelectedDesignationId] = useState("");

  // Fetch department/designation data
  useEffect(() => {
    axios
      .get("http://192.168.22.247/api/Department/departments")
      .then((res) => setDeptData(res.data))
      .catch((err) => {
        console.error("Failed to fetch departments:", err);
        alert("Failed to load department data.");
      });
  }, []);

  // Extract unique departments for dropdown
  const uniqueDepartments = [
    ...new Map(deptData.map((item) => [item.deptId, item])).values(),
  ];

  // Filter designations based on selected department
  const filteredDesignations = deptData.filter(
    (item) => item.deptId.toString() === selectedDept
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!moduleDesc || !screenDesc || !selectedDesignationId) {
      alert("Please fill all the fields.");
      return;
    }

    const payload = {
      moduleDescription: moduleDesc,
      screenDesc: screenDesc,
      designationId: parseInt(selectedDesignationId),
    };
// console.log(payload)
    try {
      await axios.post(
        "http://192.168.22.247/api/Department/Module", // ✅ Replace with actual API
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      alert("Data submitted successfully!");
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to submit data.");
    }
  };
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl p-8 shadow-lg space-y-6">
        <div className="text-center">
          <img src={logo} alt="Logo" className="w-12 h-12 mx-auto mb-2" />
          <h2 className="text-2xl font-bold">Module Setup</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold">
              Module Description
            </label>
            <input
              type="text"
              value={moduleDesc}
              onChange={(e) => setModuleDesc(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-md"
              placeholder="Enter module description"
              maxLength={25}
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
              maxLength={25}
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
                setSelectedDesignationId(""); // reset designation
              }}
              required
            >
              <option value="">-- Select Department --</option>
              {uniqueDepartments.map((dept) => (
                <option key={dept.deptId} value={dept.deptId}>
                  {dept.deptName}
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
                    {des.designationName} (ID: {des.designationId})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modulescreen;
