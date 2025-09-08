import { RefreshCcw, Download } from "lucide-react";
import {
  kycStatusUrl,
  loadedUrl,
  partnerUrl,
  productUrl,
  transactionUrl,
  unLoadedUrl,
  walletPerfomanceUrl,
} from "../constants/index";
import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/dash.css";
import { useOperationStore } from "../store/operationStore";
import WalletSummary from "../features/financialDashboard/walletSummary";
import LoadedUnLoaded from "../features/financialDashboard/loadedUnloaded";
import WeeklyTrends from "../features/financialDashboard/weeklyTrends";
import PerformanceOverview from "../features/financialDashboard/perfomanceOverview";
import KYCCompliance from "../features/financialDashboard/kycCompliance";

axios.defaults.baseURL = "http://192.168.22.247/fes/api/";

const OperationsDashboard = () => {
  const {
    setLoadedData,
    setUnLoadedData,
    setWalletPerformanceData,
    setTransactionData,
    setProductData,
    setPartnerData,
    setError,
    setKycStatusData,
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
        setter: setWalletPerformanceData,
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
      // {
      //   key: "partner",
      //   call: loadedDashboard(partnerUrl),
      //   setter: setPartnerData,
      //   errorMsg: "Failed to load Partner Data",
      // },
      {
        key: "kyc",
        call: loadedDashboard(kycStatusUrl),
        setter: setKycStatusData,
        errorMsg: "Failed to load KYC Data",
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

      <div className="grid lg:grid-cols-3 gap-6 my-6 items-stretch">
        <LoadedUnLoaded isLoaded={true} />
        <LoadedUnLoaded />
        <WeeklyTrends />
      </div>
      <div className="grid grid-cols-12 gap-6 items-stretch">
        <div className="col-span-12 lg:col-span-5">
          <div className="h-full">
            <PerformanceOverview />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-7">
          <div className="h-full">
            <WalletSummary />
          </div>
        </div>
      </div>

      <KYCCompliance />
    </div>
  );
};

export default OperationsDashboard;
