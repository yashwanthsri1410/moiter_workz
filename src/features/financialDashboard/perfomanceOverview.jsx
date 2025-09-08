import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Box, ChartColumn } from "lucide-react";
import { useOperationStore } from "../../store/operationStore";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ["#FFD600", "#FF6D00", "#2962FF", "#7C4DFF", "#00C853"];

export default function PerformanceOverview() {
  const { productData } = useOperationStore();
  const totalTransactions = productData.reduce(
    (sum, item) => sum + item.activeWallets,
    0
  );

  const activeProducts = productData.length;

  const chartData = {
    labels: productData.map((item) => item.walletCategory),
    datasets: [
      {
        data: productData.map((item) => item.activeWallets),
        backgroundColor: COLORS,
        borderWidth: 1,
        borderColor: "#0f0f0f",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // we’ll create custom legend below
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            let value = context.raw || 0;
            return `${label}: ${value.toLocaleString()}`;
          },
        },
        backgroundColor: "#fff",
        titleColor: "#1f2937",
        bodyColor: "#1f2937",
        borderColor: "#fff",
      },
    },
    elements: {
      arc: {
        borderWidth: 1,
        borderColor: "#0f0f0f",
        spacing: 2, // adds extra spacing between slices
      },
    },
  };

  const footerStats = [
    {
      label: "Total Transactions",
      value: totalTransactions.toLocaleString(),
    },
    {
      label: "Active Products",
      value: activeProducts,
    },
  ];

  return (
    <div>
      <h2 className="flex items-center gap-2 text-[18px] text-primary mb-6">
        <span>
          <ChartColumn size="18" />
        </span>{" "}
        Performance Overview
      </h2>
      <div className="glass-card h-[500px] flex flex-col corner-box">
        <span />
        {/* Header */}
        <div className="flex items-center text-primary gap-2 mb-4">
          <Box size={18} />
          <h2 className="text-sm font-medium">Product Performance Analytics</h2>
        </div>

        {/* Chart with fixed height */}
        <div className="h-52 flex justify-center">
          <Pie data={chartData} options={options} />
        </div>

        {/* Custom Legend */}
        <div className="flex justify-center my-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            {productData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-gray-300">{item.walletCategory}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="thin-border my-[13px] mx-[-16px] xl:mx-[-32px]" />
        <div className="pt-4 flex justify-around text-center">
          {footerStats.map((stat, index) => (
            <div key={index}>
              <div className="text-[#00D4AA] font-bold text-lg">
                {stat.value}
              </div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
