import debugStore from '@/store/debugStore';

export function isDebugMode() {
  return debugStore.getState().debugMode;
}
