import { useLangStore } from '@/store/langStore';

export function tStatic(key) {
  const state = useLangStore.getState();
  const { lang, bundle } = state;
  return bundle?.[lang]?.[key] || key;
}
