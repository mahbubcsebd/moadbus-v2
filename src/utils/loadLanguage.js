import { getLangPack } from '@/api/endpoints';
import { useLangStore } from '@/store/langStore';
import { isDebugMode } from './devDebug';

export async function loadLanguage(lang) {
  const { setBundle } = useLangStore.getState();

  try {
    const res = await getLangPack({ lan: lang });

    const data = res?.rs?.language?.[lang]?.data || [];

    const bundleData = {};
    for (let i in data) {
      bundleData[data[i].labelId] = data[i].labelValue;
    }

    setBundle(lang, bundleData);
  } catch (err) {
    console.error('Failed to load lang pack:', err);
    if (isDebugMode()) {
      alert('Failed to load lang pack:', err);
    }
  }
}
