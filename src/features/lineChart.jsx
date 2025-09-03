import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ChartColumn } from "lucide-react";
import { useOperationStore } from "../store/useOperationStore";
import { weekOrder } from "../constants";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const LineChart = () => {
  const { transactionData } = useOperationStore();

  // ✅ filter out empty rows
  const filteredData = transactionData.filter((item) => {
    return !(
      item.totalLoadAmountMillion === 0 &&
      item.totalLoadTransactions === 0 &&
      item.totalLoadUsers === 0 &&
      item.totalUnloadAmountMillion === 0 &&
      item.totalUnloadTransactions === 0 &&
      item.totalUnloadUsers === 0
    );
  });

  // ✅ sort by weekday order
  const sortedData = filteredData.sort(
    (a, b) => weekOrder.indexOf(a.dayOfWeek) - weekOrder.indexOf(b.dayOfWeek)
  );

  // ✅ build chart datasets dynamically
  const data = {
    labels: sortedData.map((d) => d.dayOfWeek), // ["Mon", "Tue", ...]
    datasets: [
      {
        label: "Loading Amount (Million)",
        data: sortedData.map((d) => d.totalLoadAmountMillion),
        borderColor: "#00D4AA",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        tension: 0.4,
        fill: false,
        pointBackgroundColor: "#00D4AA",
      },
      {
        label: "Unloading Amount (Million)",
        data: sortedData.map((d) => d.totalUnloadAmountMillion),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        tension: 0.4,
        fill: false,
        pointBackgroundColor: "#ef4444",
      },
    ],
  };

  // ✅ dynamically set min/max from data
  const allValues = [
    ...sortedData.map((d) => d.totalLoadAmountMillion),
    ...sortedData.map((d) => d.totalUnloadAmountMillion),
  ];
  const minY = Math.floor(Math.min(...allValues) * 10) / 10; // round down to 1 decimal
  const maxY = Math.ceil(Math.max(...allValues) * 10) / 10; // round up

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "#1f2937",
        titleColor: "#fff",
        bodyColor: "#fff",
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.formattedValue}M`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(75, 85, 99, 0.2)" },
        ticks: { color: "#9ca3af" },
      },
      y: {
        beginAtZero: false,
        grid: { color: "rgba(75, 85, 99, 0.2)" },
        ticks: {
          color: "#9ca3af",
          callback: function (value) {
            return value + "M"; // show "4M", "5M"
          },
        },
        min: minY, // auto-adjust
        max: maxY,
      },
    },
  };

  const legends = [
    { label: "Loading", color: "#00D4AA" },
    { label: "Unloading", color: "#ef4444" },
  ];

  return (
    <div className="glass-card weekly-trends-card">
      <div className="flex justify-between items-center card-header">
        <h2 className="card-title">
          <ChartColumn size={16} />
          <span className="muted">Weekly Transaction Trends</span>
        </h2>
        <div className="flex items-center gap-4 legends">
          {legends.map((item, index) => (
            <div key={index} className="flex items-center gap-1 legend-item">
              <span
                style={{ background: item.color }}
                className="legend-dot"
              ></span>
              <span className="legend-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <Line data={data} options={options} height={70} />
    </div>
  );
};

export default LineChart;
