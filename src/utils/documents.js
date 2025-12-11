import { makeNativeRequest } from '@/api/api';
import { globals } from '@/globals/appGlobals';
import { isAndroid, isIOS } from '@/utils/env';

/**
 * File type configuration
 */
const FILE_TYPES = {
  pdf: {
    extensions: ['.pdf'],
    mimeType: 'application/pdf',
    desc: 'pdf',
    icon: '📄',
  },
  excel: {
    extensions: ['.xls', '.xlsx', '.xlsm', '.xlsb'],
    mimeType: 'application/vnd.ms-excel',
    desc: 'xls',
    icon: '📊',
  },
  word: {
    extensions: ['.doc', '.docx'],
    mimeType: 'application/msword',
    desc: 'doc',
    icon: '📝',
  },
  powerpoint: {
    extensions: ['.ppt', '.pptx'],
    mimeType: 'application/vnd.ms-powerpoint',
    desc: 'ppt',
    icon: '📽️',
  },
  image: {
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
    mimeType: 'image/jpeg',
    desc: 'img',
    icon: '🖼️',
  },
  text: {
    extensions: ['.txt', '.csv'],
    mimeType: 'text/plain',
    desc: 'txt',
    icon: '📃',
  },
  zip: {
    extensions: ['.zip', '.rar', '.7z'],
    mimeType: 'application/zip',
    desc: 'zip',
    icon: '📦',
  },
  default: {
    extensions: [],
    mimeType: 'application/octet-stream',
    desc: 'file',
    icon: '📎',
  },
};

/**
 * Get file extension from filename or path
 */
export function getFileExtension(filename) {
  if (!filename) return '';
  const match = filename.match(/\.[^.]+$/);
  return match ? match[0].toLowerCase() : '';
}

/**
 * Detect file type from filename
 */
export function detectFileType(filename) {
  const extension = getFileExtension(filename);

  for (const [type, config] of Object.entries(FILE_TYPES)) {
    if (config.extensions.includes(extension)) {
      return { type, ...config, extension };
    }
  }

  return { type: 'default', ...FILE_TYPES.default, extension };
}

/**
 * Get MIME type for specific Excel extensions
 */
export function getExcelMimeType(extension) {
  const mimeTypes = {
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xlsm': 'application/vnd.ms-excel.sheet.macroEnabled.12',
    '.xlsb': 'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
  };
  return mimeTypes[extension] || 'application/vnd.ms-excel';
}

/**
 * Get MIME type for specific Word extensions
 */
export function getWordMimeType(extension) {
  const mimeTypes = {
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };
  return mimeTypes[extension] || 'application/msword';
}

/**
 * Get accurate MIME type based on file extension
 */
export function getAccurateMimeType(filename) {
  const extension = getFileExtension(filename);

  // Excel files
  if (['.xls', '.xlsx', '.xlsm', '.xlsb'].includes(extension)) {
    return getExcelMimeType(extension);
  }

  // Word files
  if (['.doc', '.docx'].includes(extension)) {
    return getWordMimeType(extension);
  }

  // Other types
  const fileInfo = detectFileType(filename);
  return fileInfo.mimeType;
}

/**
 * Parse document string format: "id#name#displayName#path|id#name#displayName#path"
 */
export function parseDocuments(docString) {
  if (!docString || typeof docString !== 'string' || docString.trim() === '') {
    return [];
  }

  return docString
    .split('|')
    .filter(Boolean)
    .map((doc) => {
      const [id, name, displayName, path] = doc.split('#');
      const fileName = path ? path.split('/').pop() : displayName?.trim() || '';
      const fileInfo = detectFileType(fileName);

      return {
        id: parseInt(id) || 0,
        name: name?.trim() || '',
        displayName: displayName?.trim() || '',
        path: path?.trim() || '',
        fileName: fileName,
        fileType: fileInfo.type,
        fileExtension: fileInfo.extension,
        mimeType: getAccurateMimeType(fileName),
        icon: fileInfo.icon,
        desc: fileInfo.desc,
      };
    });
}

/**
 * Transform API response - handles pipe-separated document strings
 */
export function transformDocumentResponse(response) {
  try {
    const rs = response?.rs || response;

    if (!rs) {
      throw new Error('Invalid response structure');
    }

    if (rs.documents && typeof rs.documents === 'string') {
      const parsedDocs = parseDocuments(rs.documents);

      return {
        success: true,
        documents: parsedDocs,
        message: 'Documents loaded successfully',
      };
    }

    if (Array.isArray(rs.documents)) {
      return {
        success: true,
        documents: rs.documents,
        message: 'Documents loaded successfully',
      };
    }

    return {
      success: false,
      documents: [],
      message: 'No documents available',
    };
  } catch (error) {
    console.error('Transform error:', error);
    return {
      success: false,
      documents: [],
      message: error.message || 'Failed to parse documents',
    };
  }
}

