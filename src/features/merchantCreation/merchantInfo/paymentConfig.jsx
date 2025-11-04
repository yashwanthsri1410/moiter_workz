import { Check, IndianRupee } from "lucide-react";
import { paymentOptions } from "../../../constants/merchantForm";
import { useMerchantFormStore } from "../../../store/merchantFormStore";

const PaymentConfig = () => {
  const { formData, updateForm } = useMerchantFormStore();
  const { paymentConfig } = formData;

  const handleCheckboxToggle = (id) => {
    const updatedMethods = {
      ...paymentConfig.paymentType,
      [id]: !paymentConfig.paymentType[id],
    };

    if (id === "all") {
      const allValue = !paymentConfig.paymentType["all"];
      paymentOptions.forEach((opt) => {
        updatedMethods[opt.id] = allValue;
      });
    }
    updateForm("paymentConfig", "paymentType", updatedMethods);
  };

  const handleMdrType = (type) => updateForm("paymentConfig", "mdrType", type);
  const handleInputChange = (e) =>
    updateForm("paymentConfig", "mdrValue", e.target.value);

  return (
    <div className="p-3 rounded-lg bg-chart border border-[var(--borderBg-color)]">
      <h3 className="user-table-header primary-color flex items-center gap-1 mandatory">
        <IndianRupee className="w-4 h-4" />
        Payment Configuration
      </h3>

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
                aria-checked={paymentConfig.paymentType[option.id] || false}
                onClick={() => handleCheckboxToggle(option.id)}
                className={`peer rounded border shadow-xs size-4 shrink-0 outline-none transition-shadow ${
                  paymentConfig.paymentType[option.id]
                    ? "bg-chart-5 border-chart-5 text-primary-foreground"
                    : "border-chart-5/30"
                }`}
              >
                {paymentConfig.paymentType[option.id] && (
                  <Check className="w-3.5 h-3.5 bg-[#008284] text-black" />
                )}
              </button>
              <label
                className={`font-bold flex items-center gap-2 text-sm cursor-pointer ${
                  option.special ? "text-primary" : "text-foreground"
                }`}
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group mt-5">
        <label className="flex items-center gap-2 text-sm font-medium text-chart-5">
          MDR (Merchant Discount Rate)
        </label>

        <div className="flex gap-3 mb-3">
          <button
            type="button"
            onClick={() => handleMdrType("Percentage")}
            className={`flex-1 py-2 px-4 rounded-2xl border transition-all text-sm ${
              paymentConfig.mdrType === "Percentage"
                ? "border border-[var(--borderBg-color)] bg-primary text-sm primary-color"
                : "border border-chart text-[#94a3b8]"
            }`}
          >
            Percentage (%)
          </button>
          <button
            type="button"
            onClick={() => handleMdrType("Flat Rate")}
            className={`flex-1 py-2 px-4 rounded-2xl border transition-all text-sm ${
              paymentConfig.mdrType === "Flat Rate"
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
              paymentConfig.mdrType === "Percentage"
                ? "Enter percentage (e.g., 2.5)"
                : "Enter flat amount (e.g., 10)"
            }
            required
            value={paymentConfig.mdrValue || ""}
            onChange={handleInputChange}
            className="form-input"
          />
          {paymentConfig.mdrType && (
            <div className="flex items-center px-4 text-[#94a3b8] border border-[var(--borderBg-color)] rounded-2xl min-w-[60px] justify-center">
              {paymentConfig.mdrType === "Percentage" ? "%" : "₹"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentConfig;
