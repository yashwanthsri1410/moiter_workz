import { useEffect, useState } from "react";
import { getMerchantDiscountRateData } from "../services/service";

const UseMdrValues = () => {
  const [MerchantDiscountRates, setMerchantDiscountRates] = useState([]);
  const fetchMerchantDiscountRates = async () => {
    try {
      const res = await getMerchantDiscountRateData();
      setMerchantDiscountRates(res.data || []);
    } catch (err) {
      console.error("Error fetching MerchantDiscountRates:", err);
    }
  };

  useEffect(() => {
    fetchMerchantDiscountRates();
  }, []);
  return { MerchantDiscountRates };
};

export default UseMdrValues;
