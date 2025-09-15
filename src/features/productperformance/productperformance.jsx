import React, { useEffect, useState } from "react";
import "../../styles/styles.css";
import { Box, CreditCard, TrendingUp, DollarSign } from "lucide-react";
// import KYCReviewQueue from "./KYCReviewQueue";

// import "./All.css";

const Productperformance = () => {
  const [data, setData] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    fetch(`${API_BASE_URL}/fes/api/Export/user-wallet-cards`)
      .then((res) => res.json())
      .then((json) => {
        if (json.length > 0) {
          setData(json); // Take the first item (serialNo: 1)
        }
      })
      .catch((err) => console.error("Failed to fetch dashboard data:", err));
  }, []);

  if (!data) return <p>Loading...</p>;

  //   const { total_customers, active_customers, active_percentage } =
  //     data.customerSummary;
  // console.log(data)

  const walletConfig = [
    { index: 3, icon: Box, color: "#00d4aa" },
    { index: 1, icon: CreditCard, color: "#00d4aa" },
    { index: 4, icon: TrendingUp, color: "#05df72" },
    { index: 2, icon: DollarSign, color: "#ffeb00" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-5 mt-5">
      {walletConfig.map(({ index, icon: Icon, color }, i) => (
        <div
          key={i}
          className="stat-card-dx91u corner-box p-4 shadow-md rounded-lg"
        >
          <div className="card-header-dx91u flex items-center justify-between mb-2">
            <h3>{data[index]?.walletCategory}</h3>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <div className="[line-height:23px]">
            <p className="text-[25px]" style={{ color }}>
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
