import React, { useEffect, useRef, useState } from "react";
import "../../styles/styles.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { primaryColor } from "../../constants";
// register required controllers
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // useEffect(() => {
  //   fetch("http://192.168.22.247/fes/api/Export/customer_dashboard_export")
  //     .then(async (res) => {
  //       if (!res.ok) {
  //         const text = await res.text();
  //         throw new Error(`HTTP ${res.status}: ${text}`);
  //       }
  //       return res.json();
  //     })
  //     .then((data) => {
  //       // console.log("✅ API Data:", data);
  //       if (Array.isArray(data) && data.length > 0) {
  //         const first = data[0];
  //         setChartData({
  //           labels: ["Verified", "Rejected", "Pending"],
  //           datasets: [
  //             {
  //               data: [
  //                 first.kycVerifiedPct,
  //                 first.kycRejectedPct,
  //                 first.kycPendingPct,
  //               ],
  //               backgroundColor: ["#00D4FF", "#ef4444", "#F59E0B"],
  //               borderColor: "#f0f0f0",
  //               borderWidth: 1,
  //               radius: "70%",
  //             },
  //           ],
  //         });
  //       }
  //     })
  //     .catch((err) => console.error("🚨 Error fetching API data:", err));
  // }, []);
  useEffect(() => {
    const fetchCustomerDashboardChart = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/fes/api/Export/customer_dashboard_export`
        );
        const data = res.data;

        if (Array.isArray(data) && data.length > 0) {
          const first = data[0];
          setChartData({
            labels: ["Verified", "Rejected", "Pending"],
            datasets: [
              {
                data: [
                  first.kycVerifiedPct,
                  first.kycRejectedPct,
                  first.kycPendingPct,
                ],
                backgroundColor: ["#00D4FF", "#ef4444", "#F59E0B"],
                borderColor: "#f0f0f0",
                borderWidth: 1,
                radius: "70%",
              },
            ],
          });
        }
      } catch (err) {
        console.error("🚨 Error fetching API data:", err);
      }
    };

    fetchCustomerDashboardChart();
  }, []);
  useEffect(() => {
    if (!chartData) return;
    const ctx = canvasRef.current.getContext("2d");

    if (chartRef.current) {
      chartRef.current.destroy(); // ✅ destroy old instance
    }

    let animationDone = false;

    // leader line plugin
    const leaderLinesPlugin = {
      id: "leaderLines",
      afterDatasetsDraw(chart) {
        if (!animationDone || chart.animating) return;

        const ctx = chart.ctx;
        const meta = chart.getDatasetMeta(0);
        const ds = chart.data.datasets[0];
        if (!meta || !meta.data) return;

        const total = ds.data.reduce((s, v) => s + v, 0);

        ctx.save();
        ctx.lineWidth = 1.5;
        ctx.font = "12px Arial";
        ctx.textBaseline = "middle";

        meta.data.forEach((arc, i) => {
          const mid = (arc.startAngle + arc.endAngle) / 2;
          const cx = arc.x,
            cy = arc.y,
            outer = arc.outerRadius;

          const edgeX = cx + Math.cos(mid) * outer;
          const edgeY = cy + Math.sin(mid) * outer;

          const offset = 20;
          const lineEndX = cx + Math.cos(mid) * (outer + offset);
          const lineEndY = cy + Math.sin(mid) * (outer + offset);

          ctx.strokeStyle = ds.backgroundColor[i];
          ctx.fillStyle = ds.backgroundColor[i];

          ctx.beginPath();
          ctx.moveTo(edgeX, edgeY);
          ctx.lineTo(lineEndX, lineEndY);
          ctx.stroke();

          const val = ds.data[i];
          const pct = Math.round((val / total) * 100);
          const text = `${chart.data.labels[i]} ${val}%`;

          ctx.textAlign = Math.cos(mid) >= 0 ? "left" : "right";
          const pad = 6;
          ctx.fillText(
            text,
            lineEndX + (Math.cos(mid) >= 0 ? pad : -pad),
            lineEndY
          );
        });
        ctx.restore();
      },
    };

    // custom tooltip
    const externalTooltipHandler = (context) => {
      let tooltipEl = document.getElementById("chartjs-tooltip");
      if (!tooltipEl) {
        tooltipEl = document.createElement("div");
        tooltipEl.id = "chartjs-tooltip";
        tooltipEl.style.background = "#11161a";
        tooltipEl.style.width = "120px";
        tooltipEl.style.border = "1px solid #50887dff";
        tooltipEl.style.borderRadius = "10px";
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
        const dataIndex = tooltipModel.dataPoints[0].dataIndex;
        const label = context.chart.data.labels[dataIndex];
        const value = context.chart.data.datasets[0].data[dataIndex];

        tooltipEl.innerHTML = `
          <div style="margin-bottom:5px;">${label}</div>
          <div style="color:var(--primary-color);">${value} customers</div>
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
    };

    chartRef.current = new ChartJS(ctx, {
      type: "pie",
      data: chartData,
      options: {
        rotation: 90,
        circumference: -360,
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 2000,
          onComplete: () => {
            animationDone = true;
            chartRef.current.draw();
          },
        },
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Onboarding Statistics",
            color: primaryColor,
            font: { size: 14, weight: "200" },
            align: "start",
            padding: { top: 10, bottom: 10 },
          },
          tooltip: {
            enabled: false,
            external: externalTooltipHandler,
          },
        },
      },
      plugins: [leaderLinesPlugin],
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <div className="corner-box chart-box-a91z w-full h-[300px] md:h-[400px]">
      <span></span>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default PieChart;
