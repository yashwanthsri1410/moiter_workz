import React, { useState, useEffect } from "react";
import axios from "axios";
import backgroundImg from "../assets/background.jpeg";
import logo from "../assets/favicon.png";
import { v4 as uuidv4 } from "uuid";
import usePublicIp from "../hooks/usePublicIp";

const Makerscreation = () => {
    const username = localStorage.getItem("username");
  const ip = usePublicIp();
  const [formData, setFormData] = useState({
    deptName: "",
    designationName: "",
    roleDescription: "",
    screenDesc: "",
  });

  const [metadata, setMetadata] = useState({
    ipAddress: ip,
    userAgent: navigator.userAgent,
    headers: "Content-Type: application/json", // example static header
    channel: "WEB",
    auditMetadata: {
       createdBy: username,
      createdDate: new Date().toISOString(),
     modifiedBy: username,
      modifiedDate: new Date().toISOString(),
      header: {
        additionalProp1: {
          options: { propertyNameCaseInsensitive: true },
          parent: "Department",
          root: "Root1",
        },
        additionalProp2: {
          options: { propertyNameCaseInsensitive: true },
          parent: "Department",
          root: "Root2",
        },
        additionalProp3: {
          options: { propertyNameCaseInsensitive: true },
          parent: "Department",
          root: "Root3",
        },
      },
    },
  });


  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      metadata,
    };

    try {
      const response = await axios.post(
        "http://192.168.22.247/us/api/Department/maker",
        payload
      );
      console.log("Success:", response.data);
      alert("Submitted successfully!");
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Submission failed!");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative px-4"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />
      <div className="relative z-10 bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="w-16 h-16" />
        </div>
        <h2 className="text-2xl font-bold text-center">Create Maker Entry</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="deptName"
            placeholder="Department Name"
            value={formData.deptName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="text"
            name="designationName"
            placeholder="Designation Name"
            value={formData.designationName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="text"
            name="roleDescription"
            placeholder="Role Description"
            value={formData.roleDescription}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="text"
            name="screenDesc"
            placeholder="Screen Description"
            value={formData.screenDesc}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Makerscreation;
