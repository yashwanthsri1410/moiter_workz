import React, { useEffect, useState } from "react";
import { Users, UserPlus, Clock, Shield } from "lucide-react";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import RecentCustomer from "./RecentCustomer";

const CustomerManagement = () => {
  const [data, setData] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    fetch(`${API_BASE_URL}/fes/api/Export/customer_dashboard_export`)
      .then((res) => res.json())
      .then((json) => {
        if (json.length > 0) {
          setData(json[0]); // Take the first item (serialNo: 1)
        }
      })
      .catch((err) => console.error("Failed to fetch dashboard data:", err));
  }, []);

  if (!data) return <p className="text-gray-400">Loading...</p>;

  const { total_customers, active_customers, active_percentage } =
    data.customerSummary;

  return (
    <div className="p-5 space-y-5">
      {/* Row 1 - Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Customers */}
        <div className=" rounded-lg p-4 flex flex-col gap-4 shadow hover:-translate-y-1 transition corner-box">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-semibold text-gray-400">
              Total Customers
            </h3>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <span></span>
          <p className="text-2xl font-bold text-[#00d4aa]">
            {total_customers.toLocaleString()}
          </p>
          <div className="flex justify-between text-xs text-gray-300">
            <p>Active: {active_customers.toLocaleString()}</p>
            <p>{active_percentage}%</p>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded">
            <div
              className="h-1.5 bg-[#00d48e] rounded"
              style={{ width: `${active_percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Customer Added Today */}
        <div className="bg-[#0d1017] rounded-lg p-4 flex flex-col gap-4 shadow hover:-translate-y-1 transition corner-box">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-semibold text-gray-400">
              Customer Added Today
            </h3>
            <UserPlus className="w-4 h-4 text-blue-500" />
          </div>
          <span></span>
          <p className="text-2xl font-bold text-[#00d4aa]">
            {data.customersAddedToday}
          </p>
        </div>

        {/* KYC Pending */}
        <div className="bg-[#0d1017] rounded-lg p-4 flex flex-col gap-4 shadow hover:-translate-y-1 transition corner-box">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-semibold text-gray-400">KYC Pending</h3>
            <Clock className="w-4 h-4 text-yellow-500" />
          </div>
          <span></span>
          <p className="text-2xl font-bold text-yellow-500">
            {data.kycPendingCount.toLocaleString()}
          </p>
        </div>

        {/* High Risk */}
        <div className="bg-[#0d1017] rounded-lg p-4 flex flex-col gap-4 shadow hover:-translate-y-1 transition corner-box">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-semibold text-gray-400">High Risk</h3>
            <Shield className="w-4 h-4 text-red-500" />
          </div>
          <span></span>
          <p className="text-2xl font-bold text-red-500">
            {data.highRiskCount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Row 2 - Charts */}
      {/* Row 2 - Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Pie Chart */}
        <div className="md:h-[400px] w-full flex items-center justify-center">
          <div className="w-full h-full">
            <PieChart />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="h-[300px] md:h-[400px] w-full flex items-center justify-center">
          <div className="w-full h-full">
            <BarChart />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-200 rounded-lg">
        {" "}
        <RecentCustomer />{" "}
      </div>
    </div>
  );
};

export default CustomerManagement;
