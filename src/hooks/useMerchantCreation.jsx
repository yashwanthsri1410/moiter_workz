import { merchantOnboarding, updateMerchantDetails } from "../services/service";
import { useMerchantFormStore } from "../store/merchantFormStore";
import customConfirm from "../components/reusable/CustomConfirm";
import { useZustandStore } from "../store/zustandStore";

const UseMerchantCreation = () => {
  const { formData, updatedMerchantData, resetForm, setUpdatedMerchantData } =
    useMerchantFormStore();
  const { fetchMerchantData } = useZustandStore();
  const createdBy = JSON.parse(localStorage.getItem("userData"))?.username;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const businessHours = Object.values(formData?.businessHours || {});
    const obj = formData?.paymentConfig?.paymentType || {};
    const mdrMode = formData?.paymentConfig?.mdrMode;
    const mdrValue = Number(formData?.paymentConfig?.mdrValue);
    const termsAndConditions = formData?.termsAndConditions;

    if (Object.keys(obj).length === 0) {
      alert("Please select any one of payment type");
      return;
    }
    if (!termsAndConditions) {
      alert("Please accept terms and conditions.");
      return;
    }
    const confirmAction = await customConfirm(
      "Are you sure you want to continue?"
    );
    if (!confirmAction) return;

    const payload = {
      partnerId: 1,
      fileFormat: "",
      createdBy,
      termsAndConditions,
      ...formData?.basicInfo,
      businessHours,
      ...formData?.kycInfo,
      paymentType: formData?.paymentConfig?.paymentType,
      mdrMode,
      mdrValue,
    };
    if (Object.keys(updatedMerchantData).length > 0) {
      const merchantId = updatedMerchantData?.merchantId;
      const res = await updateMerchantDetails({ ...payload, merchantId });
      const isUpdated = res?.data?.status === "SUCCESS";

      if (isUpdated) {
        alert("Merchant details updated Successfully");
        setUpdatedMerchantData("");
        resetForm();
        fetchMerchantData();
      }
    } else {
      const res = await merchantOnboarding(payload);
      const isOnboarded = res?.data?.message?.status === "success";
      if (isOnboarded) {
        alert("Application submitted successfully");
        resetForm();
        fetchMerchantData();
      }
    }
  };

  return { handleSubmit };
};

export default UseMerchantCreation;
