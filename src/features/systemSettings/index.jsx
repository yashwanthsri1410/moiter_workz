import React, { useEffect, useState } from "react";
import "../../styles/styles.css";
import { Settings, Shield, Globe, Bell } from "lucide-react";
import "../../styles/styles.css";
import axios from "axios";

const SystemSettings = () => {
  const [settingsData, setSettingsData] = useState({});
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const fetchData = async () => {
    const res = await axios.get(`${API_BASE_URL}/fes/api/Export/partner-per`);
    const data = res.data;
    setSettingsData(data);
  };
  const stats = [
    {
      title: "System Health",
      value: "98.7%",
      desc: "All systems operational",
      icon: Settings,
      color: "#05df72",
    },
    {
      title: "Security Status",
      value: "Secure",
      desc: "No threats detected",
      icon: Shield,
      color: "#05df72",
    },
    {
      title: "API Status",
      value: "99.9%",
      desc: "Uptime this month",
      icon: Globe,
      color: "#00d4aa",
    },
    {
      title: "Notifications",
      value: 3,
      desc: "Pending alerts",
      icon: Bell,
      color: "#ffeb00",
    },
  ];

  useEffect(() => {
    // fetchData();
  }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-5 mt-5">
      {stats.map(({ title, value, desc, icon: Icon, color }, i) => (
        <div
          key={i}
          className="stat-card-dx91u corner-box p-4 shadow-md rounded-lg"
        >
          <div className="card-header-dx91u flex items-center justify-between mb-2">
            <h3>{title}</h3>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <div className="[line-height:23px]">
            <p className="text-[25px]" style={{ color }}>
              {value?.toLocaleString("en-IN")}
            </p>
            <span className="text-[#94a3b8] text-[11px]">{desc}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SystemSettings;
