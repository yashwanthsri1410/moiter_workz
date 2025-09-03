import { RefreshCcw, Download } from "lucide-react";
import PieChart from "../features/pieChart";
import BarChart from "../features/barChart";
import LineChart from "../features/lineChart";
import { loadedDashboard } from "../service/loaded";
import { loadedUrl, transactionUrl, unLoadedUrl, walletUrl } from "../constants/index";
import { useOperationStore } from "../store/useOperationStore";
import { useEffect } from "react";
import "../styles/styles.css";
const OperationsDashboard = () => {
  const { setLoadedData, setUnLoadedData, setWalletData, setTransactionData } =
    useOperationStore();
  const icons = [
    {
      id: "refresh",
      icon: <RefreshCcw size={18} color="#00d4aa" />,
    },
    { id: "download", icon: <Download size={18} color="#00d4aa" /> },
  ];

  const fetchData = async () => {
    const loadedRes = await loadedDashboard(loadedUrl);
    const unloadedRes = await loadedDashboard(unLoadedUrl);
    const walletRes = await loadedDashboard(walletUrl);
    const transactionRes = await loadedDashboard(transactionUrl);
    setLoadedData(loadedRes.data);
    setUnLoadedData(unloadedRes.data);
    setWalletData(walletRes.data);
    setTransactionData(transactionRes.data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="flex justify-between items-center">
        <div className="dashboard-title">
          <h1 className="dashboard-heading">Operations Dashboard</h1>
          <p className="dashboard-subtitle">Real Time Data</p>
        </div>
        <div className="flex items-center gap-3">
          {icons && icons.map(({ id, icon }) => (
            <button key={id} className="dashboard-icon-btn">
              {icon}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 my-6">
        <PieChart isLoaded={true} />
        <PieChart />
        <BarChart />
      </div>

      <LineChart />
    </div>
  );
};

export default OperationsDashboard;
