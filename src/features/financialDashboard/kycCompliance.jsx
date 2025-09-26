import { Shield, Clock, CheckCircle2 } from "lucide-react";
import { useOperationStore } from "../../store/operationStore";

export default function KYCCompliance() {
  const { kycStatusData, error } = useOperationStore();
  // console.log(error);

  const stats = [
    {
      label: "KYC Pending",
      value: kycStatusData?.[0]?.kycPendingCount.toLocaleString("en-IN") ?? 0,
      color: "text-yellow-400",
      iconBg: "bg-yellow-900/40",
      icon: <Clock className="text-yellow-400" size={20} />,
    },
    {
      label: "KYC Verified",
      value: kycStatusData?.[0]?.kycVerifiedCount.toLocaleString("en-IN") ?? 0,
      color: "text-green-400",
      iconBg: "bg-green-900/40",
      icon: <CheckCircle2 className="text-green-500" size={20} />,
    },
  ];

  if (error?.kyc) {
    return <h1 className="text-red-500 text-xs  my-6">{error?.kyc}</h1>;
  }

  return (
    <div className="text-white my-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Shield size={18} className="primary-color" />
        <span className="root-title">KYC & Compliance</span>
      </div>

      {/* Cards */}
      <div className="flex gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="relative flex justify-between items-center p-6 glass-card max-w-[280px] w-full corner-box"
          >
            <span />
            {/* Left Text */}
            <div>
              <p className="dash-kyc-label">{item.label}</p>
              <p className={`dash-kyc-values ${item.color}`}>{item.value}</p>
            </div>

            {/* Right Icon */}
            <div
              className={`dash-kyc-icons flex items-center justify-center rounded-full ${item.iconBg}`}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
