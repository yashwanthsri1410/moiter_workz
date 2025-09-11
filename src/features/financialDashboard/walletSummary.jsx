import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Wallet, ChartColumn, WalletCards } from "lucide-react";
// import { barChartColor } from "../constants";
import { useOperationStore } from "../../store/operationStore";
import { barChartColor } from "../../constants/index";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function WalletSummary() {
  const { walletPerformanceData, error } = useOperationStore();

  const label = walletPerformanceData?.map((e) => e.status);
  const currentCount = walletPerformanceData?.map((e) => e.currentCount);

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
    layout: { padding: 0 },
    plugins: {
      tooltip: {
        enabled: true,
        backgroundColor: "#fff",
        titleColor: "#1f2937",
        bodyColor: "#1f2937",
      },
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: "#9ca3af" },
        grid: {
          display: true,
          drawOnChartArea: true,
          drawTicks: true,
          drawBorder: false, // ✅ disable grid border (prevents overlap)
          color: "#1f2937",
          lineWidth: 1,
        },
        border: {
          display: true, // ✅ this draws the single bottom X-axis line
          color: "#1f2937",
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
          display: true,
          drawOnChartArea: true,
          drawTicks: true,
          drawBorder: false, // ❌ turn this OFF so grid doesn’t draw border
          color: "#1f2937",
          lineWidth: 1,
        },
        border: {
          display: true, // ✅ keep only ONE border
          color: "#9ca3af",
          width: 1, // ✅ force thin line
        },
      },
    },
  };

  if (error?.walletPerfomance) {
    return (
      <h1 className="text-red-500 text-xs text-center">
        {error?.walletPerfomance}
      </h1>
    );
  }

  return (
    <div>
      <h2 className="flex items-center gap-2 text-primary mb-6">
        <span>
          <Wallet size="18" />
        </span>
        <span className="text-[18px]">Wallet Performance Summary</span>
      </h2>
      <div className="glass-card h-[500px] flex flex-col corner-box">
        <span />
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-primary flex items-center gap-2">
            <WalletCards size={16} />
            <p className="text-sm">Wallet Distribution Status</p>
          </div>
        </div>

        {/* Bar Chart with same fixed height */}
        <div className="flex-1">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
}
