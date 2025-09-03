import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import "../styles/ApiMonitor.css";

export default function ApiGalaxyMonitor() {
  const [services, setServices] = useState([]);
  const [databaseStatus, setDatabaseStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(
          "http://192.168.22.247:7090/api/Export/infra-status"
        );
        const data = await res.json();
        setDatabaseStatus(data.databaseRunning);
        setServices(data.services || []);
      } catch (error) {
        console.error("Error fetching API status:", error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const radius = 250;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  // Chart component for each service
  const ServiceChart = ({ service }) => {
    const data = service.usageHistory || [
      { name: "Mon", requests: 400 },
      { name: "Tue", requests: 300 },
      { name: "Wed", requests: 500 },
      { name: "Thu", requests: 200 },
      { name: "Fri", requests: 450 },
      { name: "Sat", requests: 350 },
      { name: "Sun", requests: 600 },
    ];

    const lineColor = service.isRunning ? "#4f9cff" : "#ff4f4f";

    return (
      <div
        className="p-3 rounded-xl border border-white/10 backdrop-blur-xl mt-3"
        style={{
          background:
            "linear-gradient(135deg, rgba(32,34,61,0.85) 0%, rgba(45,48,87,0.85) 100%)",
          boxShadow:
            "0px 4px 12px rgba(0,0,0,0.4), 0px 0px 20px rgba(79,156,255,0.15)",
        }}
      >
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="name" stroke="#9ca3af" hide />
            <YAxis stroke="#9ca3af" hide />
            <Tooltip
              contentStyle={{
                background:
                  "linear-gradient(135deg, rgba(30,32,54,0.95) 0%, rgba(45,48,87,0.95) 100%)",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              }}
            />
            <Line
              type="monotone"
              dataKey="requests"
              stroke={lineColor}
              strokeWidth={2.5}
              dot={{ r: 3, fill: lineColor }}
              activeDot={{
                r: 5,
                fill: "#fff",
                stroke: lineColor,
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="galaxy-container">
      {/* Lines */}
      <svg className="galaxy-lines">
        {services.map((service, i) => {
          const angle = (i / services.length) * (2 * Math.PI);
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);

          return (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              className={`line ${service.isRunning ? "up" : "down"}`}
            />
          );
        })}
      </svg>

      {/* Center Database Node */}
      <div
        className={`database-node ${databaseStatus ? "up" : "down"}`}
        style={{ left: centerX, top: centerY }}
      >
        <div className="db-icon">🗄️</div>
      </div>

      {/* Service Cards */}
      {services.map((service, i) => {
        const angle = (i / services.length) * (2 * Math.PI);
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        return (
          <div
            key={service.name}
            className={`service-card ${service.isRunning ? "up" : "down"}`}
            style={{ left: x, top: y }}
          >
            <div className="card-header">
              <span className="service-icon">🗂</span>
              <h4>{service.name} Service</h4>
            </div>
            <div className="card-body">
              <p>Requests</p>
              <h2>{service.usageCount}</h2>
              {/* Chart below */}
              <ServiceChart service={service} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
