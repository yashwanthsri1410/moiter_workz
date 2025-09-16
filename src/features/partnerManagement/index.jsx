import React, { useEffect, useState } from "react";
import "../../styles/styles.css";
import { BookText, TrendingUp, CheckCircle, Users } from "lucide-react";
import "../../styles/styles.css";
import axios from "axios";
import StatCards from "../../components/reusable/statCards";
const PartnerMangement = () => {
  const [partnerData, setPartnerData] = useState({});
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const fetchData = async () => {
    const res = await axios.get(
      `${API_BASE_URL}/fes/api/Export/partner-performance`
    );
    const data = res.data;
    setPartnerData(data);
  };

  const stats = [
    {
      title: "Active Partners",
      value: partnerData?.activePartners,
      desc: "Distribution network",
      icon: BookText,
      color: "#00d4aa",
    },
    {
      title: "Safe Performers",
      value: partnerData?.safePerformers,
      desc: "Above target partners",
      icon: TrendingUp,
      color: "#05df72",
    },
    {
      title: "Verified Partners",
      value: partnerData?.verifiedPartners,
      desc: "96.1% compliance rate",
      icon: CheckCircle,
      color: "#00d4aa",
    },
    {
      title: "New Partners",
      value: partnerData?.newPartners,
      desc: "This month",
      icon: Users,
      color: "#ffeb00",
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);
  return <StatCards stats={stats} />;
};

export default PartnerMangement;
