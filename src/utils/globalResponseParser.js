export const successResponseParser = (rcptString) => {
  if (!rcptString || typeof rcptString !== 'string') return [];

  return rcptString
    .split('|')
    .filter((item) => item && item.trim() !== '')
    .map((item) => {
      const parts = item.split('#');
      const label = parts[0]?.trim();
      let value = parts.slice(1).join('#')?.trim() || '';

      // Decode specific fields if needed (like Description)
      if (label && label.toLowerCase().includes('description')) {
        try {
          value = decodeURIComponent(decodeURIComponent(value));
        } catch (e) {
          console.error('Error decoding description:', e);
        }
      }

      return { label, value };
    });
};

export const parseOtpResponse = (response) => {
  if (!response || !response.rs) {
    return { type: 'error', message: 'No response received' };
  }

  const { status, msg, ec } = response.rs;

  // Determine type based on status or error code
  let type = 'info';
  if (status === 'success' || (ec && ec.toString().startsWith('0'))) {
    type = 'success';
  } else if (status === 'error' || status === 'failed') {
    type = 'error';
  } else if (status === 'warning') {
    type = 'warning';
  }

  // Use message from response
  const message = msg || 'Operation completed';

  return { type, message };
};
