import React, { useEffect, useState } from "react";
import "../../styles/styles.css";
import {
  Clock,
  Shield,
  Clock10,
  AlertTriangle,
  UserCheck,
  FileText,
} from "lucide-react";
import KYCReviewQueue from "./KYCReviewQueue";

const ComplianceKYC = () => {
  const [data, setData] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetch(`${API_BASE_URL}/fes/api/Export/customer_Kyc_dashboard_export`)
      .then((res) => res.json())
      .then((json) => {
        if (json.length > 0) {
          setData(json[0]); // Take the first item
        }
      })
      .catch((err) => console.error("Failed to fetch dashboard data:", err));
  }, []);

  const metrics = [
    { label: "KYC Completion Rate", percent: 94.2 },
    { label: "AML Screening Coverage", percent: 99.8 },
    { label: "PEP Screening", percent: 100 },
    { label: "Sanctions Screening", percent: 100 },
  ];

  const complianceCards = [
    {
      title: "KYC Pending",
      value: data?.kycPendingCount?.toLocaleString("en-IN"),
      icon: <Clock10 className="w-4 h-4 text-[#ffeb00]" />,
      valueClass: "text-[#eab308]",
      subText: (
        <p className="stat-sub-dx91u mb-[10px]">
          <span className="text-[#ff6467]">+5.2%</span> from yesterday
        </p>
      ),
      footer: (
        <div className="active-row-dx91u flex justify-between">
          <p className="stat-sub-dx91u">{data?.status}</p>
          <p className="stat-percentage-dx91u">{data?.kycCompletionRate}%</p>
        </div>
      ),
      progress: data?.kycCompletionRate,
      className: "total-customers-dx91u",
    },
    {
      title: "KYC Verified",
      value: data?.kycVerifiedCount?.toLocaleString("en-IN"),
      icon: <UserCheck className="w-4 h-4 text-[#30d80e]" />,
      valueClass: "text-[#30d80e]",
      subText: (
        <p className="stat-sub-dx91u">
          <span className="primary-color">+12.8%</span> this month
        </p>
      ),
      footer: (
        <div>
          <p className="stat-sub-dx91u">Verification Rate</p>
          <p className="primary-color text-[15px]">{data?.kycCompletionRate}</p>
        </div>
      ),
      className: "customer-today-dx91u",
    },
    {
      title: "AML Alerts",
      value: "45",
      icon: <AlertTriangle className="w-4 h-4 text-[#ff6467]" />,
      valueClass: "text-[#ef4444]",
      subText: (
        <p className="stat-sub-dx91u">
          <span className="primary-color">-8.2%</span> from last week
        </p>
      ),
      footer: (
        <div>
          <p className="stat-sub-dx91u">High Priority</p>
          <p className="text-[#ff6467] text-[15px]">12 cases</p>
        </div>
      ),
      className: "kyc-pending-dx91u",
    },
    {
      title: "Compliance Score",
      value: data?.kycCompletionRate,
      icon: <Shield className="w-4 h-4 primary-color" />,
      valueClass: "primary-color",
      subText: (
        <p className="stat-sub-dx91u">
          <span className="primary-color">+0.8%</span> improvement
        </p>
      ),
      footer: (
        <div className="active-row-dx91u">
          <p className="stat-percentage-dx91u">Target: 67%</p>
        </div>
      ),
      progress: 67,
      className: "high-risk-dx91u",
    },
  ];

  const alerts = [
    {
      bgColor: "#3b1c1c",
      textColor: "#f87171",
      icon: <AlertTriangle className="w-3 h-3 text-white" />,
      text: "12 customers flagged for potential money laundering activities",
    },
    {
      bgColor: "#3b341c",
      textColor: "#facc15",
      icon: <Clock className="w-3 h-3 text-white" />,
      text: "847 KYC documents pending review for more than 3 days",
    },
    {
      bgColor: "#1c2e3b",
      textColor: "#60a5fa",
      icon: <FileText className="w-3 h-3 text-white" />,
      text: "Quarterly compliance report due in 5 days",
    },
  ];

  if (!data) return <p>Loading...</p>;

  return (
    <>
      {/* Row 1 - Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {complianceCards.map((card, idx) => (
          <div
            key={idx}
            className={`stat-card-dx91u ${card.className} corner-box`}
          >
            <div className="card-header-dx91u flex justify-between items-center">
              <h3 className="submenu-card-label">{card.title}</h3>
              {card.icon}
            </div>

            <p className={`submenu-card-value ${card.valueClass}`}>
              {card.value}
            </p>

            {card.subText}
            {card.footer}

            {card.progress !== undefined && (
              <div className="progress-bar-dx91u">
                <div
                  className="progress-fill-dx91u"
                  style={{ width: `${card.progress}%` }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Row 2 - Alerts + Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Priority Alerts */}
        <div className="stat-card-dx91u high-risk-dx91u corner-box p-4 space-y-3">
          <h2 className="card-root-label flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Priority Alerts
          </h2>

          {alerts.map((alert, index) => (
            <div
              key={index}
              className="px-4 py-2 rounded-[18px] flex items-center gap-3 text-xs sm:text-sm"
              style={{ backgroundColor: alert.bgColor, color: alert.textColor }}
            >
              {alert.icon}
              <span>{alert.text}</span>
            </div>
          ))}
        </div>

        {/* Compliance Metrics */}
        <div className="stat-card-dx91u high-risk-dx91u corner-box p-4">
          <h2 className="card-root-label flex items-center gap-2">
            Compliance Metrics
          </h2>
          <div className="space-y-4 mt-2">
            {metrics.map((metric, index) => (
              <div key={index}>
                <div className="flex justify-between text-[10px] sm:text-xs md:text-sm text-gray-300">
                  <span>{metric.label}</span>
                  <span className="text-[#05df72]">{metric.percent}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-[#00d4aa] h-2 rounded-full"
                    style={{ width: `${metric.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3 - KYC Review Queue */}
      <div>
        <KYCReviewQueue />
      </div>
    </>
  );
};

export default ComplianceKYC;
