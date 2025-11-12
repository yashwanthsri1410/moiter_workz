import { useEffect, useState } from "react";
import "../../styles/styles.css";
import { BookText, TrendingUp, CheckCircle, Users } from "lucide-react";
import "../../styles/styles.css";
import StatCards from "../../components/reusable/statCards";
import { primaryColor } from "../../constants";
import { getDashboardData } from "../../services/service";
const PartnerMangement = () => {
  const [partnerData, setPartnerData] = useState({});
  const fetchData = async () => {
    const res = await getDashboardData("Export/partner-performance");
    setPartnerData(res?.data);
  };

  const stats = [
    {
      title: "Active Partners",
      value: partnerData?.activePartners,
      desc: "Distribution network",
      icon: BookText,
      color: primaryColor,
    },
    {
      title: "Safe Performers",
      value: partnerData?.safePerformers,
      desc: "Above target partners",
      icon: TrendingUp,
      color: "#05df72",
    },
    {
      title: "Verified Partners",
      value: partnerData?.verifiedPartners,
      desc: "96.1% compliance rate",
      icon: CheckCircle,
      color: primaryColor,
    },
    {
      title: "New Partners",
      value: partnerData?.newPartners,
      desc: "This month",
      icon: Users,
      color: "#ffeb00",
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);
  return <StatCards stats={stats} />;
};

export default PartnerMangement;
