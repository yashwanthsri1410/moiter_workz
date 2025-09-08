import { useEffect, useState } from "react";
import Monitoring from "./monitoring";
import ServiceDetails from "./serviceDetails";
import "../../styles/infra.css";
import axios from "axios";
import { useMonitoringStore } from "../../store/monitoringStore";
import { Search } from "lucide-react";
const url = "http://192.168.22.247/infra/api/Infra/";
const Infra = () => {
  const [time, setTime] = useState(new Date());
  const [error, setError] = useState("");
  const { infraSummary, setInfraStatus, setInfraSummary, dbStatus } =
    useMonitoringStore();

  const stats = [
    { value: infraSummary?.totalRequests, label: "Total Requests" },
    // { value: infraSummary?.activeServices, label: "Active Services" },
    { value: "6/6", label: "Active Services" },
    { value: infraSummary?.liveEndpoints, label: "Live Endpoints" },
  ];

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-IN", {
      hour12: true, // 24-hour format like HH:mm:ss
      timeZone: "Asia/Kolkata",
    });
  };

  const cacheClear = {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };

  const fetchData = async () => {
    try {
      // run in parallel
      const [summaryRes, statusRes] = await Promise.all([
        axios.get(`${url}infra-summary`, { headers: cacheClear }),
        axios.get(`${url}infra-status`, { headers: cacheClear }),
      ]);

      setInfraSummary(summaryRes.data);
      setInfraStatus(statusRes.data);
    } catch (error) {
      setError("Failed to Load Data Infra Summary/Status Data");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // fetchData();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const isEmptyObj = Object.keys(infraSummary).length === 0;
  const isDBStrType = typeof dbStatus === "string";
  const isDBBoolType = typeof dbStatus === "boolean";

  if (error) return <h1 className="error-message">{error}</h1>;

  return (
    <>
      <div className="monitoring-container">
        <Monitoring
          isDBStrType={isDBStrType}
          isDBBoolType={isDBBoolType}
          formatTime={formatTime}
          time={time}
          isEmptyObj={isEmptyObj}
          stats={stats}
        />
      </div>
      <ServiceDetails />
    </>
  );
};

export default Infra;
