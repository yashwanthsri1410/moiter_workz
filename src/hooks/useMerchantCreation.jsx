import { useEffect, useState } from "react";
import {
  getMerchantDetails,
  merchantOnboarding,
  updateMerchantDetails,
} from "../services/service";
import { useMerchantFormStore } from "../store/merchantFormStore";

const UseMerchantCreation = () => {
  const { formData, updatedMerchantData, resetForm, setUpdatedMerchantData } =
    useMerchantFormStore();
  const [merchantData, setMerchantData] = useState();
  const createdBy = JSON.parse(localStorage.getItem("userData"))?.username;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const businessHours = Object.values(formData?.businessHours || {});
    const obj = formData?.paymentConfig?.paymentType || {};
    const mdrMode = formData?.paymentConfig?.mdrType;
    const mdrValue = Number(formData?.paymentConfig?.mdrValue);
    const termsAndConditions = formData?.termsAndConditions;

    const paymentType = Object.keys(obj)
      .filter((key) => obj?.[key] && key !== "all")
      .join(", ");

    if (Object.keys(obj).length === 0) {
      alert("Please select any one of payment type");
      return;
    }
    if (!termsAndConditions) {
      alert("Please accept terms and conditions.");
      return;
    }

    const payload = {
      partnerId: 1,
      fileFormat: "",
      createdBy,
      termsAndConditions,
      ...formData?.basicInfo,
      businessHours,
      ...formData?.kycInfo,
      paymentType,
      mdrMode,
      mdrValue,
    };
    if (Object.keys(updatedMerchantData).length > 0) {
      const merchantId = updatedMerchantData?.merchantId;
      const res = await updateMerchantDetails({ ...payload, merchantId });
      const isUpdated = res?.data?.status === "SUCCESS";
      console.log(res);

      if (isUpdated) {
        alert("Merchant details updated Successfully");
        setUpdatedMerchantData("");
        resetForm();
      }
      console.log(res);
    } else {
      const res = await merchantOnboarding(payload);
      const isOnboarded = res?.message?.status === "success";
      if (isOnboarded) {
        alert("Merchant Onboarded Successfully");
        resetForm();
      }
    }
  };

  const fetchData = async () => {
    const res = await getMerchantDetails();
    setMerchantData(res?.data);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return { handleSubmit, merchantData };
};

export default UseMerchantCreation;
