import { create } from 'zustand';

const useChatbotStore = create((set) => ({
  isOpen: false,
  isMinimized: false,

  openChatbot: () => set({ isOpen: true, isMinimized: false }),
  closeChatbot: () => set({ isOpen: false, isMinimized: false }),
  minimizeChatbot: () => set({ isMinimized: true }),
  restoreChatbot: () => set({ isMinimized: false }),
  toggleChatbot: () =>
    set((state) => ({
      isOpen: !state.isOpen,
      isMinimized: false,
    })),
}));

export default useChatbotStore;
