import React, { useEffect, useState } from "react";
import "../../styles/styles.css";
import { Settings, Shield, Globe, Bell } from "lucide-react";
import "../../styles/styles.css";
import axios from "axios";
import StatCards from "../../components/reusable/statCards";

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
  return <StatCards stats={stats} />;
};

export default SystemSettings;
