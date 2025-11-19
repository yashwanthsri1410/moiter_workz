import { create } from "zustand";
import { getMerchantDetails } from "../services/service";

export const useZustandStore = create((set) => ({
  merchantData: null,
  fetchMerchantData: async () => {
    const res = await getMerchantDetails();
    set({ merchantData: res?.data });
  },
}));
