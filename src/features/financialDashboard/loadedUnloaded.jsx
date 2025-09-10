import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useOperationStore } from "../../store/operationStore";
import { unLoadedColors, loadedColors } from "../../constants/index";

ChartJS.register(ArcElement, Tooltip, Legend);

const LoadedUnLoaded = ({ isLoaded }) => {
  const { loadedData, unLoadedData, error } = useOperationStore();

  // Pick dataset based on prop
  const chartData = Array.isArray(isLoaded ? loadedData : unLoadedData)
    ? isLoaded
      ? loadedData
      : unLoadedData
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
    { label: "Amount", value: ` ₹${(totalAmount / 1_000_000).toFixed(2)}M` },
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
        backgroundColor: "#fff",
        titleColor: "#1f2937",
        bodyColor: "#1f2937",
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw}%`,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div>
      {error[isLoaded ? "loaded" : "unloaded"] && (
        <h1 className="text-red-500 text-xs text-center">
          {error[isLoaded ? "loaded" : "unloaded"]}
        </h1>
      )}
      {!error[isLoaded ? "loaded" : "unloaded"] && (
        <div className="glass-card corner-box h-full flex flex-col">
          <span />
          {/* Header */}
          <div className="h-80">
            <p className="status">
              {isLoaded ? (
                <ArrowUp size="18" className="icon-primary" />
              ) : (
                <ArrowDown size="18" className="icon-danger" />
              )}
              <span className="card-text">
                {isLoaded ? "Current Day loading" : "Current Day Unloading"}
              </span>
            </p>
            <div className="px-0 xl:px-4">
              <div className="">
                <div className="chart-container">
                  <Doughnut data={data} options={options} />
                </div>

                {/* Legend */}
                <div className="flex justify-center">
                  <ul className="legend grid grid-cols-2 gap-3">
                    {labels.map((label, i) => (
                      <li key={label} className="legend-item ">
                        <span
                          className="legend-color w-3 h-3 rounded-sm"
                          style={{ backgroundColor: colors[i % colors.length] }}
                        />
                        <span className="muted truncate">{label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="thin-border my-[13px] mx-[-16px] xl:mx-[-32px]" />
          {/* Footer */}
          <div className="footer mx-5 lg:mx-0 mx-3">
            {stats.map((item, i) => (
              <div key={i} className="footer-item">
                <h1 className={`${isLoaded ? "text-primary" : "text-danger"}`}>
                  {item.value}
                </h1>
                <span className="muted">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadedUnLoaded;
