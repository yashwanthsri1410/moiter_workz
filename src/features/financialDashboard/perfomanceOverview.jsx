import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Box, ChartColumn } from "lucide-react";
import { useOperationStore } from "../../store/operationStore";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ["#FFD600", "#FF6D00", "#2962FF", "#7C4DFF", "#00C853"];

export default function PerformanceOverview() {
  const { productData, error } = useOperationStore();

  const totalTransactions = productData?.reduce(
    (sum, item) => sum + item.productCount,
    0
  );

  const activeProducts = productData?.length;

  const chartData = {
    labels: productData?.map((item) => item.walletCategory),
    datasets: [
      {
        data: productData?.map((item) => item.pctOfTotal),
        backgroundColor: COLORS,
        borderWidth: 0.5,
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
        backgroundColor: "#fff", // white background
        titleColor: "#1f2937", // dark title text
        bodyColor: "#1f2937", // dark body text
        borderColor: "#d1d5db", // light gray border to define edges
        borderWidth: 1, // make border visible
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            let value = context.raw || 0;
            return `${label}: ${value.toLocaleString()}%`;
          },
        },
        // Optional: reduce shadow to avoid blur
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 0,
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
      label: "Total Products",
      value: totalTransactions?.toLocaleString(),
    },
    {
      label: "Active Products",
      value: activeProducts,
    },
  ];

  if (error?.product) {
    return (
      <h1 className="text-red-500 text-xs text-center">{error?.product}</h1>
    );
  }
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
            {productData?.map((item, index) => (
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
              <div className="primary-color font-bold text-lg">
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
