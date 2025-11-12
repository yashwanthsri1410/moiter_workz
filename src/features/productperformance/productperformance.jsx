import React, { useEffect, useState } from "react";
import "../../styles/styles.css";
import { Box, CreditCard, TrendingUp, DollarSign } from "lucide-react";
import { primaryColor } from "../../constants";
import { getDashboardData } from "../../services/service";
// import KYCReviewQueue from "./KYCReviewQueue";

// import "./All.css";

const Productperformance = () => {
  const [data, setData] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchData = async () => {
    const res = await getDashboardData("Export/user-wallet-cards");
    setData(res?.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) return <p>Loading...</p>;

  //   const { total_customers, active_customers, active_percentage } =
  //     data.customerSummary;
  // console.log(data)

  const walletConfig = [
    { index: 3, icon: Box, color: primaryColor },
    { index: 1, icon: CreditCard, color: primaryColor },
    { index: 4, icon: TrendingUp, color: "#05df72" },
    { index: 2, icon: DollarSign, color: "#ffeb00" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {walletConfig.map(({ index, icon: Icon, color }, i) => (
        <div
          key={i}
          className="stat-card-dx91u corner-box p-4 shadow-md rounded-lg"
        >
          <div className="card-header-dx91u flex items-center justify-between mb-2">
            <h3 className="submenu-card-label">
              {data[index]?.walletCategory}
            </h3>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <div className="[line-height:23px]">
            <p className="submenu-card-value " style={{ color }}>
              {data[index]?.activeWallets?.toLocaleString("en-IN")}
            </p>
            <span className="text-[#94a3b8] text-[11px]">Active wallets</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Productperformance;
