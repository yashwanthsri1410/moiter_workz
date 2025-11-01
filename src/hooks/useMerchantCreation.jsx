import { merchantOnboarding } from "../services/service";

const UseMerchantCreation = () => {
  const createdBy = JSON.parse(localStorage.getItem("userData"))?.username;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      partnerId: 0,
      latitude: 0,
      longitude: 0,
      fullAddress: "",
      fileFormat: "",
      createdBy,
    };
    const res = await merchantOnboarding(payload);
    console.log(res);
  };
  return { handleSubmit };
};

export default UseMerchantCreation;
