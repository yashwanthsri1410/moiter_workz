import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { primaryColor } from "../../constants/index";
import {
  getDashboardData,
  getOnboardedCustomers,
} from "../../services/service";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  const [chartData, setChartData] = useState(null);
  const [yAxisConfig, setYAxisConfig] = useState({
    max: 10,
    step: 2,
    ticks: [0, 2, 4, 6, 8],
  });
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchOnboardedCustomers = async () => {
      try {
        const res = await getDashboardData("Export/onboarded_customers_export");
        const data = res.data;

        // Define month order for chronological sorting
        const monthOrder = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        // Sort by month and take last 6 months
        const sortedData = data
          .sort(
            (a, b) =>
              monthOrder.indexOf(a.monthLabel) -
              monthOrder.indexOf(b.monthLabel)
          )
          .slice(-6);

        const labels = sortedData.map((item) => item.monthLabel);
        const customers = sortedData.map((item) => item.onboardedCustomers);

        const maxValue = Math.max(...customers);

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
            {
              label: "Customers",
              data: customers,
              backgroundColor: "#00D4FF",
            },
          ],
        });
      } catch (err) {
        console.error("Failed to fetch chart data:", err);
        setChartData(null); // optional: reset chart on error
      }
    };

    fetchOnboardedCustomers();
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
        text: "Customer Onboarding (Last 6 Months)",
        color: primaryColor,
        font: { size: 14, weight: "200" },
        align: "start",
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        enabled: false,
        external: function (context) {
          const { chart, tooltip } = context;
          let tooltipEl = document.getElementById("chartjs-tooltip");

          // Create tooltip element if missing
          if (!tooltipEl) {
            tooltipEl = document.createElement("div");
            tooltipEl.id = "chartjs-tooltip";
            // inline styles (you can move these to CSS if preferred)
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

          // Hide if no tooltip
          if (tooltip.opacity === 0) {
            tooltipEl.style.opacity = "0";
            tooltipEl.style.left = "-9999px";
            return;
          }

          // Build tooltip content
          if (tooltip.body) {
            const title = tooltip.title?.[0] ?? "";
            const value = tooltip.dataPoints?.[0]?.raw ?? "";
            tooltipEl.innerHTML = `
        <div style="margin-bottom:6px; font-weight:600; color:#aeb6bd">${title}</div>
        <div style="color:var(--primary-color); font-weight:700">${value} New Customers</div>
      `;
          }

          // Force offscreen placement briefly so we can measure dimensions reliably
          tooltipEl.style.left = "-9999px";
          tooltipEl.style.top = "0px";
          tooltipEl.style.opacity = "0";

          // Measure tooltip size
          const rect = tooltipEl.getBoundingClientRect();
          const tooltipW = rect.width;
          const tooltipH = rect.height;

          // Compute absolute pixel position for the hovered bar
          // Prefer tooltip.caretX / caretY, fallback to x-scale pixel for the data index
          let caretX = tooltip.caretX;
          let caretY = tooltip.caretY;
          if (
            (typeof caretX === "undefined" || typeof caretY === "undefined") &&
            tooltip.dataPoints?.length
          ) {
            const index = tooltip.dataPoints[0].dataIndex;
            const xScale = chart.scales.x;
            // getPixelForTick exists for category scale; fallback to 0 if not available
            if (xScale && typeof xScale.getPixelForTick === "function") {
              caretX = xScale.getPixelForTick(index);
              // place vertically near top of chart area (or center)
              caretY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
            } else {
              caretX = 0;
              caretY = chart.chartArea.top;
            }
          }

          const canvasRect = chart.canvas.getBoundingClientRect();
          const pageX = canvasRect.left + window.pageXOffset + (caretX ?? 0);
          const pageY = canvasRect.top + window.pageYOffset + (caretY ?? 0);

          // Default: place tooltip to the RIGHT of the caret
          let left = pageX + 10;
          let top = pageY - tooltipH - 10;

          // If it would overflow the right edge of viewport, flip to LEFT side
          const screenWidth = window.innerWidth;
          if (left + tooltipW > screenWidth - 8) {
            left = pageX - tooltipW - 10;
          }

          // Clamp to viewport left edge
          if (left < 8) left = 8;

          // If top would go above the viewport, position it below the caret instead
          if (top < 8) {
            top = pageY + 10;
          }

          // Finally show it
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
    <div className="corner-box chart-box-a91z">
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
