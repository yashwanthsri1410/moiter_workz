import { Check } from "lucide-react";
import { useMerchantFormStore } from "../../../store/merchantFormStore";
import { useEffect } from "react";

const MerchantAgreement = () => {
  const { formData, updateForm, updatedMerchantData } = useMerchantFormStore();

  // On initial load, sync updatedMerchantData to formData
  useEffect(() => {
    if (updatedMerchantData?.termsAndConditions !== undefined) {
      updateForm(
        "termsAndConditions",
        undefined,
        updatedMerchantData.termsAndConditions
      );
    }
  }, [updatedMerchantData?.termsAndConditions, updateForm]);

  // Use formData for toggling
  const isAgreed = formData.termsAndConditions;

  const handleToggle = () => {
    updateForm("termsAndConditions", undefined, !isAgreed);
  };

  return (
    <div className="p-3 rounded-lg bg-chart border border-[var(--borderBg-color)]">
      <div
        className="flex items-end gap-3 cursor-pointer"
        onClick={handleToggle}
      >
        <button
          type="button"
          className={`mt-1 size-4 rounded-[4px] border flex items-center justify-center ${
            isAgreed ? "bg-[#008284]" : "bg-input-background"
          }`}
          aria-checked={isAgreed}
          role="checkbox"
        >
          {isAgreed && <Check size={14} className="text-black" />}
        </button>
        <span className="text-xs text-[#e2e8f0] font-semibold leading-snug">
          I confirm that the merchant has accepted the terms and conditions.
        </span>
      </div>
    </div>
  );
};

export default MerchantAgreement;
