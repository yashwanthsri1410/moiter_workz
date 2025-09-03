import { create } from "zustand";

export const useOperationStore = create((set) => ({
  loadedData: [],
  setLoadedData: (data) => set(() => ({ loadedData: data })),

  unLoadedData: [],
  setUnLoadedData: (data) => set(() => ({ unLoadedData: data })),

  walletData: [],
  setWalletData: (data) => set(() => ({ walletData: data })),

  transactionData: [],
  setTransactionData: (data) => set(() => ({ transactionData: data })),
}));
