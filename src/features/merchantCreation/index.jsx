import CreateMerchant from "./createMerchant";
import BasicInfo from "./merchantInfo/basicInfo";
import BusinessHours from "./merchantInfo/businessHours";
import FormButton from "./merchantInfo/formButton";
import KycInfo from "./merchantInfo/kycInfo";
import LocationInfo from "./merchantInfo/locationInfo";
import LocationPicker from "./merchantInfo/locationPicker";
import PaymentConfig from "./merchantInfo/paymentConfig";
import MerchantAgreement from "./merchantInfo/merchantAgreement";
import MerchantList from "./merchantList";
import { Store } from "lucide-react";
import { useRef } from "react";
import UseMerchantCreation from "../../hooks/useMerchantCreation";
const MerchantCreation = () => {
  const { handleSubmit } = UseMerchantCreation();
  const createMerchantRef = useRef(null);
  const scrollToTop = () => {
    if (createMerchantRef.current) {
      window.scrollTo({
        top: createMerchantRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  };
  return (
    <>
      {/* Header */}
      <div ref={createMerchantRef}>
        <CreateMerchant />
      </div>
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
          <KycInfo />
          <PaymentConfig />
          <MerchantAgreement />
          <FormButton />
        </form>
      </div>
      <MerchantList scrollToTop={scrollToTop} />
    </>
  );
};

export default MerchantCreation;
