// store/merchantFormStore.js
import { create } from "zustand";
import { getPinCodeDetails } from "../services/service";
import { initialFormData } from "../helper";

export const useMerchantFormStore = create((set) => ({
  formData: initialFormData,
  pinData: [],
  stateName: "",
  updatedMerchantData: {},

  populateInfo: (merchant) =>
    set((state) => ({
      formData: {
        ...state.formData,
        basicInfo: {
          ...state.formData.basicInfo,
          shopName: merchant.shopName || "",
          contactName: merchant.contactName || "",
          mobileNumber: merchant.mobileNumber || "",
          email: merchant.email || "",
          gstNumber: merchant.gstNumber || "",
          category: merchant.category || "",
          pinCode: merchant.pinCode || "",
          city: merchant.city || "",
          state: merchant.state || "",
          latitude: merchant.latitude || 11.9526,
          longitude: merchant.longitude || 79.7966,
          fullAddress: merchant.fullAddress || "",
        },
        kycInfo: {
          ...state.kycInfo,
          kycType: merchant.kycType || "",
          kycDocument: merchant.kycDocument || "",
          agreementCopy: merchant.agreementCopy || "",
          idProof: merchant.idProof || "",
          addressProof: merchant.addressProof || "",
        },
        paymentConfig: {
          ...state.paymentConfig,
          paymentType: merchant.paymentType,
          mdrMode: merchant.mdrMode,
          mdrValue: merchant.mdrValue,
        },
        termsAndConditions: merchant.termsAndConditions,
      },
    })),
  updateForm: (section, key, value) =>
    set((state) => {
      const currentSection = state.formData[section];

      // If section is an object (like basicInfo, paymentConfig)
      if (
        currentSection &&
        typeof currentSection === "object" &&
        key !== undefined
      ) {
        return {
          formData: {
            ...state.formData,
            [section]: {
              ...currentSection,
              [key]: value,
            },
          },
        };
      }

      // If section is a primitive (like termsAndConditions)
      return {
        formData: {
          ...state.formData,
          [section]: value,
        },
      };
    }),

  updateBasicInfo: (key, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        basicInfo: { ...state.formData.basicInfo, [key]: value },
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

  // ✅ Reset all form values
  resetForm: () =>
    set({
      formData: JSON.parse(JSON.stringify(initialFormData)), // deep copy to avoid mutation
      pinData: [],
      stateName: "",
      updatedMerchantData: {},
    }),
}));
