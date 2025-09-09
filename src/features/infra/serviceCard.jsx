import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const ServiceCard = ({ service }) => {
  // service uses new keys: { code, name, isRunning, usageCount, endpoints, icon }
  const [isOpen, setIsOpen] = useState(false);
  const isUp = service.isRunning;

  const totalEndpoints = service.endpoints?.length ?? 0;
  const runningEndpoints =
    service.endpoints?.filter((e) => e.isRunning).length ?? 0;

  return (
    <div
      className={`service-cards border ${
        isUp ? "card-up border-[#045a4e]" : "card-down border-[#f87171]"
      } ${isOpen ? "open" : ""}`}
      style={{
        animation: isUp
          ? "greenGlow 2s ease-in-out infinite"
          : "redGlow 2s ease-in-out infinite",
      }}
    >
      {/* Sweeper effect */}
      <span className="sweeper" aria-hidden="true" />

      {/* Header */}
      <div className="card-headers">
        <div className="card-headers-left">
          <div className="ping-wrapper">
            <span className={`ping-circle ${isUp ? "green" : ""}`} />
            <span className={`ping-dot ${isUp ? "green" : "red"}`} />
          </div>
          <span className={`icon-wrapper ${isUp ? "icon-up" : "icon-down"}`}>
            {service.icon}
          </span>
        </div>

        {/* <button onClick={() => setIsOpen(!isOpen)} className="toggle-btn">
          {isOpen ? (
            <ChevronUp size="16" color="gray" />
          ) : (
            <ChevronDown size="16" color="gray" />
          )}
        </button> */}
      </div>

      {/* Title */}
      <h2 className="card-title">
        {service.name} ({service.code})
      </h2>

      {/* Stats */}
      <div className="stat-row">
        <p className="stat-label">Total Requests</p>
        <p
          style={{ fontSize: "16px" }}
          className={`zoom-animate stat-value ${
            isUp ? "db-up-color" : "db-down-color"
          }`}
        >
          {service.usageCount}
        </p>
      </div>
      <div className="stat-row small">
        <p className="stat-label">Sub-APIs</p>
        <p className={isUp ? "db-up-color" : "db-down-color"}>
          {runningEndpoints}/{totalEndpoints}
        </p>
      </div>

      {/* Collapsible details */}
      {isOpen && (
        <div
          className={`endpoints-container ${
            totalEndpoints === 0 ? "scrollbar-none" : ""
          }`}
        >
          <p className="endpoints-title">Sub-API Endpoints</p>
          {totalEndpoints === 0 ? (
            <p className="endpoints-empty">No endpoints available.</p>
          ) : (
            <ul className="endpoints-list">
              {service.endpoints.map((ep, i) => (
                <li key={`${service.code}-ep-${i}`} className="endpoint-item">
                  <div className="endpoint-left">
                    <span
                      className={`endpoint-dot ${
                        ep.isRunning ? "green" : "red"
                      }`}
                    />
                    <span className="endpoint-url">{ep.url}</span>
                  </div>
                  <span
                    className={`endpoint-badge ${
                      ep.isRunning ? "badge-up" : "badge-down"
                    }`}
                  >
                    {ep.usageCount} calls
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceCard;
