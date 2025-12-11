import { create } from 'zustand';

export const useSuccessModalStore = create((set) => ({
  isOpen: false,
  successData: null,
  title: 'Success',

  showSuccess: (data, title = 'Success') =>
    set({
      isOpen: true,
      successData: data,
      title,
    }),

  hideSuccess: () =>
    set({
      isOpen: false,
      successData: null,
      title: 'Success',
    }),
}));
