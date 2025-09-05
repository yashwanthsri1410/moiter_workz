import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { weekOrder } from "../constants";
import { TrendingUp } from "lucide-react";
import { useOperationStore } from "../store/useOperationStore";
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
  Legend
);

const WeeklyTrends = () => {
  // Filter only non-zero days
  const { transactionData, error } = useOperationStore();

  // const transactionData = transactionData?.filter((item) => {
  //   return !(
  //     item.totalLoadAmountMillion === 0 &&
  //     item.totalLoadTransactions === 0 &&
  //     item.totalLoadUsers === 0 &&
  //     item.totalUnloadAmountMillion === 0 &&
  //     item.totalUnloadTransactions === 0 &&
  //     item.totalUnloadUsers === 0
  //   );
  // });
  // console.log(transactionData);

  // ✅ sort by weekday order
  // const transactionData = transactionData?.sort(
  //   (a, b) => weekOrder.indexOf(a.dayOfWeek) - weekOrder.indexOf(b.dayOfWeek)
  // );

  // const labels = transactionData.map((d) => d.dayOfWeek);
  // const loadValues = transactionData?.map((d) => d.totalLoadAmountMillion * 1000); // scaling
  // const unloadValues = transactionData?.map(
  //   (d) => d.totalUnloadAmountMillion * 1000
  // );

  const dataset = {
    labels: transactionData?.map((d) => d.dayOfWeek), // ["Mon", "Tue", ...]
    datasets: [
      {
        label: "Loading Amount (Million)",
        data: transactionData?.map((d) => d.totalLoadAmountMillion),
        borderColor: "#00D4AA",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        tension: 0.4,
        fill: false,
        pointBackgroundColor: "#00D4AA",
      },
      {
        label: "Unloading Amount (Million)",
        data: transactionData?.map((d) => d.totalUnloadAmountMillion),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        tension: 0.4,
        fill: false,
        pointBackgroundColor: "#ef4444",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#fff",
        borderWidth: 1,
        titleColor: "#111827",
        bodyColor: "#111827",
        padding: 8,
        cornerRadius: 8,
        callbacks: {
          // 👇 Override title
          title: function (context) {
            // Take the day name (x-axis label)
            const title = context[0].label || "";
            // Wrap in extra spaces to center visually
            return "   " + title + "   ";
          },
          label: function (context) {
            const index = context.dataIndex;
            const datasetLabel = context.dataset.label;
            const dayData = transactionData[index];

            if (datasetLabel.includes("Loading")) {
              return [
                `Amount: ${dayData.totalLoadAmountMillion}M`,
                `Transactions: ${dayData.totalLoadTransactions}`,
                `Users: ${dayData.totalLoadUsers}`,
              ];
            } else if (datasetLabel.includes("Unloading")) {
              return [
                `Amount: ${dayData.totalUnloadAmountMillion}M`,
                `Transactions: ${dayData.totalUnloadTransactions}`,
                `Users: ${dayData.totalUnloadUsers}`,
              ];
            }
            return "";
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: "#1f2a28" },
        ticks: { color: "#94a3b8" },
      },
      y: {
        grid: { color: "#1f2a28" },
        ticks: {
          color: "#94a3b8",
          callback: (value) => value + "M",
        },
      },
    },
  };

  // const totalLoading = loadValues?.reduce((a, b) => a + b, 0).toFixed(1);
  // const totalUnloading = unloadValues?.reduce((a, b) => a + b, 0).toFixed(1);

  const legends = [
    {
      label: "Loading",
      color: "#00d4aa",
      textColor: "stat-value text-primary",
      value: transactionData?.[0]?.["cumulativeLoadAmountMillion"],
    },
    {
      label: "Unloading",
      color: "#ff5b5b",
      textColor: "stat-value text-danger",
      value: transactionData?.[0]?.["cumulativeUnloadAmountMillion"],
    },
  ];
  return (
    <>
      {error.transaction && (
        <h1 className="text-red-500 text-xs text-center">
          {error.transaction}
        </h1>
      )}
      {!error.transaction && (
        <div className="glass-card">
          {/* Title */}
          <h2 className="flex items-center gap-2 mb-4">
            <TrendingUp size="18" className="text-primary" />
            <span className="title-text">Weekly Trends</span>
          </h2>

          {/* Chart */}
          <div className="h-64">
            <Line data={dataset} options={options} />
          </div>
          <div className="thin-border my-[13px] mx-[-16px]" />
          {/* Custom Legend */}
          <div className="flex justify-between px-3 xl:px-10">
            {legends.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></span>
                <div className="flex flex-col">
                  <span className={item.textColor}>₹{item.value}M</span>
                  <span className="muted">&nbsp;{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default WeeklyTrends;
