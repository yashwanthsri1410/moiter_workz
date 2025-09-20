import React, { useEffect, useRef, useState } from "react";
import "../../styles/styles.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// register required controllers
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart_Trans = () => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  // ✅ Hardcoded data
  const [chartData] = useState({
    labels: ["UPI", "ECOM", "ATM", "POS"],
    datasets: [
      {
        data: [40, 25, 20, 15], // example percentages
        backgroundColor: ["#00D4FF", "#F59E0B", "#A855F7", "#10B981"],
        borderColor: "#f0f0f0",
        borderWidth: 1,
        radius: "70%",
      },
    ],
  });

  useEffect(() => {
    if (!chartData) return;
    const ctx = canvasRef.current.getContext("2d");

    if (chartRef.current) {
      chartRef.current.destroy(); // destroy old chart instance
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
          <div style="color:#00d4aa;">${value} %</div>
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
            text: "Transaction Channel Distribution",
            color: "#00d4aa",
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
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [chartData]);

  return (
    <div className="corner-box ">
      <span></span>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default PieChart_Trans;
