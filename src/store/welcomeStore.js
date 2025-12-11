import { create } from 'zustand';

export const useWelcomeStore = create((set) => ({
  questions: [],
  branches: [],
  transferTypes: [],

  setQuestions: (questions) => set({ questions }),
  setBranches: (branches) => set({ branches }),
  setTransferTypes: (transferTypes) => set({ transferTypes }),
}));
