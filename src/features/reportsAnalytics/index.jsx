import React, { useEffect, useState } from "react";
import "../../styles/styles.css";
import { ChartColumn, BookText, Download, Calendar } from "lucide-react";
import "../../styles/styles.css";
import axios from "axios";
import StatCards from "../../components/reusable/statCards";
import { primaryColor } from "../../constants";

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
      color: primaryColor,
    },
    {
      title: "Compliance Reports",
      value: 12,
      desc: "Quarterly pending",
      icon: BookText,
      color: primaryColor,
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
  return <StatCards stats={stats} />;
};

export default ReportsAndAnalytics;
