import React, { useState } from "react";
import "../../styles/styles.css";
import { TrendingUp, Wallet, XCircle } from "lucide-react";
import BarChart_Trans from "./BarChart_Trans";
import PieChart_Trans from "./PieChart_Trans";
import TransactionStream_Trans from "./TransactionStream_Trans";

const TranscationsAnalystics = () => {
  // ✅ Hardcoded data instead of API
  const [data] = useState({
    customerSummary: {
      total_customers: 124890,
      active_customers: 118450,
      active_percentage: 95,
    },
    customersAddedToday: 1200,
    kycPendingCount: 35,
    highRiskCount: 45,
  });

  const { total_customers, active_customers, active_percentage } =
    data.customerSummary;

  return (
    <div className="dashboard-container-dx91u">
      {/* Row 1 */}
      <div className="dashboard-row1-dx91u">
        {/* Total Transactions */}
        <div className="stat-card-dx91u total-customers-dx91u corner-box">
          <div className="card-top-dx91u">
            <div className="card-header-dx91u">
              <h3>Total Transactions</h3>
              <TrendingUp className="card-icon-dx91u" />
            </div>
          </div>
          <span></span>
          <div className="card-bottom-dx91u">
            <p className="stat-value-dx91u">
              {total_customers.toLocaleString()}
            </p>
            {/* <div className="active-row-dx91u">
              <p className="stat-sub-dx91u">
                Active: {active_customers.toLocaleString()}
              </p>
              <p className="stat-percentage-dx91u">{active_percentage}%</p>
            </div>
            <div className="progress-bar-dx91u">
              <div
                className="progress-fill-dx91u"
                style={{ width: `${active_percentage}%` }}
              ></div>
            </div> */}
          </div>
        </div>

        {/* Transaction Value */}
        <div className="stat-card-dx91u customer-today-dx91u corner-box">
          <div className="card-header-dx91u">
            <h3>Transaction Value</h3>
            <Wallet className="card-icon-dx91u" />
          </div>
          <span></span>
          <p className="stat-value-dx91u">{data.customersAddedToday}</p>

          <div style={{ marginTop: "-20px" }}>
            <div class="" style={{ fontSize: "10px", color: "#94a3b8" }}>
              Avg Transaction
            </div>
            <div class="" style={{ fontSize: "14px", color: "#e2e8f0" }}>
              ₹808
            </div>
          </div>
        </div>

        {/* Failed Transactions */}
        <div className="stat-card-dx91u kyc-pending-dx91u corner-box">
          <div className="card-header-dx91u">
            <h3>Failed Transactions</h3>
            <XCircle className="card-icon-dx91u warning-dx91u" />
          </div>
          <span></span>
          <p className="stat-value-dx91u highlight-yellow-dx91u">
            {data.kycPendingCount.toLocaleString()}
          </p>
        </div>

        {/* Fee Revenue */}
        <div className="stat-card-dx91u high-risk-dx91u corner-box">
          <div className="card-header-dx91u">
            <h3>Fee Revenue</h3>
            <TrendingUp className="card-icon-dx91u danger-dx91u" />
          </div>
          <span></span>
          <p className="stat-value-dx91u highlight-red-dx91u">
            {data.highRiskCount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Row 2 */}
      <div className="dashboard-row2-dx91u">
        <div className="piechart-box-dx91u">
          <BarChart_Trans />
        </div>
        <div className="piechart-box-dx91u">
          <PieChart_Trans />
        </div>
      </div>

      {/* Row 3 */}
      <div className="dashboard-row3-dx91u">
        <TransactionStream_Trans />
      </div>
    </div>
  );
};

export default TranscationsAnalystics;
