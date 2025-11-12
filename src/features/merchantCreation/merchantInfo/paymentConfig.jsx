import { Check, IndianRupee } from "lucide-react";
import { paymentOptions } from "../../../constants/merchantForm";
import { useMerchantFormStore } from "../../../store/merchantFormStore";
import { useEffect } from "react";

const PaymentConfig = () => {
  const { formData, updateForm } = useMerchantFormStore();
  const { paymentConfig } = formData;

  // ✅ Toggle checkbox
  const handleCheckboxToggle = (id) => {
    let selectedTypes = paymentConfig.paymentType
      ? paymentConfig.paymentType.split(",").map((t) => t.trim())
      : [];

    if (id === "all") {
      const allSelected = selectedTypes.length !== paymentOptions.length - 1; // exclude "all"
      selectedTypes = allSelected
        ? paymentOptions.filter((opt) => opt.id !== "all").map((opt) => opt.id)
        : [];
    } else {
      if (selectedTypes.includes(id)) {
        selectedTypes = selectedTypes.filter((t) => t !== id);
      } else {
        selectedTypes.push(id);
      }
    }

    updateForm("paymentConfig", "paymentType", selectedTypes.join(", "));
  };

  // ✅ MDR handlers
  const handleMdrType = (type) => updateForm("paymentConfig", "mdrType", type);
  const handleInputChange = (e) =>
    updateForm("paymentConfig", "mdrValue", e.target.value);

  // ✅ Only initialize MDR type from backend
  useEffect(() => {
    if (paymentConfig?.mdrMode && !paymentConfig.mdrType) {
      updateForm("paymentConfig", "mdrType", paymentConfig.mdrMode);
    }
  }, [paymentConfig.mdrMode, paymentConfig.mdrType, updateForm]);

  const mdrType = paymentConfig.mdrType || "Percentage";
  const selectedTypesArray = paymentConfig.paymentType
    ? paymentConfig.paymentType.split(",").map((t) => t.trim())
    : [];

  const allSelected = paymentOptions
    .filter((opt) => opt.id !== "all")
    .every((opt) => selectedTypesArray.includes(opt.id));

  return (
    <div className="p-3 rounded-lg bg-chart border border-[var(--borderBg-color)]">
      <h3 className="user-table-header primary-color flex items-center gap-1 mandatory">
        <IndianRupee className="w-4 h-4" />
        Payment Configuration
      </h3>

      <div className="space-y-1 form-group mt-3">
        <label className="flex items-center gap-2 text-sm font-medium text-chart-5">
          Payment Type{" "}
          <span className="text-xs opacity-80">(Select Multiple)</span>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 mt-0 gap-4">
          {paymentOptions.map((option) => {
            const isChecked =
              option.id === "all"
                ? allSelected
                : selectedTypesArray.includes(option.id);

            return (
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
                  aria-checked={isChecked}
                  onClick={() => handleCheckboxToggle(option.id)}
                  className={`peer rounded border shadow-xs size-4 shrink-0 outline-none transition-shadow ${
                    isChecked
                      ? "bg-chart-5 border-chart-5 text-primary-foreground"
                      : "border-chart-5/30"
                  }`}
                >
                  {isChecked && (
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
            );
          })}
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
              mdrType === "Percentage"
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
              mdrType === "Flat Rate"
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
              mdrType === "Percentage"
                ? "Enter percentage (e.g., 2.5)"
                : "Enter flat amount (e.g., 10)"
            }
            required
            value={paymentConfig.mdrValue || ""}
            onChange={handleInputChange}
            className="form-input"
          />
          {mdrType && (
            <div className="flex items-center px-4 text-[#94a3b8] border border-[var(--borderBg-color)] rounded-2xl min-w-[60px] justify-center">
              {mdrType === "Percentage" ? "%" : "₹"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentConfig;
