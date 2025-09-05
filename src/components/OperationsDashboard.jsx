import { RefreshCcw, Download } from "lucide-react";
import {
  loadedUrl,
  partnerUrl,
  productUrl,
  transactionUrl,
  unLoadedUrl,
  walletPerfomanceUrl,
} from "../constants/index";
import axios from "axios";
import { useOperationStore } from "../store/useOperationStore";
import { useEffect, useState } from "react";
import "../styles/styles.css";
import LoadedUnLoaded from "../features/loadedUnloaded";
import WeeklyTrends from "../features/weeklyTrends";
import WalletSummary from "../features/walletSummary";
import PerformanceOverview from "../features/perfomanceOverview";
const OperationsDashboard = () => {
  const {
    setLoadedData,
    setUnLoadedData,
    setWalletPerfomanceData,
    setTransactionData,
    setProductData,
    setPartnerData,
    setError,
  } = useOperationStore();

  const icons = [
    {
      id: "refresh",
      icon: <RefreshCcw size={18} color="#00d4aa" />,
    },
    { id: "download", icon: <Download size={18} color="#00d4aa" /> },
  ];

  const loadedDashboard = async (url) => {
    const res = await axios.get(url);
    return res;
  };

  const fetchData = async () => {
    const apiConfigs = [
      {
        key: "loaded",
        call: loadedDashboard(loadedUrl),
        setter: setLoadedData,
        errorMsg: "Failed to load Loaded Data",
      },
      {
        key: "unloaded",
        call: loadedDashboard(unLoadedUrl),
        setter: setUnLoadedData,
        errorMsg: "Failed to load Unloaded Data",
      },
      {
        key: "walletPerfomance",
        call: loadedDashboard(walletPerfomanceUrl),
        setter: setWalletPerfomanceData,
        errorMsg: "Failed to load Wallet Perfomance Data",
      },
      {
        key: "transaction",
        call: loadedDashboard(transactionUrl),
        setter: setTransactionData,
        errorMsg: "Failed to load weekly Trends Data",
      },
      {
        key: "product",
        call: loadedDashboard(productUrl),
        setter: setProductData,
        errorMsg: "Failed to load Product Data",
      },
      {
        key: "partner",
        call: loadedDashboard(partnerUrl),
        setter: setPartnerData,
        errorMsg: "Failed to load Partner Data",
      },
    ];

    const results = await Promise.allSettled(apiConfigs.map((api) => api.call));

    results.forEach((res, i) => {
      const { key, setter, errorMsg } = apiConfigs[i];
      if (res.status === "fulfilled") {
        setter(res.value.data);
        setError((prev) => ({ ...prev, [key]: null }));
      } else {
        setter(null);
        setError((prev) => ({ ...prev, [key]: errorMsg }));
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-title">
        <h1 className="dashboard-heading">Financial Dashboard Overview</h1>
        <p className="dashboard-subtitle">
          Real-time insights into wallet operations, transactions, and system
          performance
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 my-6">
        <LoadedUnLoaded isLoaded={true} />
        <LoadedUnLoaded />
        <WeeklyTrends />
      </div>
      <PerformanceOverview />
      <WalletSummary />
    </div>
  );
};

export default OperationsDashboard;
