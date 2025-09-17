import React, { useEffect, useState } from "react";
import "../Walletoperation/Cards.css";
import { Wallet, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import axios from "axios";
// Format helper for large numbers (₹4.5M, 5.9K etc.)
const formatNumber = (num) => {
  if (num >= 1_000_000) return `₹${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `₹${(num / 1_000).toFixed(1)}K`;
  return `₹${num}`;
};

const WalletCard = ({ data }) => {
  const { totalWallets, activeWallets, activePct } = data;

  return (
    <div className="db-stat-card corner-box">
      <div className="db-stat-header">
        <span className="db-stat-title">Total Wallets</span>
        <Wallet size={12} className="db-stat-icon" color="#00d4aa" />
      </div>

      <div className="db-stat-body">
        <div className="db-stat-value-box">
          <div className="db-stat-value">{totalWallets.toLocaleString()}</div>
          <div className="db-stat-change db-positive">
            {/* <span className="db-change-value db-positive">+8.2%</span>{" "} */}
            {/* <span className="db-change-desc">from last month</span> */}
          </div>
        </div>

        <div className="db-footer-container">
          <div className="db-stat-footer">
            <span>
              Active:{" "}
              <span className="db-highlight">
                {activeWallets.toLocaleString()}
              </span>
            </span>
            <span>{activePct}%</span>
          </div>
          <div className="db-progress-bar">
            <div
              className="db-progress-fill"
              style={{ width: `${activePct}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BalanceCard = ({ data }) => {
  const { totalBalance, avgBalance } = data;

  return (
    <div className="db-stat-card corner-box">
      <div className="db-stat-header">
        <span className="db-stat-title">Total Balance</span>
        <DollarSign size={12} className="db-stat-icon" color="#00d4aa" />
      </div>

      <div className="db-stat-body">
        <div className="db-stat-value-box">
          <div className="db-stat-value">{formatNumber(totalBalance)}M</div>
          <div className="db-stat-change db-positive">
            {/* <span className="db-change-value db-positive">+12.3%</span>{" "} */}
            {/* <span className="db-change-desc">from last week</span> */}
          </div>
        </div>

        <div className="db-footer-container">
          <div className="db-stat-footer-column">
            <span className="db-footer-label-size">Avg Balance:</span>
            <span className="db-footer-value">
              ₹{avgBalance.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadCard = ({ data }) => {
  const { dailyLoad, dailyLoadTxns, dailyAvgLoad } = data;

  return (
    <div className="db-stat-card corner-box">
      <div className="db-stat-header">
        <span className="db-stat-title">Today Loading</span>
        <TrendingUp
          size={12}
          className="db-stat-icon"
          color="oklch(.792 .209 151.711)"
        />
      </div>
      <div className="db-stat-body">
        <div className="db-stat-value-box">
          <div className="db-stat-value">{formatNumber(dailyLoad)}M</div>
          <div className="db-stat-change db-positive">
            {/* <span className="db-change-value db-positive">+15.7%</span>{" "} */}
            {/* <span className="db-change-desc">vs yesterday</span> */}
          </div>
        </div>

        <div className="db-footer-container">
          <div className="db-stat-footer-column">
            <div className="db-footer-pair">
              <span className="db-footer-label-size">Transactions:</span>
              <span className="db-footer-size">
                {dailyLoadTxns.toLocaleString()}
              </span>
            </div>
            <div className="db-footer-pair">
              <span className="db-footer-label">Avg:</span>
              <span className="db-footer-value">
                ₹{dailyAvgLoad.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SpendCard = ({ data }) => {
  const { dailySpend, dailySpendTxns, dailyAvgSpend } = data;

  return (
    <div className="db-stat-card corner-box">
      <div className="db-stat-header">
        <span className="db-stat-title">Today Unloading</span>
        <TrendingDown
          size={12}
          className="db-stat-icon"
          color="oklch(0.704 0.191 22.216)"
        />
      </div>

      <div className="db-stat-body">
        <div className="db-stat-value-box">
          <div className="db-stat-value-red">{formatNumber(dailySpend)}M</div>
          <div className="db-stat-change db-negative">
            {/* <span className="db-change-value db-yellow">+2.1%</span>{" "} */}
            {/* <span className="db-yellow">vs yesterday</span> */}
          </div>
        </div>

        <div className="db-footer-container">
          <div className="db-stat-footer-column">
            <div className="db-footer-pair">
              <span className="db-footer-label-size">Transactions:</span>
              <span className=" db-footer-size">
                {dailySpendTxns.toLocaleString()}
              </span>
            </div>
            <div className="db-footer-pair">
              <span className="db-footer-label">Avg:</span>
              <span className="db-footer-value">
                ₹{dailyAvgSpend.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main cards container with API integration
const Cards = () => {
  const [data, setData] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/fes/api/Export/wallet_dashboard_export`
      );
      if (res.data && res.data.length > 0) {
        setData(res.data[0]); // use first object from API array
      } else {
        setData(null);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setData(null);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // useEffect(() => {

  //   fetch("http://192.168.22.247/fes/api/Export/wallet_dashboard_export")
  //     .then((res) => res.json())
  //     .then((result) => {
  //       if (result && result.length > 0) {
  //         setData(result[0]);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching dashboard data:", err);
  //     });
  // }, []);

  if (!data) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="db-dashboard">
      <WalletCard data={data} />
      <BalanceCard data={data} />
      <LoadCard data={data} />
      <SpendCard data={data} />
    </div>
  );
};

export default Cards;
