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

export default function WalletSummary() {
  const { walletPerfomanceData } = useOperationStore();

  const label = walletPerfomanceData?.map((e) => e.status);
  const currentCount = walletPerfomanceData?.map((e) => e.currentCount);

  const totalWallets = walletPerfomanceData?.[0]?.totalCurrent ?? 0;
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
    maintainAspectRatio: false,
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
          display: true,
          drawBorder: false, // 👈 don’t double-draw
          drawOnChartArea: true,
          drawTicks: true,
          color: "#1f2937",
        },
        border: {
          display: true,
          color: "#1f2937", // 👈 this draws the vertical line at end of X axis
          width: 1,
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

  // const footerStats = walletPerfomanceData?.map((item, idx) => ({
  //   status: item.status,
  //   percentage: Math.round(item.percentage),
  //   color: barChartColor[idx],
  // }));
  return (
    <div>
      <h2 className="flex items-center gap-2 text-primary mb-6">
        <span>
          <Wallet size="18" />
        </span>
        <span>Wallet Performance Summary</span>
      </h2>
      <div className="glass-card">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {/* <Wallet size={16} className="icon-blue" /> */}
            <p className="text-primary text-sm ">Wallet Status Distribution</p>
          </div>
          {/* <div className="flex items-center muted text-xs">
            <ChartColumn size={16} className="icon-blue mr-1" />
            Live
          </div> */}
        </div>

        {/* Center Total */}
        {/* <div className="text-center mb-4">
          <h2 className="wallet-total">
            {totalWallets?.toLocaleString("en-IN")}
          </h2>
          <p className="muted text-xs">Total Wallets</p>
        </div> */}

        {/* Bar Chart */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2">
          <div className="h-64">
            <Bar data={data} options={options} />
          </div>
          <div></div>
        </div>

        {/* Footer Stats */}
        {/* <div className="flex justify-around flex-wrap text-xs">
          {footerStats?.map((item, index) => (
            <div key={index} className="text-center m-2">
              <p style={{ color: item.color }}>{`${item.percentage}%`}</p>
              <p className="muted">{item.status}</p>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
}
