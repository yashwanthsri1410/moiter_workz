import React from "react";
import Cards from "./Cards";
import LineChart from "./LineChart";
import PieChart1 from "./PieChart1";
import BarChart from "./BarChart2";

const Walletranscation = () => {
  return (
    <div className="dashboard-container-dx91u">
      {" "}
      {/* Row 1 */}
      <div className="dashboard-row1-dx91uz">
        <Cards />
      </div>
      {/* Row 2: Line + Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className=" rounded-xl shadow-md">
          <LineChart />
        </div>
        <div className=" rounded-xl shadow-md">
          <PieChart1 />
        </div>
      </div>
      {/* Row 3: Bar Chart */}
      <div className="rounded-xl shadow-md">
        <BarChart />
      </div>
    </div>
  );
};

export default Walletranscation;
