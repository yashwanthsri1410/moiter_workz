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

  useEffect(() => {
    fetch("http://192.168.22.247/fes/api/Export/onboarded_customers_export")
      .then((res) => res.json())
      .then((data) => {
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
      })
      .catch((err) => {
        console.error("Failed to fetch chart data:", err);
      });
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
        color: "#00d4aa",
        font: { size: 14, weight: "200" },
        align: "start",
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        enabled: false,
        external: function (context) {
          let tooltipEl = document.getElementById("chartjs-tooltip");
          if (!tooltipEl) {
            tooltipEl = document.createElement("div");
            tooltipEl.id = "chartjs-tooltip";
            tooltipEl.style.background = "#11161a";
            tooltipEl.style.border = "1px solid #50887dff";
            tooltipEl.style.borderRadius = "20px";
            tooltipEl.style.color = "white";
            tooltipEl.style.opacity = 1;
            tooltipEl.style.pointerEvents = "none";
            tooltipEl.style.position = "absolute";
            tooltipEl.style.transition = "all .1s ease";
            tooltipEl.style.padding = "10px";
            tooltipEl.style.fontSize = "13px";
            tooltipEl.style.fontFamily = "Arial, sans-serif";
            document.body.appendChild(tooltipEl);
          }

          const tooltipModel = context.tooltip;
          if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
          }

          if (tooltipModel.body) {
            const title = tooltipModel.title[0];
            const value = tooltipModel.dataPoints[0]?.raw;
            tooltipEl.innerHTML = `
              <div style="margin-bottom:5px;">${title}</div>
              <div style="color:#00d4aa;">Customers:${value}</div>
            `;
          }

          const canvasRect = context.chart.canvas.getBoundingClientRect();
          tooltipEl.style.left =
            canvasRect.left + window.pageXOffset + tooltipModel.caretX + "px";
          tooltipEl.style.top =
            canvasRect.top +
            window.pageYOffset +
            tooltipModel.caretY -
            tooltipEl.offsetHeight -
            10 +
            "px";
          tooltipEl.style.opacity = 1;
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
