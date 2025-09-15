import React, { useEffect, useState } from "react";
import "../../styles/styles.css";
import { BookText, TrendingUp, CheckCircle, Users } from "lucide-react";
import "../../styles/styles.css";
import axios from "axios";
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

export default PartnerMangement;
