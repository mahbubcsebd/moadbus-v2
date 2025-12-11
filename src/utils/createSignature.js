import { globals } from '@/globals/appGlobals';
import CryptoJS from 'crypto-js';

export function createSignature(str) {
  if (!CryptoJS) return '-';

  const hash = CryptoJS.SHA256(str + globals.secretKey).toString(CryptoJS.enc.Hex);

  return hash;
}
