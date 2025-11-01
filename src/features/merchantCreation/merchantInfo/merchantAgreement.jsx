import { useState } from "react";
import { Check } from "lucide-react";

const MerchantAgreement = () => {
  const [formData, setFormData] = useState({
    agreementAccepted: false,
  });

  const toggleAgreement = () => {
    setFormData((prev) => ({
      ...prev,
      agreementAccepted: !prev.agreementAccepted,
    }));
  };

  return (
    <div className="p-3 rounded-lg bg-chart border border-[var(--borderBg-color)]">
      {/* Wrap button and label in a clickable flex container */}
      <div className="flex items-end gap-3">
        {/* Custom Checkbox */}
        <button
          type="button"
          className={`mt-1 size-4 rounded-[4px] border border-[var(--borderBg-color)] flex items-center justify-center 
            ${
              formData.agreementAccepted
                ? "bg-[#008284]"
                : "bg-input-background"
            }`}
          aria-checked={formData.agreementAccepted}
          role="checkbox"
          onClick={toggleAgreement}
        >
          {formData.agreementAccepted && (
            <Check size={14} className="text-black" />
          )}
        </button>

        {/* Label */}
        <span
          className="text-xs text-[#e2e8f0] font-semibold leading-snug cursor-pointer"
          onClick={toggleAgreement}
        >
          I confirm that the merchant has accepted the terms and conditions.
        </span>
      </div>
    </div>
  );
};

export default MerchantAgreement;
