import { create } from 'zustand';

export const useMetaDataStore = create((set) => ({
  langs: '',
  langHash: {},
  tn: {},
  ttypes: '',
  stypes: '',
  aikey: '',
  cbt: '',

  questions: [],
  branches: [],
  transferTypes: [],

  setLangs: (langs) => set({ langs: langs }),
  setLangHashs: (langHash) => set({ langHash: langHash }),
  setTn: (tn) => set({ tn: tn }),
  setTtypes: (ttypes) => set({ ttypes: ttypes }),
  setStypes: (stypes) => set({ stypes: stypes }),
  setAikey: (aikey) => set({ aikey: aikey }),
  setCbt: (cbt) => set({ cbt: cbt }),

  setQuestions: (questions) => set({ questions }),
  setBranches: (branches) => set({ branches }),
  setTransferTypes: (transferTypes) => set({ transferTypes }),
}));
