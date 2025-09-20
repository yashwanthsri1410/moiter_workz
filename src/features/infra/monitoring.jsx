import ServiceCard from "./serviceCard";
import {
  Database,
  FileText,
  Box,
  AlertTriangle,
  Users,
  Shield,
  UserCheck,
  LoaderCircle,
} from "lucide-react";
import { useMonitoringStore } from "../../store/monitoringStore";
import { useEffect } from "react";
import { ArcherContainer, ArcherElement } from "react-archer";

/** ICONS IN SEPARATE ARRAY (map by code/name) */
const iconDefs = [
  { name: "AES", icon: <AlertTriangle size={18} /> },
  { name: "ATS", icon: <Shield size={18} /> },
  { name: "PS", icon: <Box size={18} /> },
  { name: "UMS", icon: <UserCheck size={18} /> },
  { name: "CS", icon: <Users size={18} /> },
  { name: "US", icon: <Users size={18} /> },
  { name: "FES", icon: <FileText size={18} /> },
];

/** Optional long names for display */
const displayNames = {
  AES: "Application Error Service",
  ATS: "Audit Trail Service",
  PS: "Product Service",
  UMS: "User Management Service",
  CS: "Customer Service",
  US: "User Service",
  DFS: "Data Fetch Service",
};

const Monitoring = ({
  isDBStrType,
  isDBBoolType,
  formatTime,
  time,
  isEmptyObj,
  stats,
}) => {
  const { infraStatus, setDBStatus, dbStatus } = useMonitoringStore();

  // Build a quick lookup from iconDefs
  const iconMap = iconDefs.reduce((acc, cur) => {
    acc[cur.name] = cur.icon;
    return acc;
  }, {});

  // Adapt apiDatas.services to the shape the card expects
  const services = infraStatus?.services?.map((s) => ({
    code: s.name,
    name: displayNames[s.name] ?? s.name,
    isRunning: s.isRunning,
    usageCount: s.usageCount,
    endpoints: s.endpoints,
    icon: iconMap[s.name] ?? <Database size={18} />,
  }));

  // Split left/right dynamically
  const leftCount = Math.ceil(services?.length / 2);
  const leftServices = services?.slice(0, leftCount);
  const rightServices = services?.slice(leftCount);

  const dbUp = infraStatus?.databaseRunning;

  useEffect(() => {
    setDBStatus(dbUp);
  }, [dbUp]);

  return (
    <div className="monitoring-root">
      {isDBStrType ? null : isDBBoolType && !dbStatus ? (
        <h1 className="db-down-banner">
          🚨 DB is down — Please check the connection and retry later
        </h1>
      ) : null}

      {/* Title */}
      <h1 className="monitoring-title">API Monitoring Dashboard</h1>
      <p className="sweeper-text">
        Real-time service monitoring and analytics
        <span className="sweeper-line" aria-hidden="true" />
      </p>

      {/* Live Time */}
      <div className="live-time">
        <span className="ping-wrapper">
          <span className="ping-circle primary-bg"></span>
          <span className="ping-dot" />
        </span>
        <span className="primary-color">Live: {formatTime(time)}</span>
      </div>

      {/* Stats */}
      <div className="stats-container">
        {isEmptyObj ? (
          <LoaderCircle className="loader-icon" size="20" />
        ) : (
          stats.map((item, index) => (
            <div key={index} className="stat-item">
              <p style={{ fontSize: "22px" }} className="stat-value">
                {item.value}
              </p>
              <p className="stat-label">{item.label}</p>
            </div>
          ))
        )}
      </div>

      {!isEmptyObj && (
        <ArcherContainer strokeColor="#2dd4bf" lineType="straight">
          <div className="services-container">
            {/* Left services */}
            <div className="services-left">
              {leftServices?.map((srv, idx) => (
                <ArcherElement
                  key={`left-${srv.code}-${idx}`}
                  id={`srv-${srv.code}`}
                  relations={[
                    {
                      targetId: "db",
                      targetAnchor: "left",
                      sourceAnchor: "right",
                      style: {
                        strokeColor: srv.isRunning
                          ? "#05df72"
                          : "rgba(239,68,68,0.5)",
                        strokeWidth: 0.3,
                      },
                    },
                  ]}
                >
                  <div>
                    <ServiceCard service={srv} />
                  </div>
                </ArcherElement>
              ))}
            </div>

            {/* DB Center */}
            <ArcherElement id="db">
              <div className="db-wrapper">
                <div className={`db-icon ${dbUp ? "db-up" : "db-down"}`}>
                  <Database
                    size={48}
                    className={dbUp ? "db-up-color" : "db-down-color"}
                  />
                </div>
              </div>
            </ArcherElement>

            {/* Right services */}
            <div className="services-right">
              {rightServices?.map((srv, idx) => (
                <ArcherElement
                  key={`right-${srv.code}-${idx}`}
                  id={`srv-${srv.code}`}
                  relations={[
                    {
                      targetId: "db",
                      targetAnchor: "right",
                      sourceAnchor: "left",
                      style: {
                        strokeColor: srv.isRunning
                          ? "#05df72"
                          : "rgba(239,68,68,0.5)",
                        strokeWidth: 0.3,
                      },
                    },
                  ]}
                >
                  <div>
                    <ServiceCard service={srv} />
                  </div>
                </ArcherElement>
              ))}
            </div>
          </div>
        </ArcherContainer>
      )}
    </div>
  );
};

export default Monitoring;
