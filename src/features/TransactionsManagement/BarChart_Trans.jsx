import React from "react";
import "../../styles/styles.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const yAxisConfig = {
  step: 50, // step size
};

// helper for visible ticks
const isVisibleTick = (value) => value % yAxisConfig.step === 0;

// plugin to draw vertical ticks
const verticalTicks = {
  id: "verticalTicks",
  afterDraw(chart) {
    const {
      ctx,
      chartArea: { bottom },
      scales: { x },
    } = chart;
    ctx.save();
    const tickHeight = 8;
    ctx.strokeStyle = "#7C828D";
    ctx.lineWidth = 2;
    x.ticks.forEach((_, index) => {
      const xPos = x.getPixelForTick(index);
      ctx.beginPath();
      ctx.moveTo(xPos, bottom);
      ctx.lineTo(xPos, bottom + tickHeight);
      ctx.stroke();
    });
    ctx.restore();
  },
};

const BarChart_Trans = () => {
  const chartData = {
    labels: ["00", "06", "12", "18", "24"],
    datasets: [
      {
        label: "New Customers",
        data: [50, 70, 40, 90, 65],
        backgroundColor: "#00D4FF",
      },
      {
        label: "Returning Customers",
        data: [30, 40, 20, 60, 45],
        backgroundColor: "#6366F1",
      },
      {
        label: "Churned Customers",
        data: [10, 20, 15, 25, 20],
        backgroundColor: "#8B5CF6",
      },
      {
        label: "Forward Customers",
        data: [10, 20, 15, 25, 40],
        backgroundColor: "#F59E0B",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Customer Onboarding (Last 6 Months)",
        color: "#00d4aa",
        font: { size: 14, weight: "200" },
        align: "start",
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        enabled: false,
        external: function (context) {
          const { chart, tooltip } = context;
          let tooltipEl = document.getElementById("chartjs-tooltip");

          if (!tooltipEl) {
            tooltipEl = document.createElement("div");
            tooltipEl.id = "chartjs-tooltip";
            Object.assign(tooltipEl.style, {
              background: "#11161a",
              border: "1px solid #50887dff",
              borderRadius: "12px",
              color: "white",
              opacity: "0",
              pointerEvents: "none",
              position: "absolute",
              transition: "all .08s ease",
              padding: "8px 10px",
              fontSize: "13px",
              fontFamily: "Arial, sans-serif",
              whiteSpace: "nowrap",
              zIndex: 9999,
            });
            document.body.appendChild(tooltipEl);
          }

          if (tooltip.opacity === 0) {
            tooltipEl.style.opacity = "0";
            tooltipEl.style.left = "-9999px";
            return;
          }
          const tooltipModel = context.tooltip;
          if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
          }
          if (tooltipModel.body) {
            const title = tooltipModel.title[0]; // Hour
            const bodyLines = tooltipModel.body.map((b) => b.lines);

            let innerHtml = `<div style="margin-bottom:6px; font-weight:600; color:#aeb6bd">Hour ${title}</div>`;
            bodyLines.forEach((body, i) => {
              const dataset = context.tooltip.dataPoints[i].dataset.label;
              const value = context.tooltip.dataPoints[i].raw;
              const color = context.tooltip.labelColors[i].backgroundColor;
              innerHtml += `
                <div style="color:${color}; font-weight:700">
                  ${dataset} : ${value} txns
                </div>`;
            });

            tooltipEl.innerHTML = innerHtml;
          }

          const rect = tooltipEl.getBoundingClientRect();
          const tooltipW = rect.width;
          const tooltipH = rect.height;

          let caretX = tooltip.caretX;
          let caretY = tooltip.caretY;

          const canvasRect = chart.canvas.getBoundingClientRect();
          const pageX = canvasRect.left + window.pageXOffset + (caretX ?? 0);
          const pageY = canvasRect.top + window.pageYOffset + (caretY ?? 0);

          let left = pageX + 10;
          let top = pageY - tooltipH - 10;

          const screenWidth = window.innerWidth;
          if (left + tooltipW > screenWidth - 8) {
            left = pageX - tooltipW - 10;
          }
          if (left < 8) left = 8;
          if (top < 8) top = pageY + 10;

          tooltipEl.style.left = `${Math.round(left)}px`;
          tooltipEl.style.top = `${Math.round(top)}px`;
          tooltipEl.style.opacity = "1";
        },
      },
    },
    scales: {
      x: {
        stacked: true, // stack on x-axis
        grid: { drawTicks: true, drawOnChartArea: false, color: "#11161A" },
        ticks: { color: "#7C828D" },
        border: { color: "#7C828D" },
      },
      y: {
        stacked: true, // stack on y-axis
        grid: {
          drawTicks: true,
          drawOnChartArea: false,
          color: (ctx) =>
            isVisibleTick(ctx.tick.value) ? "#7C828D" : "transparent",
        },
        ticks: {
          callback: (value) => (isVisibleTick(value) ? `${value}` : ""),
          color: "#7C828D",
          maxTicksLimit: 5,
          stepSize: yAxisConfig.step,
          autoSkip: false,
        },
        min: 0,
        max: yAxisConfig.max,
        border: { color: "#7C828D" },
      },
    },
  };

  return (
    <div className="corner-box chart-box-a91z">
      <Bar data={chartData} options={options} plugins={[verticalTicks]} />
      <span></span>
    </div>
  );
};

export default BarChart_Trans;
