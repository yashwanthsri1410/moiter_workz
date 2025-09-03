import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ArrowUp, TrendingUp, TrendingDown, ArrowDown } from "lucide-react";
import { useOperationStore } from "../store/useOperationStore";
import { loadedColors, unLoadedColors } from "../constants";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ isLoaded }) => {
  const { loadedData, unLoadedData } = useOperationStore();

  // Pick dataset based on prop
  const chartData = Array.isArray(isLoaded ? loadedData : unLoadedData)
  ? (isLoaded ? loadedData : unLoadedData)
  : [];

  // Extract labels & percentages
  const labels = chartData.map((item) => item.channel);
  const percentages = chartData.map((item) =>
    item.amountPercent ? Math.round(item.amountPercent) : 0
  );

  // Common totals (from first record since overall totals repeat for all entries)
  const totalAmount = chartData[0]?.overallTotalAmount || 0;
  const totalUsers = chartData[0]?.overallTotalUsers || 0;
  const totalTxns = chartData[0]?.overallTotalTxns || 0;

  // Stats for footer
  const stats = [
    { label: "People", value: totalUsers.toLocaleString() },
    { label: "Times", value: totalTxns.toLocaleString() },
  ];

  const colors = isLoaded ? loadedColors : unLoadedColors;

  const data = {
    labels,
    datasets: [
      {
        data: percentages,
        backgroundColor: labels.map(
          (_, i) => colors[i % colors.length] // cycle through colors
        ),
        borderWidth: 0,
        spacing: 4,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#fff",
        bodyColor: "#fff",
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw}%`,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="glass-card">
      {/* Header */}
      <div className="card-header">
        <span className="status">
          {isLoaded ? (
            <TrendingUp size="18" className="icon-primary" />
          ) : (
            <TrendingDown size="18" className="icon-danger" />
          )}
          {isLoaded ? "Loaded" : "UnLoaded"}
        </span>
      </div>

      {/* Amount */}
      <div className="amount-section">
        <h2 className={`amount ${isLoaded ? "text-primary" : "text-danger"}`}>
          ₹{(totalAmount / 1_000_000).toFixed(2)}M
        </h2>
        <p className="muted">Total Amount</p>
      </div>

      {/* Chart */}
      <div className="chart-container">
        <Doughnut data={data} options={options} />
      </div>

      {/* Legend */}
      <ul className="legend">
        {labels.map((label, i) => (
          <li key={label} className="legend-item">
            <div className="legend-label">
              <span
                className="legend-color"
                style={{ backgroundColor: colors[i % colors.length] }}
              />
              <span className="muted truncate">{label}</span>
            </div>
            <span
              className={`percentage ${
                isLoaded ? "text-primary" : "text-danger"
              }`}
            >
              {percentages[i]}%
            </span>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="footer">
        {stats.map((item, i) => (
          <div key={i} className="footer-item">
            <h1
              className={`stat-value ${
                isLoaded ? "text-primary" : "text-danger"
              }`}
            >
              {item.value}
            </h1>
            <span className="muted">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;
