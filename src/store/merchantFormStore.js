// store/merchantFormStore.js
import { create } from "zustand";
import { initialSchedule } from "../helper";
import { getPinCodeDetails } from "../services/service";

export const useMerchantFormStore = create((set) => ({
  formData: {
    basicInfo: { idProof: "", addressProof: "" },
    businessHours: initialSchedule,
    kycInfo: {},
    paymentConfig: {
      paymentType: {},
      mdrType: "Percentage",
      mdrValue: "",
    },
    termsAndConditions: false,
  },
  pinData: [],
  stateName: "",
  updatedMerchantData: {},

  updateForm: (section, key, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [section]: { ...state.formData[section], [key]: value },
      },
    })),

  updatePinCode: async (pinCode) => {
    set((state) => ({
      formData: {
        ...state.formData,
        basicInfo: { ...state.formData.basicInfo, pinCode },
      },
      pinData: [],
      stateName: "",
    }));

    if (pinCode.length === 6) {
      const res = await getPinCodeDetails({ pincode: pinCode });
      if (res?.data?.areas?.length > 0) {
        const cities = res.data.areas.map((area) => area.city);
        const stateName = res.data.areas[0].state;
        const isPinCodeExist = res.data.areas[0].message;
        if (isPinCodeExist) {
          alert("PinCode does not exist. Try another pinCode");
          return;
        }
        set((state) => ({
          pinData: cities,
          stateName,
          formData: {
            ...state.formData,
            basicInfo: {
              ...state.formData.basicInfo,
              state: stateName,
            },
          },
        }));
      }
    }
  },

  // ✅ Works fine with the existing object shape
  updateBusinessHours: (day, key, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        businessHours: {
          ...state.formData.businessHours,
          [day]: { ...state.formData.businessHours[day], [key]: value },
        },
      },
    })),

  toggleAgreement: () =>
    set((state) => ({
      formData: {
        ...state.formData,
        termsAndConditions: !state.formData.termsAndConditions,
      },
    })),
  setUpdatedMerchantData: (data) => set(() => ({ updatedMerchantData: data })),
}));
