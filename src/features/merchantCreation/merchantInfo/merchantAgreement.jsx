import { Check } from "lucide-react";
import { useMerchantFormStore } from "../../../store/merchantFormStore";

const MerchantAgreement = () => {
  const { formData, toggleAgreement } = useMerchantFormStore();

  return (
    <div className="p-3 rounded-lg bg-chart border border-[var(--borderBg-color)]">
      <div
        className="flex items-end gap-3 cursor-pointer"
        onClick={toggleAgreement}
      >
        <button
          type="button"
          className={`mt-1 size-4 rounded-[4px] border flex items-center justify-center ${
            formData.termsAndConditions ? "bg-[#008284]" : "bg-input-background"
          }`}
          aria-checked={formData.termsAndConditions}
          role="checkbox"
        >
          {formData.termsAndConditions && (
            <Check size={14} className="text-black" />
          )}
        </button>
        <span className="text-xs text-[#e2e8f0] font-semibold leading-snug">
          I confirm that the merchant has accepted the terms and conditions.
        </span>
      </div>
    </div>
  );
};

export default MerchantAgreement;
