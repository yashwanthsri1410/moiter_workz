import React, { useEffect, useState } from "react";
import "../../styles/styles.css";
import { ChartColumn, BookText, Download, Calendar } from "lucide-react";
import "../../styles/styles.css";
import axios from "axios";

const ReportsAndAnalytics = () => {
  const [reportData, setReportData] = useState({});
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const fetchData = async () => {
    const res = await axios.get(`${API_BASE_URL}/fes/api/Export/partner-per`);
    const data = res.data;
    setReportData(data);
  };
  const stats = [
    {
      title: "Daily Reports",
      value: 47,
      desc: "Generated today",
      icon: ChartColumn,
      color: "#00d4aa",
    },
    {
      title: "Compliance Reports",
      value: 12,
      desc: "Quarterly pending",
      icon: BookText,
      color: "#00d4aa",
    },
    {
      title: "Downloads",
      value: 1847,
      desc: "This month",
      icon: Download,
      color: " #05df72",
    },
    {
      title: "Scheduled Reports",
      value: 156,
      desc: "Auto-generated",
      icon: Calendar,
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

export default ReportsAndAnalytics;
