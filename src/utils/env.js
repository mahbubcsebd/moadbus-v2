export const isAndroid = () =>
  typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

export const isIOS = () =>
  typeof navigator !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent);

export const isCordova = () =>
  typeof window !== 'undefined' && typeof window.cordova !== 'undefined';
