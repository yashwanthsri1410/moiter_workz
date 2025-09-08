import { create } from "zustand";
import { infraStatus, infraSummary } from "../features/infra/mockData";

export const useMonitoringStore = create((set) => ({
  infraSummary: infraSummary,
  setInfraSummary: (data) => set(() => ({ infraSummary: data })),

  infraStatus: infraStatus,
  setInfraStatus: (data) => set(() => ({ infraStatus: data })),

  dbStatus: "",
  setDBStatus: (data) => set(() => ({ dbStatus: data })),
}));
