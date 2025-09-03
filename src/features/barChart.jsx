import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Wallet, ChartColumn } from "lucide-react";
import { useOperationStore } from "../store/useOperationStore";
import { barChartColor } from "../constants";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BarChart() {
  const { walletData } = useOperationStore();

  const label = walletData.map((e) => e.status);
  const currentCount = walletData.map((e) => e.currentCount);

  const totalWallets = walletData[0]?.totalCurrent;
  const data = {
    labels: label,
    datasets: [
      {
        label: "Wallets",
        data: currentCount,
        backgroundColor: barChartColor,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
        backgroundColor: "#1f2937",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#9ca3af",
        },
        grid: {
          display: false,
          drawBorder: true,
          color: "#1f2937",
        },
        border: {
          display: true,
          color: "#9ca3af",
        },
      },
      y: {
        ticks: {
          color: "#9ca3af",
          callback: function (value) {
            if ([5000, 10000, 15000, 20000, 25000].includes(value)) {
              return value;
            }
            return null;
          },
        },
        grid: {
          color: "#1f2937",
          drawBorder: true,
        },
        border: {
          display: true,
          color: "#9ca3af",
        },
      },
    },
  };

  const footerStats = walletData.map((item, idx) => ({
    status: item.status,
    percentage: Math.round(item.percentage),
    color: barChartColor[idx],
  }));
  return (
    <div className="glass-card card-container">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Wallet size={16} className="icon-blue" />
          <p className="muted text-xs">Total Wallet</p>
        </div>
        <div className="flex items-center muted text-xs">
          <ChartColumn size={16} className="icon-blue mr-1" />
          Live
        </div>
      </div>

      {/* Center Total */}
      <div className="text-center mb-4">
        <h2 className="wallet-total">
          {totalWallets?.toLocaleString("en-IN")}
        </h2>
        <p className="muted text-xs">Total Wallets</p>
      </div>

      {/* Bar Chart */}
      <div className="mb-4">
        <Bar data={data} options={options} />
      </div>

      {/* Footer Stats */}
      <div className="flex justify-around flex-wrap text-xs">
        {footerStats.map((item, index) => (
          <div key={index} className="text-center m-2">
            <p style={{ color: item.color }}>{`${item.percentage}%`}</p>
            <p className="muted">{item.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
