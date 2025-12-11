import { create } from 'zustand';

const debugStore = create((set) => ({
  debugMode: false,
  enableDebug: () => set({ debugMode: true }),
  disableDebug: () => set({ debugMode: false }),
}));

export const useDebugStore = debugStore;

export default debugStore;
