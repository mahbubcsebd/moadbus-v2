import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLangStore = create(
  persist(
    (set) => ({
      lang: 'en',
      bundle: {},

      setLanguage: (lang) => set({ lang }),

      setBundle: (lang, data) =>
        set((state) => ({
          bundle: {
            ...state.bundle,
            [lang]: data,
          },
        })),
    }),
    {
      name: 'lang-storage',
      partialize: (state) => ({ lang: state.lang }),
    },
  ),
);
