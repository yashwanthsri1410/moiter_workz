import { useEffect, useState } from "react";
import { getMerchantDetails, merchantOnboarding } from "../services/service";
import { useMerchantFormStore } from "../store/merchantFormStore";

const UseMerchantCreation = () => {
  const { formData } = useMerchantFormStore();
  const [merchantData, setMerchantData] = useState();
  const createdBy = JSON.parse(localStorage.getItem("userData"))?.username;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const businessHours = Object.values(formData?.businessHours);
    const obj = formData?.paymentConfig?.paymentType;
    const mdrMode = formData?.paymentConfig?.mdrType;
    const mdrValue = Number(formData?.paymentConfig?.mdrValue);
    const termsAndConditions = formData?.termsAndConditions;
    const paymentType = Object.keys(obj)
      .filter((key) => obj?.[key] && key !== "all") // keep keys with true value, exclude 'all'
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
      latitude: 5650,
      longitude: 6560,
      fullAddress: "Chennai, Thirumullaivoyil",
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
    const res = await merchantOnboarding(payload);
    const isOnboarded = res.data.message.includes("onboarded successfully");
    if (isOnboarded) {
      alert("Merchant Onboarded Successfully");
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
