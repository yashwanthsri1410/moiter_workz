import React, { useRef, useEffect } from "react";
import "../../styles/styles.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { primaryColor } from "../../constants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  Tooltip
);

const LineChart = () => {
  const chartRef = useRef(null);

  const labels = ["1", "2", "3", "4", "5", "6", "7"];
  const fullLoad = [42, 42.4, 43.1, 43.8, 44.2, 45.2, 45.2];

  const maxValue = Math.max(...fullLoad);
  const totalTicks = 5;
  const step = Math.ceil(maxValue / (totalTicks - 1));
  const yMax = step * (totalTicks - 1);
  const visibleTicks = Array.from({ length: totalTicks }, (_, i) => i * step);
  const isVisibleTick = (value) =>
    visibleTicks.some((t) => Math.abs(t - value) < 1e-6);

  const data = {
    labels,
    datasets: [
      {
        data: fullLoad,
        borderColor: "transparent", // line drawn by plugin
        backgroundColor: "#00D4FF",
        pointRadius: 7,
        pointHoverRadius: 7,
        fill: false,
        tension: 0.3,
      },
    ],
  };

  // Progressive line plugin
  const progressiveLinePlugin = {
    id: "progressiveLine",
    afterDatasetDraw(chart) {
      const { ctx, scales } = chart;
      const points = fullLoad.map((val, i) => ({
        x: scales.x.getPixelForValue(i),
        y: scales.y.getPixelForValue(val),
      }));

      const progress = chart.options.plugins.progressiveLine.progress || 0;
      const lastIndex = Math.floor(progress * (points.length - 1));
      const remainder = progress * (points.length - 1) - lastIndex;

      ctx.save();
      ctx.strokeStyle = "#00D4FF";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i <= lastIndex; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      if (lastIndex + 1 < points.length) {
        const nextX =
          points[lastIndex].x +
          (points[lastIndex + 1].x - points[lastIndex].x) * remainder;
        const nextY =
          points[lastIndex].y +
          (points[lastIndex + 1].y - points[lastIndex].y) * remainder;
        ctx.lineTo(nextX, nextY);
      }
      ctx.stroke();
      ctx.restore();
    },
  };

  // Vertical line plugin on hover
  const verticalLinePlugin = {
    id: "verticalLine",
    afterDraw(chart) {
      const { ctx, tooltip, chartArea, scales } = chart;
      if (!tooltip?.opacity || !tooltip.dataPoints?.length) return;

      const index = tooltip.dataPoints[0].dataIndex;
      const xPos = scales.x.getPixelForValue(index);
      const yPosTop = chartArea.top;
      const yPosBottom = scales.y.getPixelForValue(0);

      ctx.save();
      ctx.strokeStyle = "#A2A2A2";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(xPos, yPosTop);
      ctx.lineTo(xPos, yPosBottom);
      ctx.stroke();
      ctx.restore();
    },
  };
  const verticalLineOnPointPlugin = {
    id: "verticalLineOnPoint",
    afterDraw(chart) {
      const { ctx, tooltip, chartArea, scales } = chart;

      // Only draw if hovering an actual point
      if (!tooltip?.opacity || !tooltip.dataPoints?.length) return;

      const index = tooltip.dataPoints[0].dataIndex;
      const xPos = scales.x.getPixelForValue(index);

      ctx.save();
      ctx.strokeStyle = "#A2A2A2";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(xPos, chartArea.top);
      ctx.lineTo(xPos, chartArea.bottom);
      ctx.stroke();
      ctx.restore();
    },
  };

  // Animate progressive line
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.01;
      if (progress > 1) progress = 1;
      if (chartRef.current) {
        chartRef.current.options.plugins.progressiveLine.progress = progress;
        chartRef.current.update("none");
      }
      if (progress === 1) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: { display: false },
      progressiveLine: { progress: 0 },
      title: {
        display: true,
        text: "Wallet Balance Trend (7 Days)",
        color: primaryColor,
        font: { size: 14, weight: "200" },
        align: "start",
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#222831",
        borderColor: getComputedStyle(
          document.documentElement
        ).getPropertyValue("--primary-color"),
        borderWidth: 0.5,
        bodyColor: "white",
        callbacks: {
          label: (ctx) => `Balance: ₹${ctx.raw}M`,
          title: (ctx) => `Day ${ctx[0].label}`,
        },
      },
    },
    scales: {
      x: {
        grid: { drawTicks: true, drawOnChartArea: false, color: "#ada8a8ff" },
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
          stepSize: step,
          autoSkip: false,
        },
        min: 0,
        max: yMax,
        border: { color: "#7C828D" },
      },
    },
  };

  return (
    <div className="corner-box chart-box-a91z ">
      <span></span>
      <Line
        ref={chartRef}
        data={data}
        options={options}
        plugins={[
          progressiveLinePlugin,
          //   verticalLinePlugin,
          verticalLineOnPointPlugin,
        ]}
      />
    </div>
  );
};

export default LineChart;
