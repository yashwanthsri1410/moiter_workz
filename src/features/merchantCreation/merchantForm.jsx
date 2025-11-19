import { Store } from "lucide-react";
import BasicInfo from "./merchantInfo/basicInfo";
import LocationPicker from "./merchantInfo/locationPicker";
import LocationInfo from "./merchantInfo/locationInfo";
import BusinessHours from "./merchantInfo/businessHours";
import KYCInfo from "./merchantInfo/kycInfo";
import PaymentConfig from "./merchantInfo/paymentConfig";
import MerchantAgreement from "./merchantInfo/merchantAgreement";
import FormButton from "./merchantInfo/formButton";
import UseMerchantCreation from "../../hooks/useMerchantCreation";
import { useEffect } from "react";
import { useMerchantFormStore } from "../../store/merchantFormStore";
const MerchantForm = ({ formOpen, isEditing }) => {
  const { handleSubmit } = UseMerchantCreation();
  const { resetForm } = useMerchantFormStore();
  useEffect(() => {
    if (!isEditing && formOpen) resetForm();
  }, [isEditing, formOpen]);
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--borderBg-color)] shadow-[0_0_10px_var(--borderBg-color)] rounded-[12px] px-5 py-4 text-white my-5">
      <div className="flex items-center gap-2 primary-color">
        <Store className="w-4 h-4" aria-hidden="true" />
        <h3 className="user-table-header mandatory-space">
          Merchant Information
        </h3>
      </div>
      <form className="space-y-4 mt-5" onSubmit={handleSubmit}>
        <BasicInfo />
        <LocationPicker />
        <LocationInfo />
        <BusinessHours />
        <KYCInfo />
        <PaymentConfig />
        <MerchantAgreement />
        <FormButton />
      </form>
    </div>
  );
};

export default MerchantForm;
