// utils/fileUploadHelpers.js

/**
 * Parse file upload purposes from API
 * Format: "52#Debit Card Transaction|53#Fraudulent Check|..."
 */
export function parseFileUploadPurposes(response) {
  try {
    const rs = response?.rs || response;

    if (!rs || !rs.ats) {
      return [];
    }

    return rs.ats
      .split('|')
      .filter(Boolean)
      .map((item) => {
        const [id, label] = item.split('#');
        return {
          value: id?.trim() || '', // ID (52, 53, etc.)
          label: label?.trim() || '', // Label (Debit Card Transaction, etc.)
        };
      })
      .filter((p) => p.value && p.label);
  } catch (error) {
    console.error('Parse purposes error:', error);
    return [];
  }
}

/**
 * Parse file upload response
 * Format: "File uploaded successfully|Transaction Number#197961720|Transaction Date#2025-11-21 06:17:45|..."
 */
export function parseFileUploadResponse(response) {
  try {
    const rs = response?.rs || response;

    if (!rs) {
      throw new Error('Invalid response structure');
    }

    console.log('=== PARSING FILE UPLOAD RESPONSE ===');
    console.log('RS:', rs);

    // Check success using ec field
    const ec = rs.ec || rs.statusCode || '';
    const ecString = ec.toString();
    const isSuccess = ecString.startsWith('0') || rs.status === 'success';

    console.log('Is Success:', isSuccess);

    if (!isSuccess) {
      return {
        success: false,
        data: null,
        message: rs.msg || 'Upload failed',
      };
    }

    // Get data string from rcpt or msg
    const dataString = rs.rcpt || rs.msg || '';
    console.log('Data String:', dataString);

    // Split by pipe
    const parts = dataString.split('|').filter(Boolean);
    console.log('Parts:', parts);

    // First part is success message
    const message = parts[0] || 'File uploaded successfully';

    // Parse remaining key#value pairs
    const parsedData = {};
    parts.slice(1).forEach((part) => {
      const [key, value] = part.split('#');
      if (key && value) {
        const cleanKey = key.trim().toLowerCase().replace(/\s+/g, '');
        parsedData[cleanKey] = value.trim();
      }
    });

    console.log('Parsed Data:', parsedData);

    const finalData = {
      transactionNumber: parsedData.transactionnumber || '',
      transactionDate: parsedData.transactiondate || '',
      fileName: parsedData.filename || '',
      purpose: parsedData.purpose || '',
      description: parsedData.description || '',
    };

    console.log('Final Data:', finalData);
    console.log('=== END PARSING ===');

    return {
      success: true,
      data: finalData,
      message: message,
    };
  } catch (error) {
    console.error('Parse file upload response error:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to parse response',
    };
  }
}
