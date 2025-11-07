import { CircleCheckBig } from "lucide-react";
import { useMerchantFormStore } from "../../../store/merchantFormStore";

const FormButton = ({ onSubmit }) => {
  const { updatedMerchantData, resetForm } = useMerchantFormStore();
  const isUpdating = Object.keys(updatedMerchantData).length > 0;
  return (
    <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t [border-color:#021c17] gap-3 md:gap-0">
      {/* Cancel Button */}
      <button
        type="button"
        onClick={resetForm}
        className="border border-[var(--borderBg-color)] text-xs font-semibold py-2 px-3 rounded-lg cursor-pointer hover:opacity-70"
      >
        Cancel
      </button>

      {/* Submit Button */}
      <button
        type="submit"
        onClick={onSubmit}
        className="bg-[var(--primary-color)] flex items-center gap-2 border border-[var(--borderBg-color)] text-xs font-semibold py-2 px-3 rounded-lg cursor-pointer hover:opacity-80"
      >
        <CircleCheckBig className="w-4 h-4" />
        {isUpdating ? "Update & Resubmit" : "Submit for Approval"}
      </button>
    </div>
  );
};

export default FormButton;
