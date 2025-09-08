import { create } from "zustand";
import { infraStatus, infraSummary } from "../mock/infraData";

export const useMonitoringStore = create((set) => ({
  infraSummary: {},
  setInfraSummary: (data) => set(() => ({ infraSummary: data })),

  infraStatus: {},
  setInfraStatus: (data) => set(() => ({ infraStatus: data })),

  dbStatus: "",
  setDBStatus: (data) => set(() => ({ dbStatus: data })),
}));
