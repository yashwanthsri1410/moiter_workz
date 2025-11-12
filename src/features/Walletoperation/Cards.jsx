import React, { useEffect, useState } from "react";
import { Wallet, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import "../Walletoperation/Cards.css";
import { getDashboardData } from "../../services/service";

// ✅ Helper to format numbers
const formatNumber = (num) => {
  if (num >= 1_000_000) return `₹${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `₹${(num / 1_000).toFixed(1)}K`;
  return `₹${num}`;
};

const Cards = () => {
  const [data, setData] = useState(null);

  const fetchDashboardData = async () => {
    const res = await getDashboardData("Export/wallet_dashboard_export");
    if (res?.data && res?.data?.length > 0) {
      setData(res?.data[0]);
    } else {
      setData(null);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (!data) return <div className="loading">Loading...</div>;

  // ✅ Define card configuration
  const cardsConfig = [
    {
      title: "Total Wallets",
      color: "var(--primary-color)",
      value: data.totalWallets.toLocaleString(),
      footer: (
        <>
          <div className="db-stat-footer">
            <span>
              Active:{" "}
              <span className="db-highlight">
                {data.activeWallets.toLocaleString()}
              </span>
            </span>
            <span>{data.activePct}%</span>
          </div>
          <div className="db-progress-bar">
            <div
              className="db-progress-fill"
              style={{ width: `${data.activePct}%` }}
            ></div>
          </div>
        </>
      ),
      icon: <Wallet size={12} className="primary-color" />,
    },
    {
      title: "Total Balance",
      color: "var(--primary-color)",
      value: `${formatNumber(data.totalBalance)}M`,
      footer: (
        <div className="db-stat-footer-column flex">
          <span className="db-footer-label-size">Avg Balance:</span>
          <span className="db-footer-value">
            ₹{data.avgBalance.toLocaleString()}
          </span>
        </div>
      ),
      icon: <DollarSign size={12} className="primary-color" />,
    },
    {
      title: "Today Loading",
      value: (
        <span style={{ color: "#22c55e" }}>{`${formatNumber(
          data.dailyLoad
        )}M`}</span>
      ),
      footer: (
        <div className="db-stat-footer-column">
          <div className="db-footer-pair">
            <span className="db-footer-label-size">Transactions:</span>
            <span className="db-footer-size">
              {data.dailyLoadTxns.toLocaleString()}
            </span>
          </div>
          <div className="db-footer-pair">
            <span className="db-footer-label">Avg:</span>
            <span className="db-footer-value">
              ₹{data.dailyAvgLoad.toLocaleString()}
            </span>
          </div>
        </div>
      ),
      icon: <TrendingUp size={12} className="text-green-500" />,
    },
    {
      title: "Today Unloading",
      value: (
        <span
          style={{ color: "oklch(0.704 0.191 22.216)" }}
          className="submenu-card-value"
        >
          {formatNumber(data.dailySpend)}M
        </span>
      ),
      footer: (
        <div className="db-stat-footer-column">
          <div className="db-footer-pair">
            <span className="db-footer-label-size">Transactions:</span>
            <span className="db-footer-size">
              {data.dailySpendTxns.toLocaleString()}
            </span>
          </div>
          <div className="db-footer-pair">
            <span className="db-footer-label">Avg:</span>
            <span className="db-footer-value">
              ₹{data.dailyAvgSpend.toLocaleString()}
            </span>
          </div>
        </div>
      ),
      icon: <TrendingDown size={12} color="oklch(0.704 0.191 22.216)" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-0">
      {cardsConfig.map((card, idx) => (
        <div key={idx} className="stat-card-dx91u high-risk-dx91u corner-box">
          <div className="db-stat-header">
            <span className="submenu-card-label">{card.title}</span>
            {card.icon}
          </div>
          <div className="db-stat-body">
            <div className="flex flex-col m-0">
              <div style={{ color: card.color }} className="submenu-card-value">
                {card.value}
              </div>
            </div>
            <div className="db-footer-container">{card.footer}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;
