import { Shield, Clock, CheckCircle2 } from "lucide-react";

export default function KYCCompliance() {
  const stats = [
    {
      label: "KYC Pending",
      value: "2,847",
      color: "text-yellow-400",
      iconBg: "bg-yellow-900/40",
      icon: <Clock className="text-yellow-400" size={20} />,
    },
    {
      label: "KYC Verified",
      value: "87,450",
      color: "text-[#00D4AA] ",
      iconBg: "bg-green-900/40",
      icon: <CheckCircle2 className="text-[#00D4AA] " size={20} />,
    },
  ];

  return (
    <div className="text-white my-6">
      {/* Header */}
      <h2 className="flex items-center gap-2 text-[18px] text-[#00D4AA] mb-6">
        <Shield size={18} />
        KYC & Compliance
      </h2>

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
              <p className="text-sm text-gray-400">{item.label}</p>
              <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            </div>

            {/* Right Icon */}
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full ${item.iconBg}`}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
