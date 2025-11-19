import React, { useEffect, useState } from "react";
import axios from "axios";
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
import { primaryColor } from "../../constants";
import { getDashboardData } from "../../services/service";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  const [chartData, setChartData] = useState(null); // null if no data
  const [yAxisConfig, setYAxisConfig] = useState({
    max: 10,
    step: 2,
    ticks: [0, 2, 4, 6, 8],
  });

  useEffect(() => {
    const fetchChartData = async () => {
      const res = await getDashboardData("Export/wallet-transcation-dashboard");
      const data = res?.data;

      if (!Array.isArray(data) || data.length === 0) {
        setChartData(null); // No data
        return;
      }

      // Extract values
      const labels = data.map((d) => d.dayOfWeek);
      const load = data.map((d) => d.totalLoadAmountMillion);
      const spend = data.map((d) => d.totalUnloadAmountMillion);

      const allValues = [...load, ...spend];
      const maxValue = Math.max(...allValues);

      // Exactly 5 ticks: 0 + 4 intervals
      const totalTicks = 5;
      const rawStep = maxValue / (totalTicks - 1);
      const step = Math.ceil(rawStep);
      const yMax = step * (totalTicks - 1);
      const visibleTicks = Array.from({ length: totalTicks }, (_, i) =>
        parseFloat((i * step).toFixed(6))
      );

      setYAxisConfig({ max: yMax, step, ticks: visibleTicks });

      setChartData({
        labels,
        datasets: [
          { label: "Load", data: load, backgroundColor: "#00D4FF" },
          { label: "Unload", data: spend, backgroundColor: "#ff5252" },
        ],
      });
    };

    fetchChartData();
  }, []);
  const isVisibleTick = (value) => {
    return yAxisConfig?.ticks?.some((t) => Math.abs(t - value) < 1e-6);
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Daily Load vs Unload (7 Days)",
        color: primaryColor,
        font: { size: 14, weight: "200" },
        align: "start",
        padding: { top: 10, bottom: 40 },
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

          // Hide tooltip if not visible
          if (tooltip.opacity === 0) {
            tooltipEl.style.opacity = "0";
            tooltipEl.style.left = "-9999px";
            return;
          }

          // Build tooltip content
          if (tooltip.body) {
            const title = tooltip.title?.[0] ?? "";
            const load = tooltip.dataPoints[0]?.raw ?? "";
            const unload = tooltip.dataPoints[1]?.raw ?? "";

            tooltipEl.innerHTML = `
        <div style="margin-bottom:6px; font-weight:600; color:#aeb6bd">${title}</div>
        <div style="color:var(--primary-color); font-weight:700">Loaded: ₹${load}M</div>
        <div style="color:#ff5252; font-weight:700">Unloaded: ₹${unload}M</div>
      `;
          }

          // Force offscreen to measure size
          tooltipEl.style.left = "-9999px";
          tooltipEl.style.top = "0px";
          tooltipEl.style.opacity = "0";

          const rect = tooltipEl.getBoundingClientRect();
          const tooltipW = rect.width;
          const tooltipH = rect.height;

          // Compute caret position
          const caretX =
            tooltip.caretX ??
            chart.getDatasetMeta(0).data[tooltip.dataPoints[0].dataIndex].x;
          const caretY = tooltip.caretY ?? chart.chartArea.top;

          const canvasRect = chart.canvas.getBoundingClientRect();
          const pageX = canvasRect.left + window.pageXOffset + caretX;
          const pageY = canvasRect.top + window.pageYOffset + caretY;

          // Default position: above and slightly to the right
          let left = pageX + 10;
          let top = pageY - tooltipH - 10;

          // If tooltip would overflow right, flip to left
          const screenWidth = window.innerWidth;
          if (left + tooltipW > screenWidth - 8) {
            left = pageX - tooltipW - 10;
          }

          // Clamp to viewport left edge
          if (left < 8) left = 8;

          // If tooltip goes above viewport, place below the bar
          if (top < 8) top = pageY + 10;

          tooltipEl.style.left = `${Math.round(left)}px`;
          tooltipEl.style.top = `${Math.round(top)}px`;
          tooltipEl.style.opacity = "1";
        },
      },
    },
    scales: {
      x: {
        grid: { drawTicks: true, drawOnChartArea: false, color: "#11161A" },
        ticks: { color: "#7C828D" },
        border: { color: "#7C828D" },
      },
      y: {
        grid: {
          drawTicks: true,
          drawOnChartArea: false,
          color: (ctx) =>
            isVisibleTick(ctx.tick.value) ? "#7C828D" : "transparent",
        },
        ticks: {
          callback: (value) =>
            isVisibleTick(value) ? `₹${value.toFixed(1)}M` : "",
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

  const verticalHighlight = {
    id: "verticalHighlight",
    beforeDatasetsDraw(chart) {
      const {
        ctx,
        tooltip,
        chartArea: { top, bottom },
        scales: { x },
      } = chart;
      if (!tooltip?.opacity || !tooltip.dataPoints?.length) return;
      const index = tooltip.dataPoints[0].dataIndex;
      const tickWidth =
        index < x.ticks.length - 1
          ? x.getPixelForTick(index + 1) - x.getPixelForTick(index)
          : x.getPixelForTick(index) - x.getPixelForTick(index - 1);
      const barCenter = x.getPixelForTick(index);
      ctx.save();
      ctx.fillStyle = "#A2A2A2";
      ctx.fillRect(barCenter - tickWidth / 2, top, tickWidth, bottom - top);
      ctx.restore();
    },
  };

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

  if (!chartData) {
    return (
      <span style={{ color: "red", fontSize: "18px", fontWeight: "bold" }}>
        No Data Available
      </span>
    );
  }
  return (
    <div
      className="corner-box"
      style={{
        height: "500px",
        padding: "20px",
        width: "100",
        // width: "615px",
        backgroundColor: "var(--cards-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span></span>
      <Bar
        data={chartData}
        options={options}
        plugins={[verticalHighlight, verticalTicks]}
      />
    </div>
  );
};

export default BarChart;
