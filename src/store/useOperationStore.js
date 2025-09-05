import { create } from "zustand";

export const useOperationStore = create((set) => ({
  loadedData: [],
  setLoadedData: (data) => set(() => ({ loadedData: data })),

  unLoadedData: [],
  setUnLoadedData: (data) => set(() => ({ unLoadedData: data })),

  walletPerfomanceData: [],
  setWalletPerfomanceData: (data) =>
    set(() => ({ walletPerfomanceData: data })),

  transactionData: [],
  setTransactionData: (data) => set(() => ({ transactionData: data })),

  productData: [],
  setProductData: (data) => set(() => ({ productData: data })),

  partnerData: [],
  setPartnerData: (data) => set(() => ({ partnerData: data })),

  error: {},
  setError: (updater) =>
    set((state) => ({
      error: typeof updater === "function" ? updater(state.error) : updater,
    })),
}));
