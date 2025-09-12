import React from "react";
import "./Dashboard.css";
import Cards from "./Cards";
import LineChart from "./LineChart";
import PieChart1 from "./PieChart1";
import BarChart from "./BarChart2";

const Walletranscation = () => {
  return (
    <div className="dashboard-container-dx91u">
      {/* Row 1 */}
      <div className="dashboard-row1-dx91uz">
        <Cards />
      </div>

      {/* Row 2 */}
      <div className="dashboard-row2-dx91u">
        <LineChart />
        <PieChart1 />
      </div>

      {/* Row 3 */}
      <div className="dashboard-row3-dx91u">
        <BarChart />
      </div>
    </div>
  );
};

export default Walletranscation;
