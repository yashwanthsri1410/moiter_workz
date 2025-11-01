import { Check, IndianRupee } from "lucide-react";
import { useState } from "react";
import { paymentOptions } from "../../../constants/merchantForm";

const PaymentConfig = () => {
  const [formData, setFormData] = useState({
    paymentMethods: {},
    mdrType: "percentage", // 'percentage' or 'flat'
    mdrValue: "",
  });

  const handleCheckboxToggle = (id) => {
    setFormData((prev) => {
      const updated = {
        ...prev.paymentMethods,
        [id]: !prev.paymentMethods[id],
      };
      // If 'All' is clicked, toggle all others
      if (id === "all") {
        const allValue = !prev.paymentMethods["all"];
        paymentOptions.forEach((opt) => {
          updated[opt.id] = allValue;
        });
      }
      return { ...prev, paymentMethods: updated };
    });
  };

  const handleMdrType = (type) => {
    setFormData((prev) => ({ ...prev, mdrType: type }));
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, mdrValue: value }));
  };

  return (
    <div className="p-3 rounded-lg bg-chart border border-[var(--borderBg-color)]">
      <h3 className="user-table-header primary-color flex items-center gap-2">
        <IndianRupee className="w-4 h-4" />
        Payment Configuration
      </h3>

      {/* Payment Methods */}
      <div className="space-y-1 form-group mt-3">
        <label className="flex items-center gap-2 text-sm font-medium text-chart-5">
          Payment Type (Select Multiple)
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 mt-0 gap-4">
          {paymentOptions.map((option) => (
            <div
              key={option.id}
              className={`flex items-center space-x-3 p-2 rounded-2xl ${
                option.special
                  ? "border border-[var(--borderBg-color)] bg-primary text-[#94a3b8]"
                  : "border border-chart text-[#e2e8f0] font-bold"
              }`}
            >
              <button
                type="button"
                role="checkbox"
                aria-checked={formData.paymentMethods[option.id] || false}
                onClick={() => handleCheckboxToggle(option.id)}
                className={`peer rounded border border-[var(--borderBg-color)] shadow-xs size-4 shrink-0 outline-none transition-shadow focus-visible:ring-[3px] focus-visible:rounded focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50
                ${
                  formData.paymentMethods[option.id]
                    ? "bg-chart-5 border-chart-5 text-primary-foreground"
                    : "border-chart-5/30"
                }
                `}
              >
                {formData.paymentMethods[option.id] && (
                  <Check className="w-3.5 h-3.5 bg-[#008284] text-black" />
                )}
              </button>
              <label
                style={{ marginBottom: 0 }}
                htmlFor={option.id}
                className={`font-bold flex items-center gap-2 text-sm font-medium select-none cursor-pointer ${
                  option.special ? "text-primary" : "text-foreground"
                }`}
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* MDR */}
      <div className="form-group mt-5">
        <label
          htmlFor="mdr"
          className="flex items-center gap-2 text-sm font-medium text-chart-5"
        >
          MDR (Merchant Discount Rate)
        </label>

        <div className="flex gap-3 mb-3">
          <button
            type="button"
            onClick={() => handleMdrType("percentage")}
            className={`flex-1 py-2 px-4 rounded-2xl border transition-all text-sm ${
              formData.mdrType === "percentage"
                ? "border border-[var(--borderBg-color)] bg-primary text-sm primary-color"
                : "border border-chart text-[#94a3b8]"
            }`}
          >
            Percentage (%)
          </button>
          <button
            type="button"
            onClick={() => handleMdrType("flat")}
            className={`flex-1 py-2 px-4 rounded-2xl border transition-all text-sm ${
              formData.mdrType === "flat"
                ? "border border-[var(--borderBg-color)] bg-primary text-sm primary-color"
                : "border border-chart text-[#94a3b8]"
            }`}
          >
            Flat Rate (₹)
          </button>
        </div>

        <div className="flex gap-2 items-center mt-3">
          <input
            type="number"
            step="0.01"
            placeholder={
              formData.mdrType === "percentage"
                ? "Enter percentage (e.g., 2.5)"
                : "Enter flat amount (e.g., 10)"
            }
            value={formData.mdrValue}
            onChange={handleInputChange}
            className="form-input"
          />
          {formData.mdrType && (
            <div className="flex items-center px-4 text-[#94a3b8] border border-[var(--borderBg-color)] rounded-2xl min-w-[60px] justify-center">
              {formData.mdrType === "percentage" ? "%" : "₹"}
            </div>
          )}
        </div>

        <p className="text-[10px] text-[#94a3b8] mt-1">
          {formData.mdrType === "percentage"
            ? "Enter the percentage to be charged on each transaction"
            : "Enter the flat amount to be charged on each transaction"}
        </p>
      </div>
    </div>
  );
};

export default PaymentConfig;
