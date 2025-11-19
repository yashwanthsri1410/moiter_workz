import { Check, IndianRupee } from "lucide-react";
import { paymentOptions } from "../../../constants/merchantForm";
import { useMerchantFormStore } from "../../../store/merchantFormStore";
import { useEffect, useMemo } from "react";
import UseMdrValues from "../../../hooks/useMdrValues";

const PaymentConfig = () => {
  const { formData, updateForm } = useMerchantFormStore();
  const { MerchantDiscountRates } = UseMdrValues();

  const { paymentConfig } = formData;

  // -----------------------------
  // Checkbox Toggle
  // -----------------------------
  const handleCheckboxToggle = (id) => {
    let selectedTypes = paymentConfig.paymentType
      ? paymentConfig.paymentType.split(",").map((t) => t.trim())
      : [];

    if (id === "all") {
      const allSelected = selectedTypes.length !== paymentOptions.length - 1;
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

  // -----------------------------
  // MDR handlers
  // -----------------------------
  const handleMdrType = (type) => {
    updateForm("paymentConfig", "mdrMode", type);
    updateForm("paymentConfig", "mdrValue", ""); // clear previous selection
  };

  // -----------------------------
  // Prepare MDR lists
  // -----------------------------
  const flatRates = useMemo(
    () => MerchantDiscountRates.filter((item) => item.mdrType === "FLAT"),
    [MerchantDiscountRates]
  );
  console.log(flatRates);

  const percentageRates = useMemo(
    () => MerchantDiscountRates.filter((item) => item.mdrType === "PERCENTAGE"),
    [MerchantDiscountRates]
  );

  // -----------------------------
  // Load MDR type if coming from backend
  // -----------------------------
  useEffect(() => {
    if (paymentConfig?.mdrMode && !paymentConfig.mdrMode) {
      updateForm("paymentConfig", "mdrMode", paymentConfig.mdrMode);
    }
  }, [paymentConfig.mdrMode, paymentConfig.mdrMode, updateForm]);

  const mdrMode = paymentConfig.mdrMode || "Percentage";

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

      {/* PAYMENT TYPE */}
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

      {/* MDR TYPE */}
      <div className="form-group mt-5">
        <label className="flex items-center gap-2 text-sm font-medium text-chart-5">
          MDR (Merchant Discount Rate)
        </label>

        <div className="flex gap-3 mb-3">
          <button
            type="button"
            onClick={() => handleMdrType("Percentage")}
            className={`flex-1 py-2 px-4 rounded-2xl border transition-all text-sm ${
              mdrMode === "Percentage"
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
              mdrMode === "Flat Rate"
                ? "border border-[var(--borderBg-color)] bg-primary text-sm primary-color"
                : "border border-chart text-[#94a3b8]"
            }`}
          >
            Flat Rate (₹)
          </button>
        </div>

        {/* SELECT BLOCK */}
        <div className="flex flex-col gap-2 mt-3">
          {/* PERCENTAGE SELECT */}
          {mdrMode === "Percentage" && (
            <select
              value={paymentConfig.mdrValue || ""}
              onChange={(e) =>
                updateForm("paymentConfig", "mdrValue", e.target.value)
              }
              className="form-input w-full"
              required
            >
              <option value="" disabled>
                Select Percentage MDR
              </option>

              {percentageRates.map((item) => (
                <option key={item.mdrId} value={item.percentage}>
                  {item.displayValue}
                </option>
              ))}
            </select>
          )}

          {/* FLAT RATE SELECT */}
          {mdrMode === "Flat Rate" && (
            <select
              value={paymentConfig.mdrValue || ""}
              onChange={(e) =>
                updateForm("paymentConfig", "mdrValue", e.target.value)
              }
              className="form-input w-full"
              required
            >
              <option value="" disabled>
                Select Flat MDR
              </option>

              {flatRates.map((item) => (
                <option key={item.mdrId} value={item.flat}>
                  {item.displayValue}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentConfig;
