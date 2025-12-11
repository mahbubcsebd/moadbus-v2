import { useLangStore } from '@/store/langStore';

export function useTranslation() {
  const { lang, bundle } = useLangStore((state) => state);

  return (key) => bundle?.[lang]?.[key] || key;
}

// export function useTranslation() {
//   const lang = useLangStore((s) => s.lang);
//   const bundle = useLangStore((s) => s.bundle);

//   return useCallback((key) => bundle?.[lang]?.[key] || key, [lang, bundle]);
// }
