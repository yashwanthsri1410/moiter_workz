import React, { useEffect, useState } from "react";
import "../../styles/styles.css";
import { Users, UserPlus, Clock, Shield } from "lucide-react";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import RecentCustomer from "./RecentCustomer";

// import "./All.css";

const CustomerManagement = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://192.168.22.247/fes/api/Export/customer_dashboard_export")
      .then((res) => res.json())
      .then((json) => {
        if (json.length > 0) {
          setData(json[0]); // Take the first item (serialNo: 1)
        }
      })
      .catch((err) => console.error("Failed to fetch dashboard data:", err));
  }, []);

  if (!data) return <p>Loading...</p>;

  const { total_customers, active_customers, active_percentage } =
    data.customerSummary;

  return (
    <div className="dashboard-container-dx91u">
      {/* Row 1 */}

      <div className="dashboard-row1-dx91u">
        {/* Total Customers */}
        <div className="stat-card-dx91u total-customers-dx91u corner-box">
          <span></span>
          <div className="card-top-dx91u">
            <div className="card-header-dx91u">
              <h3>Total Customers</h3>
              <Users className="card-icon-dx91u" />
            </div>
          </div>

          <div className="card-bottom-dx91u">
            <p className="stat-value-dx91u">
              {total_customers.toLocaleString()}
            </p>

            <div className="active-row-dx91u">
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
            </div>
          </div>
        </div>

        {/* Customer Added Today */}
        <div className="stat-card-dx91u customer-today-dx91u corner-box">
          <span></span>
          <div className="card-header-dx91u">
            <h3>Customer Added Today</h3>
            <UserPlus className="card-icon-dx91u" />
          </div>
          <p className="stat-value-dx91u">{data.customersAddedToday}</p>
        </div>

        {/* KYC Pending */}
        <div className="stat-card-dx91u kyc-pending-dx91u corner-box">
          <span></span>
          <div className="card-header-dx91u">
            <h3>KYC Pending</h3>
            <Clock className="card-icon-dx91u warning-dx91u" />
          </div>
          <p className="stat-value-dx91u highlight-yellow-dx91u">
            {data.kycPendingCount.toLocaleString()}
          </p>
        </div>

        {/* High Risk */}
        <div className="stat-card-dx91u high-risk-dx91u corner-box">
          <span></span>
          <div className="card-header-dx91u">
            <h3>High Risk</h3>
            <Shield className="card-icon-dx91u danger-dx91u" />
          </div>
          <p className="stat-value-dx91u highlight-red-dx91u">
            {data.highRiskCount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Row 2 */}
      <div className="dashboard-row2-dx91u">
        <div>
          <PieChart />
        </div>
        <div>
          <BarChart />
        </div>
      </div>

      {/* Row 3 */}
      <div className="dashboard-row3-dx91u">
        <RecentCustomer />
      </div>
    </div>
  );
};

export default CustomerManagement;
