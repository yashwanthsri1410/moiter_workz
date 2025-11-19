import { create } from "zustand";

export const useOperationStore = create((set) => ({
  loadedData: [],
  setLoadedData: (data) => set(() => ({ loadedData: data })),

  unLoadedData: [],
  setUnLoadedData: (data) => set(() => ({ unLoadedData: data })),

  transactionData: [],
  setTransactionData: (data) => set(() => ({ transactionData: data })),

  productData: [],
  setProductData: (data) => set(() => ({ productData: data })),

  kycStatusData: [],
  setKycStatusData: (data) => set(() => ({ kycStatusData: data })),

  partnerData: [],
  setPartnerData: (data) => set(() => ({ partnerData: data })),

  walletPerformanceData: [],
  setWalletPerformanceData: (data) =>
    set(() => ({ walletPerformanceData: data })),

  error: {},
  setError: (updater) =>
    set((state) => ({
      error: typeof updater === "function" ? updater(state.error) : updater,
    })),
}));
