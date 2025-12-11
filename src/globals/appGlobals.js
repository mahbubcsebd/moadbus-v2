import { isAndroid, isCordova, isIOS } from '@/utils/env';

const deviceId = 'C975CDA6-5AF7-4FBC-9843-9EFFC87ADBEB';
const currentPermissionID = 'O84';
export const generatedRoi = `${currentPermissionID}_${Date.now()}`;

function randomString(length, chars) {
  let result = '';
  const charactersLength = chars.length;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const getAppType = () => {
  if (isCordova()) {
    if (isAndroid()) return 'android';
    if (isIOS()) return 'iphone';
  }
  return 'WEB';
};

const defaultWebDeviceId = 'C975CDA6-5AF7-4FBC-9843-9EFFC87ADBEB';

const getDeviceID = () => {
  if (isCordova()) {
    // Real device UUID from Cordova (works on Android + iOS)
    if (window.device && window.device.uuid) {
      return window.device.uuid;
    }

    return '';
  }

  return defaultWebDeviceId;
};

export const globals = {
  bankName: 'Moadbus',
  roi: '',
  bankId: '220',
  lan: 'en',
  deviceId: getDeviceID(),
  appType: getAppType(),
  respType: 'json',
  encrypted: 'true',
  secretKey: randomString(16, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
};