/**
 * Build download URL for web
 */
export function buildDownloadUrl(doc, bankId) {
  const baseUrl = import.meta.env.DEV
    ? '/api/downloadDocument'
    : 'https://core1.moadbusglobal.com/aimbdev/downloadDocument';

  const params = new URLSearchParams({
    bankId: bankId || globals.bankId,
    desc: doc.desc || 'pdf', // Use detected file type
    fileName: doc.displayName || doc.fileName || doc.name,
    id: doc.id.toString(),
  });

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Download document - handles both web and mobile
 */
/**
 * Download document - handles both web and mobile
 */
export async function downloadDocument(doc, bankId) {
  const isMobile = isAndroid() || isIOS();

  if (isMobile) {
    return downloadDocumentMobile(doc, bankId);
  } else {
    const downloadUrl = buildDownloadUrl(doc, bankId);

    const link = document.createElement('a');
    link.href = downloadUrl;

    link.setAttribute('download', doc.fileName || 'document');

    link.style.display = 'none';
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  }
}

/**
 * Download document for mobile using Cordova
 */
async function downloadDocumentMobile(doc, bankId) {
  try {
    const fileName = doc.displayName || doc.fileName || doc.name;
    const fileId = doc.id.toString();

    // Build params for native request
    const params = [
      `bankId=${bankId || globals.bankId}`,
      `lan=${globals.lan}`,
      `secretKey=${globals.secretKey}`,
      `desc=${doc.desc || 'pdf'}`, // Use detected file type
      `fileName=${encodeURIComponent(fileName)}`,
      `id=${fileId}`,
      'method=downloadDocument',
    ];

    // Show loading message
    if (window.navigator?.notification) {
      window.navigator.notification.activityStart(
        'Downloading',
        `Downloading ${
          doc.fileType === 'excel' ? 'Excel' : doc.fileType === 'word' ? 'Word' : 'document'
        }...`,
      );
    }

    // Store current document info globally for callback
    window.currentDownloadDoc = doc;

    // Call native download method
    await makeNativeRequest('downloadFile', params, 'handleDownloadCallback');

    return true;
  } catch (error) {
    console.error('Mobile download error:', error);

    if (window.navigator?.notification) {
      window.navigator.notification.activityStop();
      window.navigator.notification.alert(
        'Failed to download document. Please try again.',
        null,
        'Download Error',
        'OK',
      );
    } else {
      alert('Failed to download document');
    }

    return false;
  }
}

/**
 * Get user-friendly file type name
 */
export function getFileTypeName(fileType) {
  const names = {
    pdf: 'PDF',
    excel: 'Excel',
    word: 'Word',
    powerpoint: 'PowerPoint',
    image: 'Image',
    text: 'Text',
    zip: 'Archive',
    default: 'File',
  };
  return names[fileType] || 'File';
}

/**
 * Open file with appropriate app (mobile)
 */
function openFileWithApp(filePath, mimeType) {
  if (window.cordova?.plugins?.fileOpener2) {
    window.cordova.plugins.fileOpener2.open(filePath, mimeType, {
      error: function (e) {
        console.error('Error opening file:', e);
        if (window.navigator?.notification) {
          window.navigator.notification.alert(
            'Unable to open file. Please install appropriate app.',
            null,
            'Error',
            'OK',
          );
        }
      },
      success: function () {
        console.log('File opened successfully');
      },
    });
  }
}

/**
 * Global callback for native download
 */
window.handleDownloadCallback = function (result) {
  try {
    const response = typeof result === 'string' ? JSON.parse(result) : result;
    const doc = window.currentDownloadDoc;

    // Stop loading indicator
    if (window.navigator?.notification) {
      window.navigator.notification.activityStop();
    }

    if (response.success || response.ec === '0' || response.ec === 0) {
      // Success
      const message = `${getFileTypeName(doc?.fileType || 'default')} downloaded successfully!`;

      if (window.navigator?.notification) {
        window.navigator.notification.alert(message, null, 'Success', 'OK');
      } else {
        alert(message);
      }

      // If file path is provided, try to open it
      if (response.filePath && doc) {
        openFileWithApp(response.filePath, doc.mimeType);
      }
    } else {
      // Error
      const errorMsg = response.msg || response.message || 'Download failed';
      if (window.navigator?.notification) {
        window.navigator.notification.alert(errorMsg, null, 'Error', 'OK');
      } else {
        alert(errorMsg);
      }
    }
  } catch (error) {
    console.error('Download callback error:', error);
    if (window.navigator?.notification) {
      window.navigator.notification.activityStop();
      window.navigator.notification.alert('An error occurred during download', null, 'Error', 'OK');
    }
  } finally {
    // Clean up
    window.currentDownloadDoc = null;
  }
};

/**
 * Check if running in mobile app
 */
export function isMobileApp() {
  return !!(window.cordova || isAndroid() || isIOS());
}
