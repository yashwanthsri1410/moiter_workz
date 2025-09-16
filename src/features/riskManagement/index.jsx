import React, { useEffect, useState } from "react";
import "../../styles/styles.css";
import { ShieldAlert, TrendingUp, TriangleAlert, Users } from "lucide-react";
import "../../styles/styles.css";
import axios from "axios";
import StatCards from "../../components/reusable/statCards";
const RiskManagement = () => {
  const [riskData, setRiskData] = useState({});
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const progress = 40; // progress percentage
  const riskLevel = "Medium";

  const fetchData = async () => {
    const res = await axios.get(`${API_BASE_URL}/fes/api/Export/partner-per`);
    const data = res.data;
    setRiskData(data);
  };
  const stats = [
    {
      title: "High Risk Wallets",
      value: 128,
      subValue: "+2",
      desc: "flagged today",
      icon: ShieldAlert,
      color: "#ff6467",
      subColor: "#ff6467",
    },
    {
      title: "Risk Score Average",
      value: 42.3,
      subValue: "-2.1%",
      desc: "from last week",
      icon: TrendingUp,
      color: "#ffeb00",
      subColor: "#05df72",
    },
    {
      title: "Fraud Alerts",
      value: 23,
      subValue: "-12%",
      desc: "vs yesterday",
      icon: TriangleAlert,
      color: "#ff6467",
      subColor: "#05df72",
    },
    {
      title: "Under Review",
      value: 67,
      desc: "Manual review pending",
      icon: Users,
      color: "#51a2ff",
    },
  ];

  useEffect(() => {
    // fetchData();
  }, []);
  return (
    <div className="mx-5">
      <StatCards stats={stats} />
      <div className="stat-card-dx91u corner-box p-2 shadow-md rounded-lg mt-5">
        {/* Header */}
        <h2 className="text-[#00d4aa] text-sm">Risk Management Dashboard</h2>
        <div className="flex justify-between items-center mt-3">
          <p className="text-gray-400 text-sm mt-2">Overall Risk Level</p>

          {/* Badge */}
          <span className="bg-[#f0b10033] text-[#fdc700] text-xs px-2 py-1 rounded-full border border-yellow-600">
            {riskLevel}
          </span>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="w-full bg-teal-900/40 rounded-full h-3">
            <div
              className="bg-teal-400 h-3 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskManagement;
