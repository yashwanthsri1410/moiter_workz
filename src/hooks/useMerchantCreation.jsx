import { useEffect, useState } from "react";
import { getMerchantDetails, merchantOnboarding } from "../services/service";
import { useMerchantFormStore } from "../store/merchantFormStore";

const UseMerchantCreation = () => {
  const { formData } = useMerchantFormStore();
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
      latitude: formData?.basicInfo?.latitude
        ? Number(formData.basicInfo.latitude)
        : null, // ✅ Convert to number or null
      longitude: formData?.basicInfo?.longitude
        ? Number(formData.basicInfo.longitude)
        : null,
      fullAddress: formData?.basicInfo?.fullAddress || "",
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
    try {
      const res = await merchantOnboarding(payload);
      // console.log("Merchant onboarding response:", res);

      const message = res?.data?.message || res?.data?.status || "";
      const isOnboarded = typeof message === "string" && message.includes("onboarded successfully");

      if (isOnboarded) {
        alert("Merchant Onboarded Successfully");
      } else {
        alert(`Unexpected response: ${message || "No message from server"}`);
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      alert("Merchant onboarding failed. Please try again.");
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
