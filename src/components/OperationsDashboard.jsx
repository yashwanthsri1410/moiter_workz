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
import { getDashboardData } from "../services/service";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
axios.defaults.baseURL = `${API_BASE_URL}/fes/api/`;

const OperationsDashboard = () => {
  const {
    setLoadedData,
    setUnLoadedData,
    setWalletPerformanceData,
    setTransactionData,
    setProductData,
    setError,
    error,
    setKycStatusData,
  } = useOperationStore();

  const fetchData = async () => {
    const apiConfigs = [
      {
        key: "loaded",
        call: getDashboardData(loadedUrl),
        setter: setLoadedData,
        errorMsg: "Failed to load Loaded Data",
      },
      {
        key: "unloaded",
        call: getDashboardData(unLoadedUrl),
        setter: setUnLoadedData,
        errorMsg: "Failed to load Unloaded Data",
      },
      {
        key: "walletPerfomance",
        call: getDashboardData(walletPerfomanceUrl),
        setter: setWalletPerformanceData,
        errorMsg: "Failed to load Wallet Perfomance Data",
      },
      {
        key: "transaction",
        call: getDashboardData(transactionUrl),
        setter: setTransactionData,
        errorMsg: "Failed to load weekly Trends Data",
      },
      {
        key: "product",
        call: getDashboardData(productUrl),
        setter: setProductData,
        errorMsg: "Failed to load Product Data",
      },
      {
        key: "kyc",
        call: getDashboardData(kycStatusUrl),
        setter: setKycStatusData,
        errorMsg: "Failed to load KYC Data",
      },
    ];

    const results = await Promise.allSettled(apiConfigs.map((api) => api.call));

    results.forEach((res, i) => {
      const { key, setter, errorMsg } = apiConfigs[i];
      if (res.status === "fulfilled") {
        setter(res?.value?.data);
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

  if (Object.values(error).length === 0) {
    return null;
  }

  if (Object.values(error).every(Boolean)) {
    return (
      <h1 className="text-red-500 text-center mt-5">
        Failed to Load Dashboard datas
      </h1>
    );
  }

  return (
    <>
      <div className="text-center">
        <h1 className="root-header">Financial Dashboard Overview</h1>
        <p className="root-sub-header">
          Real-time insights into wallet operations, transactions and system
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
    </>
  );
};

export default OperationsDashboard;
