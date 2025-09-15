import React, { useEffect, useState } from "react";
import "../../styles/styles.css";
import {
  Users,
  UserPlus,
  Clock,
  Shield,
  TimerIcon,
  Clock1,
  Clock10,
  AlertTriangle,
  UserCheck,
  FileText,
} from "lucide-react";
import KYCReviewQueue from "./KYCReviewQueue";

// import "./All.css";

const ComplianceKYC = () => {
  const [data, setData] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    fetch(`${API_BASE_URL}/fes/api/Export/customer_Kyc_dashboard_export`)
      .then((res) => res.json())
      .then((json) => {
        if (json.length > 0) {
          setData(json[0]); // Take the first item (serialNo: 1)
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
  if (!data) return <p>Loading...</p>;

  //   const { total_customers, active_customers, active_percentage } =
  //     data.customerSummary;
  // console.log(data)

  return (
    <div className="dashboard-container-dx91u">
      {/* Row 1 */}

      <div className="dashboard-row1-dx91u">
        {/* Total Customers */}
        <div className="stat-card-dx91u total-customers-dx91u corner-box">
          <div className="card-top-dx91u">
            <div className="card-header-dx91u">
              <h3>KYC Pending</h3>
              <Clock10 className="w-4 h-4 text-[#ffeb00]" />
            </div>
          </div>
          <div className="card-bottom-dx91u">
            <p className="stat-value-dx91u highlight-yellow-dx91u">
              {data?.kycPendingCount?.toLocaleString("en-IN")}
            </p>{" "}
            <p className="stat-sub-dx91u mb-[10px]">
              <span className="text-[#ff6467] ">+5.2%</span>from yesterday
            </p>
            <div className="active-row-dx91u">
              <p className="stat-sub-dx91u">{data?.status}</p>
              <p className="stat-percentage-dx91u">
                {data?.kycCompletionRate}%
              </p>
            </div>
            <div className="progress-bar-dx91u">
              <div
                className="progress-fill-dx91u"
                style={{ width: `${data?.kycCompletionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* KYC Verified*/}
        <div className="stat-card-dx91u customer-today-dx91u corner-box">
          <div className="card-header-dx91u">
            <h3>KYC Verified</h3>
            <UserCheck className="w-4 h-4 text-[#05df72]" />
          </div>
          <p className="stat-value-dx91u highlight-green-dx91u">
            {data?.kycVerifiedCount?.toLocaleString("en-IN")}
            <p className="stat-sub-dx91u">
              <span className="text-[#05df72] ">+12.8% </span>this month
            </p>
          </p>
          <div>
            <p className="stat-sub-dx91u">Verification Rate</p>
            <p className="text-[#05df72] text-[15px]">
              {data?.kycCompletionRate}
            </p>
          </div>
        </div>

        {/* AML Alerts */}
        <div className="stat-card-dx91u kyc-pending-dx91u corner-box">
          <div className="card-header-dx91u">
            <h3>AML Alerts</h3>
            <AlertTriangle className="w-4 h-4  text-[#ff6467]" />
          </div>
          <p className="stat-value-dx91u  highlight-red-dx91u">
            {/* {data.kycPendingCount.toLocaleString()} */}
            45
            <p className="stat-sub-dx91u">
              <span className="text-[#05df72] ">-8.2% </span> from last week
            </p>
          </p>
          <div>
            <p className="stat-sub-dx91u">High Priority</p>
            <p className="text-[#ff6467]  text-[15px]">12 cases</p>
          </div>
        </div>

        {/* Compliance Score */}
        <div className="stat-card-dx91u high-risk-dx91u corner-box">
          <div className="card-header-dx91u">
            <h3>Compliance Score</h3>
            <Shield className="w-4 h-4   text-[#00d4aa]" />
          </div>
          <p className="stat-value-dx91u ">
            {data?.kycCompletionRate}
            <p className="stat-sub-dx91u">
              <span className="text-[#05df72] ">+0.8% </span>improvement
            </p>
          </p>

          <div>
            <div className="active-row-dx91u">
              <p className="stat-percentage-dx91u">Target:67%</p>
            </div>

            <div className="progress-bar-dx91u">
              <div
                className="progress-fill-dx91u"
                style={{ width: `${67}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      {/* Row 2 */}
      <div className="dashboard-row2-dx91u">
        <div
          className="stat-card-dx91u high-risk-dx91u corner-box "
          style={{ paddingBottom: "45px" }}
        >
          <h2 className="text-[#00d4aa] text-[15px] flex  items-center gap-2">
            {" "}
            <AlertTriangle className="w-4 h-4" />
            Priority Alerts
          </h2>

          <div className="bg-[#3b1c1c] text-[#f87171] px-4 py-2 text-[15px] rounded-[18px] flex items-center gap-3">
            <AlertTriangle className="w-3 h-3 text-[#ffffff]" />
            <span>
              12 customers flagged for potential money laundering activities
            </span>
          </div>

          <div className="bg-[#3b341c] text-[#facc15]  px-4 py-2 text-[15px] rounded-[18px] flex items-center gap-3">
            <Clock className="w-3 h-3 text-[#ffffff]" />
            <span>847 KYC documents pending review for more than 3 days</span>
          </div>

          <div className="bg-[#1c2e3b] text-[#60a5fa] px-4 py-2 text-[15px] rounded-[18px] flex items-center gap-3">
            <FileText className="w-3 h-3 text-[#ffffff]" />
            <span>Quarterly compliance report due in 5 days</span>
          </div>
        </div>
        <div>
          <div
            className="stat-card-dx91u high-risk-dx91u corner-box "
            style={{ paddingBottom: "30px" }}
          >
            <h2 className="text-[#00d4aa] text-[15px] flex  items-center gap-2">
              Compliance Metrics
            </h2>
            {metrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span className="text-[12px]">{metric.label}</span>
                  <span className="text-[#05df72] text-[12px]">
                    {metric.percent}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-[#00d4aa] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${metric.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Row 3 */}
      <div className="dashboard-row3-dx91u">
        <KYCReviewQueue />
      </div>
    </div>
  );
};

export default ComplianceKYC;
