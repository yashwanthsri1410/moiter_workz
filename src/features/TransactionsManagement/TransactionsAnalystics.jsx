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

  const statCards = [
    {
      title: "Total Transactions",
      value: (total_customers || 0).toLocaleString(),
      icon: <TrendingUp className="card-icon-dx91u" />,
      className: "total-customers-dx91u",
      valueClass: "primary-color",
    },
    {
      title: "Transaction Value",
      value: data.customersAddedToday,
      icon: <Wallet className="card-icon-dx91u" />,
      className: "customer-today-dx91u",
      extra: (
        <div className="mt-1 text-gray-400 text-xs">
          <div>Avg Transaction</div>
          <div className="text-white text-sm">₹808</div>
        </div>
      ),
      valueClass: "primary-color",
    },
    {
      title: "Failed Transactions",
      value: (data.kycPendingCount || 0).toLocaleString(),
      icon: <XCircle className="card-icon-dx91u warning-dx91u" />,
      className: "kyc-pending-dx91u",
      valueClass: "text-[#eab308]",
    },
    {
      title: "Fee Revenue",
      value: (data.highRiskCount || 0).toLocaleString(),
      icon: <TrendingUp className="card-icon-dx91u danger-dx91u" />,
      className: "high-risk-dx91u",
      valueClass: "text-[#ef4444]",
    },
  ];

  return (
    <>
      {/* Row 1 - Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`stat-card-dx91u ${card.className} corner-box`}
          >
            <div className="card-header-dx91u">
              <h3 className="submenu-card-label">{card.title}</h3>
              {card.icon}
            </div>
            <span></span>
            <p className={`submenu-card-value ${card.valueClass || ""}`}>
              {card.value}
            </p>
            {card.extra && card.extra}
          </div>
        ))}
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
    </>
  );
};

export default TranscationsAnalystics;
