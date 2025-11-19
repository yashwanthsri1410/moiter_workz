export const loadedUrl = "Export/wallet-loaded-dashboard";
export const unLoadedUrl = "Export/wallet-unloaded-dashboard";
export const transactionUrl = "Export/wallet-transcation-dashboard";
export const walletPerfomanceUrl = "Export/wallet-status-dashboard";
export const productUrl = "Export/user-wallet-category";
export const partnerUrl = "Export/partner-performance";
export const kycStatusUrl = "Export/customer_Kyc_dashboard_export";

export const weekOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const loadedColors = [
  "#86efac", // green-300
  "#4ade80", // green-400
  "#22c55e", // green-500
  "#16a34a", // green-600
  "#15803d", // green-700
  "#166534", // green-800
  "#14532d", // green-900
];

export const unLoadedColors = [
  "#f87171", // light red
  "#fb923c", // orange
  "#facc15", // yellow
  "#84cc16", // lime
  "#22c55e", // green
  "#14b8a6", // teal
  "#0ea5e9", // sky blue
  "#6366f1", // indigo
];

export const barChartColor = [
  "#10b981", // green (active)
  "#3b82f6", // blue (frozen)
  "#f59e0b", // yellow (expired)
  "#a855f7", // purple (tormented)
  "#94a3b8", // gray (inactive)
  "#ef4444", // red (blocked)
];

export const channels = ["POS", "ECOM", "QR_Code", "ATM", "Fund_transfer"];

export const options = [
  "Payment Gateway",
  "Credit Card",
  "Debit Card",
  "Net Banking",
  "UPI",
  "Cash",
];

export const transErr = {
  msg1: "Daily spend limit cannot exceed the monthly spend limit.",
  msg2: "Minimum balance must be lower than all other limits",
  msg3: "Max Balance must be equal to or lower than Cash Load Limit.",
  msg4: "Max Load Amount must be equal to or less than the Cash Load Limit.",
  msg5: "Cash load balance must be higher than all other limits",
  msg6: "Monthly spend limit cannot exceed Cash Loading Limit",
};

export const inputStyle =
  "form-input bg-transparent border border-gray-700 text-gray-200 rounded-md p-2 focus:border-teal-400 focus:outline-none";

export const paginationStyle =
  "w-6 h-6 flex items-center justify-center rounded-md primary-bg text-black text-[12px]";

export const primaryColor = getComputedStyle(document.documentElement)
  .getPropertyValue("--primary-color")
  .trim();

export const noUpdate =
  "⚠️ No changes made. Same configuration already exists for (Semi-Closed - summa).";
