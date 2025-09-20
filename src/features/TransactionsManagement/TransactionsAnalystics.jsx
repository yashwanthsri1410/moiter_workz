import React, { useState } from "react";
import { TrendingUp, Wallet, XCircle } from "lucide-react";
import BarChart_Trans from "./BarChart_Trans";
import PieChart_Trans from "./PieChart_Trans";
import TransactionStream_Trans from "./TransactionStream_Trans";

const TranscationsAnalystics = () => {
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

  const { total_customers } = data.customerSummary;

  return (
    <div className="p-4 flex flex-col gap-6">
      {/* Row 1 - Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

          <div className="mt-1 text-gray-400 text-xs">
            <div>Avg Transaction</div>
            <div className="text-white text-sm">₹808</div>
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

      {/* Row 2 - Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="piechart-box-dx91u">
          <BarChart_Trans />
        </div>
        <div className="piechart-box-dx91u">
          <PieChart_Trans />
        </div>
      </div>

      {/* Row 3 - Transaction Stream */}
      <div className="w-full">
        <TransactionStream_Trans />
      </div>
    </div>
  );
};

export default TranscationsAnalystics;
