import { useEffect, useState } from "react";
import { Users, UserPlus, Clock, Shield } from "lucide-react";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import RecentCustomer from "./RecentCustomer";
import { getDashboardData } from "../../services/service";

const CustomerManagement = () => {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const res = await getDashboardData("Export/customer_dashboard_export");
    setData(res?.data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (!data) return <p className="text-gray-400">Loading...</p>;

  const { total_customers, active_customers, active_percentage } =
    data?.[0]?.customerSummary;

  const stats = [
    {
      title: "Total Customers",
      value: total_customers.toLocaleString(),
      subText: `Active: ${active_customers.toLocaleString()}`,
      percentage: `${active_percentage}%`,
      progress: active_percentage,
      color: "text-[#00d4aa]",
      progressColor: "bg-[#00d48e]",
      icon: <Users className="w-4 h-4 text-blue-500" />,
    },
    {
      title: "Customer Added Today",
      value: data?.[0].customersAddedToday,
      color: "text-[#00d4aa]",
      icon: <UserPlus className="w-4 h-4 text-blue-500" />,
    },
    {
      title: "KYC Pending",
      value: data?.[0].kycPendingCount.toLocaleString(),
      color: "text-yellow-500",
      icon: <Clock className="w-4 h-4 text-yellow-500" />,
    },
    {
      title: "High Risk",
      value: data?.[0].highRiskCount.toLocaleString(),
      color: "text-red-500",
      icon: <Shield className="w-4 h-4 text-red-500" />,
    },
  ];

  return (
    <>
      {/* Row 1 - Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card-dx91u high-risk-dx91u corner-box">
            <div className="flex justify-between items-center">
              <h3 className="submenu-card-label">{stat.title}</h3>
              {stat.icon}
            </div>

            <span></span>
            <p className={`submenu-card-value ${stat.color}`}>{stat.value}</p>

            {/* Extra info only for "Total Customers" */}
            {stat.subText && (
              <>
                <div className="flex justify-between text-xs text-gray-300">
                  <p>{stat.subText}</p>
                  <p>{stat.percentage}</p>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded">
                  <div
                    className={`h-1.5 ${stat.progressColor} rounded`}
                    style={{ width: `${stat.progress}%` }}
                  ></div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Row 2 - Charts */}
      {/* Row 2 - Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Pie Chart */}
        <div className="md:h-[400px] w-full flex items-center justify-center">
          <div className="w-full h-full">
            <PieChart data={data} />
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
        <RecentCustomer data={data} />{" "}
      </div>
    </>
  );
};

export default CustomerManagement;
