import React from "react";
import {
  Gift,
  CreditCard,
  Truck,
  Building2,
  Users,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  ChartColumn,
  Box,
  Handshake,
} from "lucide-react";

const productData = [
  { walletCategory: "Corporate Cards", activeWallets: 6000 },
  { walletCategory: "Fleet Cards", activeWallets: 6322 },
  { walletCategory: "Food Cards", activeWallets: 176 },
  { walletCategory: "Gift Cards", activeWallets: 6314 },
  { walletCategory: "Prepaid Cards", activeWallets: 6188 },
];

const partnerData = {
  activePartners: 17,
  inactivePartners: 9,
  safePerformers: 14,
  verifiedPartners: 12,
  newPartners: 10,
};

// Color palette
const colors = {
  product: ["#1de9b6", "#00e5ff", "#18ffff", "#64ffda", "#00bcd4"],
  partner: {
    active: "#1de9b6",
    verified: "#00b0ff",
    safe: "#00e676",
    new: "#ffca28",
  },
};

const GlassCard = ({ title, icon, children }) => (
  <div className="glass-card">
    <h3 className="flex items-center gap-2 text-teal-400 font-medium mb-4">
      {icon}
      {title}
    </h3>
    {children}
  </div>
);

const ProgressRow = ({ label, value, max, color }) => {
  const percent = Math.min((value / max) * 100, 100);
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: color }}
        ></span>
        <span className="text-gray-300 text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-3 w-2/3">
        <div className="flex-1 h-1.5 bg-gray-800 rounded-full">
          <div
            className="h-1.5 rounded-full"
            style={{ width: `${percent}%`, backgroundColor: color }}
          ></div>
        </div>
        <span className="text-gray-400 text-sm">{value.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default function PerformanceOverview() {
  // Max values for progress normalization
  const maxProduct = Math.max(...productData.map((p) => p.activeWallets));
  const { activePartners, verifiedPartners, safePerformers, newPartners } =
    partnerData;
  const maxPartner = Math.max(
    activePartners,
    verifiedPartners,
    safePerformers,
    newPartners
  );

  return (
    <div className="my-6">
      <h2 className="flex items-center gap-2 text-primary mb-6">
        <span>
          <ChartColumn size="18" />
        </span>{" "}
        Performance Overview
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Product Performance */}
        <GlassCard title="Product Performance" icon={<Box size={18} />}>
          {productData.map((item, i) => (
            <ProgressRow
              key={item.walletCategory}
              label={item.walletCategory}
              value={item.activeWallets}
              max={maxProduct}
              color={colors.product[i % colors.product.length]}
            />
          ))}
        </GlassCard>

        {/* Partner Performance */}
        <GlassCard title="Partner Performance" icon={<Handshake size={18} />}>
          <ProgressRow
            label="Active Partners"
            value={activePartners}
            max={maxPartner}
            color={colors.partner.active}
          />
          <ProgressRow
            label="Verified Partners"
            value={verifiedPartners}
            max={maxPartner}
            color={colors.partner.verified}
          />
          <ProgressRow
            label="Safe Performers"
            value={safePerformers}
            max={maxPartner}
            color={colors.partner.safe}
          />
          <ProgressRow
            label="New Partners"
            value={newPartners}
            max={maxPartner}
            color={colors.partner.new}
          />
        </GlassCard>
      </div>
    </div>
  );
}
