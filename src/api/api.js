import axios from 'axios';

import { globals } from '@/globals/appGlobals';
import { createSignature } from '@/utils/createSignature';
import { isDebugMode } from '@/utils/devDebug';
import { isAndroid, isIOS } from '@/utils/env';
import { useAccountsStore } from '@/store/accountsStore';
// ========================================================
// IMPORTANT: PLEASE DO NOT MAKE ANY CHANGES IN THIS FILE
// WITHOUT ANY DISUCSSION.
// ========================================================

// -------------------------------------------------------
// Default Params
// -------------------------------------------------------
const defaultPostParams = () => ({
  bankId: globals.bankId,
  lan: globals.lan,
  secretKey: globals.secretKey,
});

// -------------------------------------------------------
// Browser Axios Client
// -------------------------------------------------------
const apiClient = axios.create({
  baseURL: import.meta.env.DEV ? '/api' : 'https://core1.moadbusglobal.com/aimbdev',
  headers: { 'Content-Type': 'application/json' },
});

// -------------------------------------------------------
// Build Param String
// -------------------------------------------------------
function buildParamString(url, data) {
  const allParams = {
    ...defaultPostParams(),
    ...(data || {}),
    method: url.replace(/^\//, ''),
  };

  return Object.entries(allParams)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
}

// -------------------------------------------------------
// Parse Native Response
// -------------------------------------------------------
function parseNativeResponse(winParam) {
  let obj_all;
  try {
    winParam = winParam.replace(/\+/g, ' ');
    obj_all = JSON.parse(winParam);
  } catch (err) {
    console.error('Native response parse error', err, winParam);
    return { success: false, msg: 'Invalid native response', data: null };
  }

  if (!obj_all?.rs) {
    return { success: false, msg: 'No rs object in response', data: obj_all };
  }

  return {
    success: obj_all.rs.ec === '0' || obj_all.rs.ec === 0,
    msg: obj_all.rs.msg || '',
    data: obj_all.rs,
  };
}

// -------------------------------------------------------
// Send Native Request (single Cordova call)
// -------------------------------------------------------
function sendNativeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const paramString = buildParamString(url, data);
    const signature = createSignature(paramString);
    const paramFinal = [paramString, `requestsignature=${signature}`];

    if (isDebugMode()) {
      alert(`Native Request START\nURL: ${url}\nPARAMS:\n${paramString}`);
    }

    window.cordova.exec(
      (winParam) => {
        if (isDebugMode()) {
          alert(`Native SUCCESS:\n${winParam}`);
        }
        const parsed = parseNativeResponse(winParam);
        resolve({ rs: parsed.data, success: parsed.success, msg: parsed.msg });
      },
      (err) => {
        if (isDebugMode()) {
          alert(`Native ERROR:\n${JSON.stringify(err)}`);
        }
        resolve({ rs: null, success: false, msg: 'Something went wrong' });
      },
      'EncodeDecode',
      'encode',
      paramFinal,
    );
  });
}

// -------------------------------------------------------
// Main POST function (handles both native & browser)
// -------------------------------------------------------
export const post = async (url, data = {}, config = {}) => {
  if (isAndroid() || isIOS()) {
    return await sendNativeRequest(url, data);
  } else {
    const paramString = buildParamString(url, data);
    const signature = createSignature(paramString);

    config.headers = {
      ...(config.headers || {}),
      requestSignature: signature,
    };

    try {
      const finalData = { ...defaultPostParams(), ...data };

      if (isDebugMode()) {
        alert('final data.....', finalData);
      }

      const res = await apiClient.post(url, finalData, config);
      const rs = res.data.rs || res.data;
      return { rs };
    } catch (err) {
      console.error('Browser API error:', err.response?.data || err.message);
      throw err;
    }
  }
};

// -------------------------------------------------------
// Send Native Request (with native method)
// -------------------------------------------------------

export const makeNativeRequest = (method, params, callback) => {
  return new Promise((resolve, reject) => {
    if (isDebugMode()) {
      alert(`Native call START\nURL: ${method}\nPARAMS:\n${params}`);
    }
 
    window.cordova.exec(
      (winParam) => {
        const parsed = parseNativeResponse(winParam);
        if (isDebugMode()) {
          alert(`Native call - ${method} SUCCESS:\n${winParam}`);
        } 
        if (callback) window[callback](parsed.data);
      },
      (err) => {
        if (isDebugMode()) {
          alert(`Native call  - ${method}  ERROR:\n ${err}`);
        } 
        resolve({ rs: null, success: false, msg: 'Something went wrong' });
      },
      'EncodeDecode',
      method,
      params,
    );
  });
};

// -------------------------------------------------------
// Main POST function (handles both normal & file upload)
// -------------------------------------------------------
export const postFile = async (url, data = {}) => {
  if (isAndroid() || isIOS()) {
    throw new Error('Mobile file upload not yet implemented');
  } else {
    try {
      // Build params for URL (including purpose, desc, loginId)
      const allParams = {
        ...defaultPostParams(),
        method: url.replace(/^\//, ''),
        roi: data.roi,
        purpose: data.purpose,
        desc: data.desc,
        loginId: data.loginId,
        respType: data.respType || 'json',
      };

      // Build query string
      const paramString = Object.entries(allParams)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');

      // Create signature
      const signature = createSignature(paramString);

      // Create FormData with ONLY file as 'formFile'
      const formData = new FormData();

      if (data.files && data.files.length > 0) {
        const file = data.files[0];
        formData.append('formFile', file, file.name);
      }

      console.log('Upload URL:', `${url}?${paramString}`);
      console.log('File field name: formFile');

      // Send request
      const res = await apiClient.post(`${url}?${paramString}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          requestSignature: signature,
        },
      });

      console.log('Upload response:', res.data);

      const rs = res.data.rs || res.data;
      return { rs };
    } catch (err) {
      console.error('File upload error:', err.response?.data || err.message);
      throw err;
    }
  }
};

